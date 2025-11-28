import { useState, useEffect } from "react";
import { Product } from "../../../interfaces/Product";
import Modal from "../../Modal";
import Table from "../Table/Table";

interface Props {
  product: Product | null;
  isOpen: boolean;
  onClose: () => void;
  getMovementsByProduct: (productId: string) => Promise<any[]>;
  filterTypes?: string[]; // Tipos de movimientos a mostrar (ej: ["Ingreso", "Egreso", "Venta"])
  showStorage?: boolean; // Mostrar columna de almacén (default: true)
}

export default function ProductMovementsModal({
  product,
  isOpen,
  onClose,
  getMovementsByProduct,
  filterTypes,
  showStorage = true,
}: Props) {
  const [movements, setMovements] = useState<any[]>([]);
  const [loadingMovements, setLoadingMovements] = useState(false);

  useEffect(() => {
    if (isOpen && product?.id) {
      loadMovements();
    } else {
      // Limpiar datos al cerrar
      setMovements([]);
      setLoadingMovements(false);
    }
  }, [isOpen, product?.id]);

  const loadMovements = async () => {
    if (!product?.id) return;

    setLoadingMovements(true);
    setMovements([]);

    try {
      const movementsData = await getMovementsByProduct(product.id);
      // Filtrar por tipos si se especifican
      const filteredData = filterTypes
        ? movementsData.filter((movement: any) => {
            const movementType = movement.type || "";
            // Mapear tipos antiguos a nuevos para compatibilidad
            const typeMap: Record<string, string> = {
              Entrada: "Ingreso",
              Salida: "Egreso",
            };
            const normalizedType = typeMap[movementType] || movementType;
            return filterTypes.includes(normalizedType) || filterTypes.includes(movementType);
          })
        : movementsData;
      setMovements(filteredData);
    } catch (error) {
      console.error("Error al obtener movimientos:", error);
    } finally {
      setLoadingMovements(false);
    }
  };

  if (!isOpen || !product) return null;

  return (
    <Modal
      title={`Movimientos - ${product.name || product.sku || "Producto"}`}
      onClose={onClose}
    >
      <div className="p-6">
        {loadingMovements ? (
          <div className="flex justify-center items-center py-8">
            <div className="text-gray-600">Cargando movimientos...</div>
          </div>
        ) : movements.length === 0 ? (
          <div className="flex justify-center items-center py-8">
            <div className="text-gray-600">
              No hay movimientos registrados para este producto
            </div>
          </div>
        ) : (
          <Table
            data={movements}
            columns={[
              {
                header: "Fecha",
                key: "date",
                render: (row: any) => (
                  <span>
                    {row.date
                      ? new Date(row.date).toLocaleDateString("es-ES", {
                          year: "numeric",
                          month: "2-digit",
                          day: "2-digit",
                          hour: "2-digit",
                          minute: "2-digit",
                        })
                      : "-"}
                  </span>
                ),
              },
              {
                header: "Tipo",
                key: "type",
                render: (row: any) => {
                  const movementType = row.type || "";
                  const typeColors: Record<string, string> = {
                    Ingreso: "bg-green-100 text-green-800",
                    Entrada: "bg-green-100 text-green-800", // Compatibilidad con datos antiguos
                    Egreso: "bg-red-100 text-red-800",
                    Salida: "bg-red-100 text-red-800", // Compatibilidad con datos antiguos
                    Transferencia: "bg-blue-100 text-blue-800",
                    Venta: "bg-purple-100 text-purple-800",
                  };
                  return (
                    <span
                      className={`px-3 py-1 rounded-full text-sm font-medium ${
                        typeColors[movementType] || "bg-gray-100 text-gray-800"
                      }`}
                    >
                      {movementType || "-"}
                    </span>
                  );
                },
              },
              {
                header: "Cantidad",
                key: "quantity",
                render: (row: any) => {
                  const quantity = Number(row.quantity) || 0;
                  const movementType = row.type || "";
                  // Ingreso/Entrada y Transferencia son positivos, Egreso/Salida y Venta son negativos
                  const isPositive =
                    movementType === "Ingreso" ||
                    movementType === "Entrada" ||
                    movementType === "Transferencia";
                  return (
                    <span
                      className={`font-medium ${
                        isPositive ? "text-green-700" : "text-red-700"
                      }`}
                    >
                      {isPositive ? "+" : "-"}
                      {Math.abs(quantity)}
                    </span>
                  );
                },
              },
              ...(showStorage
                ? [
                    {
                      header: "Almacén",
                      key: "storage",
                      render: (row: any) => (
                        <span>
                          {row.Storage
                            ? `${row.Storage.rag || ""}/${row.Storage.site || ""}`
                            : "-"}
                        </span>
                      ),
                    },
                  ]
                : []),
            ]}
          />
        )}
      </div>
    </Modal>
  );
}
