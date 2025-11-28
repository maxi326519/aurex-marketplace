import { Download, RefreshCw, Store } from "lucide-react";
import { Product, ProductStatus } from "../../../../interfaces/Product";
import { useEffect, useState } from "react";
import { normalizeFilePath } from "../../../../lib/utils";
import { MovementOrder } from "../../../../interfaces/MovementOrders";
import { User } from "../../../../interfaces/Users";
import * as XLSX from "xlsx";
import useMovementOrders from "../../../../hooks/Dashboard/movementOrders/useMovementOrders";
import useProducts from "../../../../hooks/Dashboard/products/useProduct";
import useUsers from "../../../../hooks/Dashboard/users/useUsers";

import DashboardLayout from "../../../../components/Dashboard/AdminDashboard";
import Table from "../../../../components/Dashboard/Table/Table";
import Button from "../../../../components/ui/Button";
import Modal from "../../../../components/Modal";
import DragAndDrop from "../../../../components/Excel/DragAndDrop";

interface StockItem {
  ean: string;
  sku: string;
  cantidad: number;
  almacen: string;
}

interface StockItemState extends StockItem {
  state: "pending" | "valid" | "invalid";
  message: string;
  product?: Product | null;
}

interface ComparisonRow {
  ean: string;
  sku: string;
  cantidadVendedor: number;
  cantidadAdmin: number;
}

