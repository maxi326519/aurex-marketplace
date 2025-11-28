import { Download, FileSpreadsheet } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import * as XLSX from "xlsx";
import {
  MovementOrderStatus,
  MovementOrderType,
} from "../../../../interfaces/MovementOrders";
import useMovementOrders from "../../../../hooks/Dashboard/movementOrders/useMovementOrders";
import useProducts from "../../../../hooks/Dashboard/products/useProduct";

import DashboardLayout from "../../../../components/Dashboard/SellerDashboard";
import DragAndDrop from "../../../../components/Excel/DragAndDrop";
import Button from "../../../../components/ui/Button";
import Modal from "../../../../components/Modal";
import Table from "../../../../components/Dashboard/Table/Table";

interface StockItem {
  ean: string;
  sku: string;
  quantity: number;
}

interface StockItemState extends StockItem {
  state: "pending" | "valid" | "invalid";
  message: string;
  product?: any;
}

export default function SellersIngressPage() {
  const navigate = useNavigate();
  const movementOrders = useMovementOrders();
  const products = useProducts();
  const [productsFile, setProductsFile] = useState<File>();
  const [remittanceFile, setRemittanceFile] = useState<File | null>(null);
  const [stockData, setStockData] = useState<StockItem[]>([]);
  const [stockState, setStockState] = useState<StockItemState[]>([]);
  const [error, setError] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [validating, setValidating] = useState<boolean>(false);
  const [isCreating, setIsCreating] = useState<boolean>(false);
  const [showRemittanceModal, setShowRemittanceModal] = useState<boolean>(
    false
  );

  useEffect(() => {
    if (productsFile) {
      setLoading(true);
      convertExcelToJson(productsFile);
    }
  }, [productsFile]);

  const convertExcelToJson = (file: File) => {
    const allowedTypes = [
      "application/vnd.ms-excel",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      "application/vnd.oasis.opendocument.spreadsheet",
    ];

    if (
      !allowedTypes.includes(file.type) &&
      !file.name.match(/\.(xlsx|xls)$/i)
    ) {
      setError("El archivo no es un archivo de Excel válido.");
      setLoading(false);
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const data = e.target?.result;
      if (data) {
        try {
          const arrayBuffer = data as ArrayBuffer;
          const uint8Array = new Uint8Array(arrayBuffer);
          const workbook = XLSX.read(uint8Array, { type: "array" });
          const firstSheetName = workbook.SheetNames[0];
          const worksheet = workbook.Sheets[firstSheetName];

          // Convertir a JSON con encabezados
          const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });

          if (jsonData.length < 2) {
            setError("El archivo no contiene datos suficientes.");
            setLoading(false);
            return;
          }

          // Formatear los datos según el formato del Excel: EAN, SKU, Cantidad
          const formattedStock = formatStock(jsonData);
          setStockData(formattedStock);

          // Inicializar el estado de los items
          setStockState(
            formattedStock.map((item) => ({
              ...item,
              state: "pending" as const,
              message: "",
            }))
          );
          setError("");
        } catch (error) {
          setError(`Error al procesar el archivo: ${(error as Error).message}`);
        }
      }
      setLoading(false);
    };

    reader.onerror = () => {
      setError("Error al leer el archivo.");
      setLoading(false);
    };

    reader.readAsArrayBuffer(file);
  };

  const formatStock = (data: any[]): StockItem[] => {
    const rows = data.slice(1); // Excluir la fila de encabezados
    const stockItems: StockItem[] = [];

    rows.forEach((row, index) => {
      try {
        // Saltar filas vacías
        if (
          row.every(
            (cell: any) => cell === null || cell === undefined || cell === ""
          )
        ) {
          return;
        }

        const item: StockItem = {
          ean: String(row[0] || "").trim(), // Columna A: EAN
          sku: String(row[1] || "").trim(), // Columna B: SKU
          quantity: Number(row[2] || 0), // Columna C: Cantidad
        };

        // Validaciones requeridas
        if (!item.ean) throw new Error(`Fila ${index + 1}: EAN es requerido`);
        if (!item.sku) throw new Error(`Fila ${index + 1}: SKU es requerido`);
        if (!item.quantity || item.quantity <= 0)
          throw new Error(`Fila ${index + 1}: Cantidad debe ser mayor a 0`);

        stockItems.push(item);
      } catch (error) {
        setError(`Error en fila ${index + 2}: ${(error as Error).message}`);
      }
    });

    return stockItems;
  };

  const validateStockItems = async () => {
    if (stockData.length === 0) {
      setError("No hay items válidos para validar.");
      return;
    }

    setValidating(true);
    setError("");

    try {
      // Validar productos en el backend
      const validationResults = await products.api.validateProducts(
        stockData.map((item) => ({ ean: item.ean, sku: item.sku }))
      );

      // Actualizar el estado con los resultados de validación
      const updatedState: StockItemState[] = stockData.map((item, index) => {
        const validation = validationResults[index];
        return {
          ...item,
          state: validation.exists ? "valid" : "invalid",
          message: validation.exists
            ? "Producto encontrado"
            : "Producto no encontrado en la base de datos",
          product: validation.product,
        };
      });

      setStockState(updatedState);

      // Verificar si hay productos inválidos
      const invalidCount = updatedState.filter(
        (item) => item.state === "invalid"
      ).length;
      if (invalidCount > 0) {
        setError(
          `${invalidCount} producto(s) no encontrado(s). Por favor, verifica los datos.`
        );
      }
    } catch (error) {
      setError(
        (error as any).response?.data?.error ||
          (error as any).message ||
          "Error al validar productos"
      );
    } finally {
      setValidating(false);
    }
  };

  const handleSubmit = async () => {
    if (!productsFile) {
      setError("El archivo de productos es requerido.");
      return;
    }

    if (!remittanceFile) {
      setError("El archivo de remito es requerido.");
      return;
    }

    // Verificar que todos los productos sean válidos
    const invalidItems = stockState.filter((item) => item.state === "invalid");
    if (invalidItems.length > 0) {
      setError(
        "Hay productos inválidos. Por favor, valida los productos antes de continuar."
      );
      return;
    }

    // Prevenir crear dos veces la misma orden
    if (isCreating) {
      setError("Ya se está creando una orden. Por favor espera.");
      return;
    }

    setIsCreating(true);
    setError("");

    try {
      await movementOrders.pendings.create(
        {
          date: new Date(),
          type: MovementOrderType.ENTRADA,
          state: MovementOrderStatus.PENDING,
          sheetFile: "",
          remittance: "",
        },
        productsFile,
        remittanceFile
      );

      // Reset form and navigate back
      setProductsFile(undefined);
      setRemittanceFile(null);
      setStockData([]);
      setStockState([]);
      navigate("/panel/vendedor/inventario/solicitudes");
    } catch (error) {
      setError(
        (error as any).response?.data?.error ||
          (error as any).message ||
          "Error al crear la orden"
      );
    } finally {
      setIsCreating(false);
    }
  };

  function downloadExcel() {
    const fileUrl = `/modelo-excel.xlsx`;
    const link = document.createElement("a");
    link.href = fileUrl;
    link.download = fileUrl;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  const tableColumns = [
    {
      header: "EAN",
      key: "ean",
      render: (row: StockItemState) => <b># {row.ean}</b>,
    },
    {
      header: "SKU",
      key: "sku",
      render: (row: StockItemState) => <b># {row.sku}</b>,
    },
    {
      header: "Cantidad",
      key: "quantity",
      render: (row: StockItemState) => <span>{row.quantity}</span>,
    },
    {
      header: "Estado",
      key: "state",
      render: (row: StockItemState) => (
        <div className="flex flex-col gap-1">
          <span
            className={`px-3 py-1 rounded-full text-sm font-medium ${
              row.state === "pending"
                ? "bg-yellow-100 text-yellow-800"
                : row.state === "valid"
                ? "bg-green-100 text-green-800"
                : "bg-red-100 text-red-800"
            }`}
          >
            {row.state === "pending"
              ? "Pendiente"
              : row.state === "valid"
              ? "✓ Válido"
              : "✗ Inválido"}
          </span>
          {row.message && (
            <span className="text-xs text-gray-600">{row.message}</span>
          )}
        </div>
      ),
    },
  ];

  const breadcrumb = [
    { label: "Inventario" },
    { label: "Solicitudes", path: "/panel/vendedor/inventario/solicitudes" },
    { label: "Nuevo Ingreso" },
  ];

  return (
    <DashboardLayout
      title="Nuevo Ingreso"
      breadcrumb={breadcrumb}
      requireActiveUser={true}
    >
      {productsFile ? (
        <div className="flex flex-col gap-4">
          {loading && stockData.length === 0 ? (
            <div className="text-center p-8">
              <p>Procesando archivo Excel...</p>
            </div>
          ) : error && stockData.length === 0 ? (
            <div className="flex flex-col gap-4 p-4">
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <p className="text-red-800 font-semibold">
                  Error al procesar el archivo
                </p>
                <p className="text-red-600 text-sm mt-2">{error}</p>
              </div>
              <div className="flex gap-2 justify-end">
                <Button
                  type="primary"
                  variant="outline"
                  onClick={() => setProductsFile(undefined)}
                >
                  Volver
                </Button>
              </div>
            </div>
          ) : (
            <>
              {error && (
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                  <p className="text-yellow-800 font-semibold">Advertencias</p>
                  <p className="text-yellow-600 text-sm mt-2">{error}</p>
                </div>
              )}

              <div className="flex justify-between items-center">
                <div className="flex gap-2">
                  <Button
                    type="primary"
                    variant="outline"
                    onClick={() => {
                      setProductsFile(undefined);
                      setStockData([]);
                      setStockState([]);
                      setRemittanceFile(null);
                    }}
                  >
                    Cancelar
                  </Button>
                  <Button
                    type="primary"
                    onClick={validateStockItems}
                    disabled={validating || stockData.length === 0}
                  >
                    {validating ? "Validando..." : "Validar Productos"}
                  </Button>
                </div>
              </div>

              <Table data={stockState} columns={tableColumns} />

              {stockState.length > 0 &&
                stockState.every((item) => item.state === "valid") && (
                  <div className="flex flex-col gap-4">
                    <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                      <p className="text-green-800 font-semibold">
                        Todos los productos son válidos
                      </p>
                      <p className="text-green-600 text-sm mt-2">
                        Puedes continuar subiendo el remito y crear la orden.
                      </p>
                    </div>

                    <div className="flex flex-col gap-2">
                      {remittanceFile ? (
                        <div className="flex items-center gap-2 p-4 bg-gray-50 border border-gray-200 rounded-lg">
                          <FileSpreadsheet size={20} />
                          <span className="flex-1">{remittanceFile.name}</span>
                          <Button
                            type="primary"
                            variant="outline"
                            onClick={() => setRemittanceFile(null)}
                          >
                            Cambiar
                          </Button>
                        </div>
                      ) : (
                        <Button
                          type="primary"
                          variant="outline"
                          onClick={() => setShowRemittanceModal(true)}
                        >
                          Subir Remito
                        </Button>
                      )}
                    </div>

                    {remittanceFile && (
                      <div className="flex justify-end">
                        <Button
                          type="primary"
                          onClick={handleSubmit}
                          disabled={isCreating}
                        >
                          {isCreating
                            ? "Creando orden..."
                            : "Crear Orden de Ingreso"}
                        </Button>
                      </div>
                    )}
                  </div>
                )}
            </>
          )}
        </div>
      ) : (
        <div className="flex flex-col gap-4 w-full h-full rounded-md">
          <Button type="primary" onClick={downloadExcel}>
            <FileSpreadsheet />
            <span>Descargar modelo</span>
            <Download />
          </Button>
          <div className="bg-white">
            <DragAndDrop setFile={setProductsFile} />
          </div>
        </div>
      )}

      {showRemittanceModal && (
        <Modal
          title="Subir Remito"
          onClose={() => setShowRemittanceModal(false)}
        >
          <div className="p-6">
            <DragAndDrop
              setFile={(file) => {
                setRemittanceFile(file);
                setShowRemittanceModal(false);
              }}
              allowedTypes={["pdf", "jpg", "jpeg", "png"]}
            />
          </div>
        </Modal>
      )}
    </DashboardLayout>
  );
}