export default function MovementOrdersApproved() {
  const users = useUsers();
  const products = useProducts();
  const { approved } = useMovementOrders();
  const [openModal, setOpenModal] = useState<MovementOrder | null>(null);
  const [errors, setErrors] = useState<string[]>([]);
  const [comparedApproved, setComparedApproved] = useState<boolean>(false);
  const [hasDifferences, setHasDifferences] = useState<boolean>(false);
  const [stockData, setStockData] = useState<StockItem[]>([]);
  const [stockState, setStockState] = useState<StockItemState[]>([]);
  const [validating, setValidating] = useState<boolean>(false);
  const [isCompleting, setIsCompleting] = useState<boolean>(false);
  const [comparisonData, setComparisonData] = useState<ComparisonRow[]>([]);
  const [showComparisonModal, setShowComparisonModal] = useState<boolean>(false);

  useEffect(() => {
    if (approved.data.length === 0) handleGetData();
  }, []);

  const handleGetData = () => {
    approved.get();
  };

  const handleGetUser = (movementOrder: MovementOrder): User | undefined => {
    return users.data.find((user) => user.id === movementOrder.UserId);
  };

  const handleOpenModal = (movementOrder: MovementOrder) => {
    setOpenModal(movementOrder);
  };

  const handleViewExcel = (data: MovementOrder) => {
    const normalizedPath = normalizeFilePath(data.sheetFile);
    window.open(`${import.meta.env.VITE_API_URL}/uploads/${normalizedPath}`);
  };

  const handleClose = () => {
    setOpenModal(null);
    setErrors([]);
    setComparedApproved(false);
    setHasDifferences(false);
    setStockData([]);
    setStockState([]);
    setComparisonData([]);
    setShowComparisonModal(false);
  };

  const handleCompare = async (file: File | null) => {
    if (openModal && file) {
      try {
        // 1) Obtener ambos excels
        const normalizedPath = normalizeFilePath(openModal.sheetFile);
        const vendorRows = await readExcel(
          `${import.meta.env.VITE_API_URL}/uploads/${normalizedPath}`
        ); // URL del vendedor
        const adminRows = await readExcel(file); // File admin

        // 2) Formatear datos del nuevo Excel (EAN, SKU, Cantidad, Almacen)
        const formattedStock = formatStockFromExcel(adminRows);
        setStockData(formattedStock);

        // Inicializar el estado de los items
        setStockState(
          formattedStock.map((item) => ({
            ...item,
            state: "pending" as const,
            message: "",
          }))
        );

        // 3) Agrupar productos del vendedor para comparación
        const vendorProducts: Product[] = groupProducts(vendorRows);
        const adminProducts: Product[] = groupProducts(adminRows);

        // 4) Comparar
        const { errors: comparisonErrors, comparisonRows } = compareProducts(vendorProducts, adminProducts);

        // 5) Mostrar resultado y determinar si hay diferencias
        if (comparisonErrors.length > 0) {
          setErrors(comparisonErrors);
          setComparisonData(comparisonRows);
          setShowComparisonModal(true); // Mostrar modal de confirmación
          setHasDifferences(true); // Hay diferencias, será "Parcial"
        } else {
          setComparedApproved(true);
          setHasDifferences(false); // No hay diferencias, será "Completado"
        }
      } catch (err) {
        console.log(err);
        console.error("Error comparando excels:", err);
        setErrors([`Error al procesar el archivo: ${(err as Error).message}`]);
      }
    }
  };

  const formatStockFromExcel = (data: any[]): StockItem[] => {
    const stockItems: StockItem[] = [];

    // Si data está vacío, retornar array vacío
    if (!data || data.length === 0) {
      return stockItems;
    }

    // Saltar la primera fila (header)
    const rows = data.slice(1);

    console.log(rows);

    rows.forEach((row, index) => {
      try {
        // Asegurarse de que row es un array
        const rowArray = Array.isArray(row) ? row : Object.values(row);

        // Extraer valores por posición de columna:
        // Columna 0: EAN
        // Columna 1: SKU
        // Columna 2: Cantidad
        // Columna 3: Almacen
        const ean = String(rowArray[0] || "").trim();
        const sku = String(rowArray[1] || "").trim();
        const cantidad = Number(rowArray[2] || 0);
        const almacen = String(rowArray[3] || "").trim();

        // Saltar filas vacías (verificar si todos los campos están vacíos)
        if (!ean && !sku && !cantidad && !almacen) {
          return;
        }

        const item: StockItem = {
          ean,
          sku,
          cantidad,
          almacen,
        };

        // Validaciones requeridas
        if (!item.ean) throw new Error(`Fila ${index + 2}: EAN es requerido`);
        if (!item.sku) throw new Error(`Fila ${index + 2}: SKU es requerido`);
        if (!item.cantidad || item.cantidad <= 0)
          throw new Error(`Fila ${index + 2}: Cantidad debe ser mayor a 0`);
        if (!item.almacen)
          throw new Error(`Fila ${index + 2}: Almacen es requerido`);

        stockItems.push(item);
      } catch (error) {
        throw new Error(
          `Error en fila ${index + 3}: ${(error as Error).message}`
        );
      }
    });

    return stockItems;
  };

  const validateStockItems = async () => {
    if (stockData.length === 0) {
      setErrors(["No hay items válidos para validar."]);
      return;
    }

    if (!openModal || !openModal.BusinessId) {
      setErrors(["No se pudo obtener la información del negocio."]);
      return;
    }

    setValidating(true);
    setErrors([]);

    try {
      // Si es SALIDA, validar stock disponible en los almacenes especificados
      // Si es ENTRADA, solo validar que los productos existan
      if (openModal.type === "SALIDA") {
        const validationResults = await products.api.validateStockByStorage(
          stockData.map((item) => ({
            ean: item.ean,
            sku: item.sku,
            cantidad: item.cantidad,
            almacen: item.almacen,
          })),
          openModal.BusinessId
        );

        // Actualizar el estado con los resultados de validación
        const updatedState: StockItemState[] = stockData.map((item, index) => {
          const validation = validationResults[index];
          return {
            ...item,
            state: validation.exists && validation.hasStock ? "valid" : "invalid",
            message: validation.error || (validation.hasStock ? `Stock disponible: ${validation.availableStock}` : "Stock insuficiente"),
            product: validation.product,
          };
        });

        setStockState(updatedState);

        // Verificar si hay productos inválidos o sin stock
        const invalidCount = updatedState.filter(
          (item) => item.state === "invalid"
        ).length;
        if (invalidCount > 0) {
          setErrors([
            `${invalidCount} producto(s) con problemas de stock. Revisa la tabla para más detalles.`,
          ]);
        } else {
          setErrors([]);
        }
      } else {
        // Para ENTRADA, solo validar que los productos existan
        const validationResults = await products.api.validateProducts(
          stockData.map((item) => ({ ean: item.ean, sku: item.sku })),
          openModal.BusinessId
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
          setErrors([
            `${invalidCount} producto(s) no encontrado(s). Puedes continuar de todas formas si deseas crear el stock solo para los productos válidos.`,
          ]);
        } else {
          setErrors([]);
        }
      }
    } catch (error) {
      setErrors([
        (error as any).response?.data?.error ||
          (error as any).message ||
          "Error al validar productos",
      ]);
    } finally {
      setValidating(false);
    }
  };

  const handleSubmit = async (movementOrder: MovementOrder) => {
    if (!movementOrder.id) {
      setErrors(["ID de orden de movimiento no encontrado"]);
      return;
    }

    if (stockData.length === 0) {
      setErrors(["No hay datos de stock para procesar"]);
      return;
    }

    setIsCompleting(true);
    setErrors([]);

    try {
      // Filtrar solo los productos válidos si hay validación previa
      const itemsToProcess =
        stockState.length > 0
          ? stockState
              .filter((item) => item.state === "valid")
              .map(({ state, message, product, ...item }) => item)
          : stockData;

      if (itemsToProcess.length === 0) {
        setErrors([
          "No hay productos válidos para procesar. Por favor, valida los productos primero.",
        ]);
        setIsCompleting(false);
        return;
      }

      // Determinar el estado basado en si hay diferencias en la comparación
      // Si hay diferencias, es "Parcial", si no hay diferencias, es "Completado"
      const finalState = hasDifferences ? "Parcial" : "Completado";

      await approved.completeWithStock(movementOrder.id, itemsToProcess, finalState);

      // Cerrar modal y resetear estado
      handleClose();
      handleGetData();
    } catch (error) {
      console.error(error);
      // El error ya se muestra en el hook
    } finally {
      setIsCompleting(false);
    }
  };

  /**
   * Lee un Excel y devuelve todas las filas como arrays (por posición de columna).
   * Sirve tanto para File (admin) como para URL (vendedor).
   */
  const readExcel = async (input: File | string): Promise<any[]> => {
    let data: ArrayBuffer;

    if (typeof input === "string") {
      // Caso URL (Excel del vendedor)
      const res = await fetch(input);
      if (!res.ok)
        throw new Error("No se pudo descargar el archivo desde la URL");
      data = await res.arrayBuffer();
    } else {
      // Caso File (Excel subido por admin)
      data = await input.arrayBuffer();
    }

    const workbook = XLSX.read(data, { type: "array" });
    const sheetName = workbook.SheetNames[0];
    const sheet = workbook.Sheets[sheetName];
    // Usar header: 1 para obtener arrays en lugar de objetos
    return XLSX.utils.sheet_to_json(sheet, { defval: "", header: 1 });
  };

  /**
   * Agrupa productos por EAN y SKU, sumando cantidades
   * (Mantiene compatibilidad con el formato anterior del Excel del vendedor)
   * Salta la primera fila porque es el encabezado
   */
  const groupProducts = (rows: any[]): Product[] => {
    const products: Product[] = [];

    // Saltar la primera fila (header)
    const dataRows = rows.slice(1);

    dataRows.forEach((row) => {
      // Create product by row
      const product: Product = {
        ean: String(row["EAN"] || row[0] || 0),
        sku: String(row["SKU"] || row[1] || 0),
        name: String(row["Producto"] || row[2] || ""),
        price: Number(row["Valor declarado"] || row[4] || 0),
        volumeType: (String(
          row["Tipo de volumen"] || row[5] || ""
        ) as unknown) as Product["volumeType"],
        weight: 0,
        totalStock: Number(row["Cantidad"] || row[2] || 0),
        status: ProductStatus.PUBLISHED,
      };
      const deposito = String(row["Deposito"] || row[3] || "");

      // Check all values
      if (
        !product.ean &&
        !product.sku &&
        !product.name &&
        !product.price &&
        !product.volumeType &&
        !product.totalStock &&
        !deposito
      )
        return; // fila inválida

      // Create or add amount
      const productFinded = products.find((p) => p.ean === product.ean);
      if (productFinded) {
        productFinded.totalStock += product.totalStock;
      } else {
        products.push(product);
      }
    });

    return products;
  };

  /**
   * Compara los productos del vendedor y del admin
sta s   * Retorna los errores y los datos de comparación para la tabla
   */
  const compareProducts = (
    vendor: Product[],
    admin: Product[]
  ): { errors: string[]; comparisonRows: ComparisonRow[] } => {
    console.log("=== INICIO COMPARACIÓN DE PRODUCTOS ===");
    console.log("📦 PRODUCTOS DEL VENDEDOR (total:", vendor.length, "):");
    console.log(JSON.stringify(vendor, null, 2));
    console.log("📦 PRODUCTOS DEL ADMIN (total:", admin.length, "):");
    console.log(JSON.stringify(admin, null, 2));
    
    const errors: string[] = [];

    // Crear mapas por EAN para comparación más eficiente
    const vendorMap = new Map<string, Product>();
    const adminMap = new Map<string, Product>();

    vendor.forEach((product) => {
      const key = product.ean || product.sku || "";
      if (key) {
        vendorMap.set(key, product);
      }
    });

    admin.forEach((product) => {
      const key = product.ean || product.sku || "";
      if (key) {
        adminMap.set(key, product);
      }
    });

    console.log("🗺️ MAPA VENDEDOR (por EAN/SKU):");
    console.log(Array.from(vendorMap.entries()).map(([key, prod]) => ({
      key,
      ean: prod.ean,
      sku: prod.sku,
      totalStock: prod.totalStock,
      type: typeof prod.totalStock,
    })));

    console.log("🗺️ MAPA ADMIN (por EAN/SKU):");
    console.log(Array.from(adminMap.entries()).map(([key, prod]) => ({
      key,
      ean: prod.ean,
      sku: prod.sku,
      totalStock: prod.totalStock,
      type: typeof prod.totalStock,
    })));

    // Revisar productos del vendedor contra admin
    console.log("\n🔍 COMPARANDO VENDEDOR vs ADMIN:");
    vendorMap.forEach((vendorProduct, key) => {
      const adminProduct = adminMap.get(key);
      console.log(`\n  Producto ${key} (EAN: ${vendorProduct.ean}, SKU: ${vendorProduct.sku}):`);
      console.log(`    Vendedor totalStock:`, vendorProduct.totalStock, `(tipo: ${typeof vendorProduct.totalStock})`);
      
      if (!adminProduct) {
        console.log(`    ❌ NO ENCONTRADO EN ADMIN`);
        errors.push(
          `❌ Producto ${key} (EAN: ${vendorProduct.ean}, SKU: ${vendorProduct.sku}) está en el Excel del vendedor pero no en el del administrador`
        );
      } else {
        console.log(`    Admin totalStock:`, adminProduct.totalStock, `(tipo: ${typeof adminProduct.totalStock})`);
        const vendorStock = Number(vendorProduct.totalStock);
        const adminStock = Number(adminProduct.totalStock);
        console.log(`    Comparación numérica: ${vendorStock} === ${adminStock}?`, vendorStock === adminStock);
        console.log(`    Comparación estricta: ${vendorProduct.totalStock} === ${adminProduct.totalStock}?`, vendorProduct.totalStock === adminProduct.totalStock);
        
        if (vendorStock !== adminStock) {
          console.log(`    ⚠️ DIFERENCIA DETECTADA`);
          errors.push(
            `⚠️ Producto ${key} (EAN: ${vendorProduct.ean}, SKU: ${vendorProduct.sku}) tiene cantidades diferentes (Vendedor: ${vendorStock}, Admin: ${adminStock})`
          );
        } else {
          console.log(`    ✅ COINCIDEN`);
        }
      }
    });

    // Revisar productos del admin contra vendedor
    console.log("\n🔍 COMPARANDO ADMIN vs VENDEDOR:");
    adminMap.forEach((adminProduct, key) => {
      const vendorProduct = vendorMap.get(key);
      console.log(`\n  Producto ${key} (EAN: ${adminProduct.ean}, SKU: ${adminProduct.sku}):`);
      
      if (!vendorProduct) {
        console.log(`    ❌ NO ENCONTRADO EN VENDEDOR`);
        errors.push(
          `❌ Producto ${key} (EAN: ${adminProduct.ean}, SKU: ${adminProduct.sku}) está en el Excel del administrador pero no en el del vendedor`
        );
      } else {
        console.log(`    ✅ ENCONTRADO EN VENDEDOR`);
      }
    });

    console.log("\n📊 RESUMEN:");
    console.log(`  Total errores encontrados: ${errors.length}`);
    console.log(`  Errores:`, errors);
    console.log("=== FIN COMPARACIÓN DE PRODUCTOS ===\n");

    // Crear array de comparación para la tabla
    const comparisonRows: ComparisonRow[] = [];
    
    // Agregar todos los productos del vendedor
    vendorMap.forEach((vendorProduct, key) => {
      const adminProduct = adminMap.get(key);
      comparisonRows.push({
        ean: vendorProduct.ean,
        sku: vendorProduct.sku,
        cantidadVendedor: Number(vendorProduct.totalStock),
        cantidadAdmin: adminProduct ? Number(adminProduct.totalStock) : 0,
      });
    });
    
    // Agregar productos del admin que no están en el vendedor
    adminMap.forEach((adminProduct, key) => {
      if (!vendorMap.has(key)) {
        comparisonRows.push({
          ean: adminProduct.ean,
          sku: adminProduct.sku,
          cantidadVendedor: 0,
          cantidadAdmin: Number(adminProduct.totalStock),
        });
      }
    });

    if (!errors.length) {
      setComparedApproved(true);
    }

    return { errors, comparisonRows };
  };

  const handleConfirmPartial = () => {
    setShowComparisonModal(false);
    setComparedApproved(true);
    setHasDifferences(true);
  };

  const handleCancel = () => {
    handleClose();
  };

  return (
    <DashboardLayout
      title="Órdenes de Movimiento / Aprobados"
      breadcrumb={[
        {
          label: "Órdenes de Movimiento",
          href: "/panel/admin/recepciones/pendientes",
        },
        { label: "Aprobados", href: "" },
      ]}
    >
      <div className="flex flex-col gap-3">
        {openModal && !comparedApproved && stockData.length === 0 && (
          <Modal title="Subir Excel de Recepción" onClose={handleClose}>
            <div className="flex flex-col gap-4">
              <p className="text-sm text-gray-600">
                Sube un archivo Excel con las columnas:{" "}
                <strong>EAN, SKU, Cantidad, Almacen</strong>
              </p>
              {errors.length > 0 && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                  {errors.map((error, index) => (
                    <p key={index} className="text-red-800 text-sm">
                      {error}
                    </p>
                  ))}
                </div>
              )}
              <DragAndDrop
                setFile={handleCompare}
                allowedTypes={["xls", "xlsx"]}
              />
            </div>
          </Modal>
        )}
        {openModal && showComparisonModal && comparisonData.length > 0 && (
          <Modal title="Diferencias Detectadas" onClose={handleCancel}>
            <div className="flex flex-col gap-4">
              <p className="text-sm text-gray-600">
                Se encontraron diferencias entre el Excel del vendedor y el del administrador.
                Por favor, revisa la tabla y decide cómo proceder:
              </p>
              
              <div className="overflow-x-auto max-h-96 overflow-y-auto">
                <table className="min-w-full border-collapse border border-gray-300">
                  <thead className="sticky top-0 bg-gray-100">
                    <tr>
                      <th className="border border-gray-300 px-4 py-2 text-left text-sm font-semibold">EAN</th>
                      <th className="border border-gray-300 px-4 py-2 text-left text-sm font-semibold">SKU</th>
                      <th className="border border-gray-300 px-4 py-2 text-left text-sm font-semibold">Cantidad (Vendedor)</th>
                      <th className="border border-gray-300 px-4 py-2 text-left text-sm font-semibold">Cantidad (Admin)</th>
                    </tr>
                  </thead>
                  <tbody>
                    {comparisonData.map((row, index) => {
                      const hasDifference = row.cantidadVendedor !== row.cantidadAdmin;
                      return (
                        <tr
                          key={index}
                          className={hasDifference ? "bg-yellow-50" : ""}
                        >
                          <td className="border border-gray-300 px-4 py-2 text-sm">{row.ean}</td>
                          <td className="border border-gray-300 px-4 py-2 text-sm">{row.sku}</td>
                          <td className="border border-gray-300 px-4 py-2 text-sm text-center">
                            {row.cantidadVendedor}
                          </td>
                          <td className="border border-gray-300 px-4 py-2 text-sm text-center">
                            {row.cantidadAdmin}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              <div className="flex gap-3 justify-end">
                <Button
                  type="secondary"
                  onClick={handleCancel}
                  variant="outline"
                  className="px-4 py-2"
                >
                  Cancelar
                </Button>
                <Button
                  type="primary"
                  onClick={handleConfirmPartial}
                  variant="solid"
                  className="px-4 py-2"
                >
                  Continuar como Parcial
                </Button>
              </div>
            </div>
          </Modal>
        )}
        {openModal && stockData.length > 0 && !showComparisonModal && (
          <Modal title="Validar y Completar Orden" onClose={handleClose}>
            <div className="flex flex-col gap-4">
              {errors.length > 0 && (
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                  {errors.map((error, index) => (
                    <p key={index} className="text-yellow-800 text-sm">
                      {error}
                    </p>
                  ))}
                </div>
              )}

              <div className="max-h-96 overflow-y-auto">
                <Table
                  columns={[
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
                      key: "cantidad",
                      render: (row: StockItemState) => (
                        <span>{row.cantidad}</span>
                      ),
                    },
                    {
                      header: "Almacen",
                      key: "almacen",
                      render: (row: StockItemState) => (
                        <span>{row.almacen}</span>
                      ),
                    },
                    {
                      header: "Estado",
                      key: "state",
                      render: (row: StockItemState) => (
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
                      ),
                    },
                  ]}
                  data={stockState}
                />
              </div>

              <div className="flex gap-2 justify-end">
                <Button
                  type="primary"
                  variant="outline"
                  onClick={validateStockItems}
                  disabled={validating}
                >
                  {validating ? "Validando..." : "Validar Productos"}
                </Button>
                <Button
                  type="primary"
                  onClick={() => handleSubmit(openModal!)}
                  disabled={
                    isCompleting ||
                    stockState.some(
                      (item) =>
                        item.state === "invalid" && stockState.length > 0
                    )
                  }
                >
                  {isCompleting ? "Procesando..." : "Completar Orden"}
                </Button>
              </div>
            </div>
          </Modal>
        )}
        <div className="flex justify-end">
          <Button type="primary" onClick={handleGetData}>
            <RefreshCw size={20} />
          </Button>
        </div>
        <Table
          columns={tableColumns(
            handleGetUser,
            handleViewExcel,
            handleOpenModal
          )}
          data={approved.data}
        />
      </div>
    </DashboardLayout>
  );
}

const tableColumns = (
  handleGetUser: (row: MovementOrder) => User | undefined,
  handleViewExcel: (data: MovementOrder) => void,
  handleCompare: (row: MovementOrder) => void
) => {
  return [
    {
      header: "Vendedor",
      key: "",
      render: (row: MovementOrder) => {
        const user = handleGetUser(row);

        return (
          <div className="flex items-center gap-4">
            <div className="flex justify-center items-center w-14 h-14 rounded-full border border-[#888] overflow-hidden">
              {user ? (
                <img
                  className="w-full h-full object-cover"
                  src={user.photo}
                  alt={user.name || "Usuario"}
                />
              ) : (
                <Store strokeWidth={1} size={25} color="#888" />
              )}
            </div>
            <span>{user?.name || ""}</span>
          </div>
        );
      },
    },
    {
      header: "Tipo",
      key: "type",
      render: (row: MovementOrder) => (
        <span
          className={`px-3 py-1 rounded-full text-sm font-medium ${
            row.type === "ENTRADA"
              ? "bg-green-100 text-green-800"
              : "bg-red-100 text-red-800"
          }`}
        >
          {row.type === "ENTRADA" ? "Ingreso" : "Egreso"}
        </span>
      ),
    },
    {
      header: "Fecha",
      key: "date",
      render: (row: MovementOrder) =>
        new Date(row.date).toLocaleString("es-CO", {
          day: "2-digit",
          month: "2-digit",
          year: "2-digit",
        }),
    },
    {
      header: "Fecha Recepción",
      key: "receptionDate",
      render: (row: MovementOrder) =>
        row.receptionDate
          ? new Date(row.receptionDate).toLocaleString("es-CO", {
              day: "2-digit",
              month: "2-digit",
              year: "2-digit",
            })
          : "-",
    },
    {
      header: "Acciones",
      key: "",
      render: (row: MovementOrder) => (
        <div className="flex gap-2 w-min">
          <Button
            type="primary"
            variant="outline"
            onClick={() => handleViewExcel(row)}
          >
            <Download size={18} /> Excel
          </Button>
          <Button type="primary" onClick={() => handleCompare(row)}>
            Comparar
          </Button>
        </div>
      ),
    },
  ];
};
