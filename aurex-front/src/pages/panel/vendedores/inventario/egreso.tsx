import { Download, FileSpreadsheet } from "lucide-react";
import { useState, useEffect } from "react";
import { useBusiness } from "../../../../hooks/Dashboard/useBusiness";
import { useNavigate } from "react-router-dom";
import {
  MovementOrderStatus,
  MovementOrderType,
} from "../../../../interfaces/MovementOrders";
import * as XLSX from "xlsx";
import useMovementOrders from "../../../../hooks/Dashboard/movementOrders/useMovementOrders";
import useProducts from "../../../../hooks/Dashboard/products/useProduct";
import Swal from "sweetalert2";

import DashboardLayout from "../../../../components/Dashboard/SellerDashboard";
import DragAndDrop from "../../../../components/Excel/DragAndDrop";
import Button from "../../../../components/ui/Button";
import Table from "../../../../components/Dashboard/Table/Table";

interface StockItem {
  ean: string;
  sku: string;
  cantidad: number;
}

interface StockItemState extends StockItem {
  state: "pending" | "valid" | "invalid";
  message: string;
  product?: any;
  availableStock?: number;
}

export default function SellersEgressPage() {
  const navigate = useNavigate();
  const movementOrders = useMovementOrders();
  const products = useProducts();
  const { business } = useBusiness();
  const [productsFile, setProductsFile] = useState<File>();
  const [stockData, setStockData] = useState<StockItem[]>([]);
  const [stockState, setStockState] = useState<StockItemState[]>([]);
  const [error, setError] = useState<string>("");
  const [validating, setValidating] = useState<boolean>(false);
  const [isCreating, setIsCreating] = useState<boolean>(false);

  useEffect(() => {
    if (productsFile) {
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

          // Convertir a JSON con arrays (header: 1)
          const jsonData = XLSX.utils.sheet_to_json(worksheet, {
            header: 1,
            defval: "",
          });

          if (jsonData.length < 2) {
            setError("El archivo no contiene datos suficientes.");
            return;
          }

          // Formatear los datos según el formato del Excel (EAN, SKU, Cantidad)
          const formattedStock = formatStockFromExcel(jsonData);
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
    };

    reader.onerror = () => {
      setError("Error al leer el archivo.");
    };

    reader.readAsArrayBuffer(file);
  };

  const formatStockFromExcel = (data: any[]): StockItem[] => {
    const stockItems: StockItem[] = [];

    // Si data está vacío, retornar array vacío
    if (!data || data.length === 0) {
      return stockItems;
    }

    // Saltar la primera fila (header)
    const rows = data.slice(1);

    rows.forEach((row, index) => {
      try {
        // Asegurarse de que row es un array
        const rowArray = Array.isArray(row) ? row : Object.values(row);

        // Extraer valores por posición de columna:
        // Columna 0: EAN
        // Columna 1: SKU
        // Columna 2: Cantidad
        const ean = String(rowArray[0] || "").trim();
        const sku = String(rowArray[1] || "").trim();
        const cantidad = Number(rowArray[2] || 0);

        // Saltar filas vacías
        if (!ean && !sku && !cantidad) {
          return;
        }

        const item: StockItem = {
          ean,
          sku,
          cantidad,
        };

        // Validaciones requeridas
        if (!item.ean) throw new Error(`Fila ${index + 2}: EAN es requerido`);
        if (!item.sku) throw new Error(`Fila ${index + 2}: SKU es requerido`);
        if (!item.cantidad || item.cantidad <= 0)
          throw new Error(`Fila ${index + 2}: Cantidad debe ser mayor a 0`);

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
      setError("No hay items válidos para validar.");
      return;
    }

    if (!business?.id) {
      setError("No se pudo obtener la información del negocio.");
      return;
    }

    setValidating(true);
    setError("");

    try {
      // Solo validar productos y stock disponible (sin reservar)
      const validationResults = await products.api.validateStockOnly(
        stockData.map((item) => ({
          ean: item.ean,
          sku: item.sku,
          cantidad: item.cantidad,
        })),
        business.id
      );

      // Actualizar el estado con los resultados de validación
      const updatedState: StockItemState[] = stockData.map((item, index) => {
        const validation = validationResults[index];
        return {
          ...item,
          state: validation.exists && validation.hasStock ? "valid" : "invalid",
          message:
            validation.error ||
            (validation.hasStock
              ? "Stock disponible"
              : "Stock insuficiente"),
          product: validation.product,
          availableStock: validation.availableStock,
        };
      });

      setStockState(updatedState);

      // Verificar si hay productos inválidos o sin stock
      const invalidItems = updatedState.filter(
        (item) => item.state === "invalid"
      );
      if (invalidItems.length > 0) {
        setError(
          `${invalidItems.length} producto(s) con problemas. Revisa la tabla para más detalles.`
        );
      } else {
        setError("");
      }
    } catch (error) {
      setError(
        (error as any).response?.data?.error ||
          (error as any).message ||
          "Error al validar y reservar stock"
      );
      Swal.fire("Error", "Error al validar stock", "error");
    } finally {
      setValidating(false);
    }
  };

  async function handleSubmit() {
    if (!productsFile) {
      setError("El archivo de productos es requerido.");
      return;
    }

    // Verificar que todos los productos sean válidos y tengan stock
    const invalidItems = stockState.filter((item) => item.state === "invalid");
    if (invalidItems.length > 0) {
      setError(
        "Hay productos inválidos o sin stock disponible. Por favor, valida los productos antes de continuar."
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
      // Primero reservar el stock antes de crear la orden
      if (!business?.id) {
        setError("No se pudo obtener la información del negocio.");
        setIsCreating(false);
        return;
      }

      const reserveResults = await products.api.validateAndReserveStock(
        stockData.map((item) => ({
          ean: item.ean,
          sku: item.sku,
          cantidad: item.cantidad,
        })),
        business.id
      );

      // Verificar que todos los productos tengan stock disponible
      const invalidReserves = reserveResults.filter(
        (result) => !result.exists || !result.hasStock
      );
      if (invalidReserves.length > 0) {
        setError(
          "Algunos productos ya no tienen stock disponible. Por favor, valida nuevamente."
        );
        setIsCreating(false);
        return;
      }

      // Para egresos solo se requiere el Excel, no el remito
      await movementOrders.pendings.create(
        {
          date: new Date(),
          type: MovementOrderType.SALIDA,
          state: MovementOrderStatus.PENDING,
          sheetFile: "",
          remittance: "",
        },
        productsFile,
        null // No se requiere remito para egresos
      );

      Swal.fire("Éxito", "Orden de egreso creada exitosamente", "success");

      // Reset form and navigate back
      setProductsFile(undefined);
      setStockData([]);
      setStockState([]);
      navigate("/panel/vendedor/inventario/solicitudes");
    } catch (error) {
      console.error(error);
      setError(
        (error as any).response?.data?.error ||
          (error as any).message ||
          "Error al crear la orden"
      );
      Swal.fire("Error", "Error al crear la orden de egreso", "error");
    } finally {
      setIsCreating(false);
    }
  }

  function downloadExcel() {
    const fileUrl = `/modelo-excel.xlsx`;
    const link = document.createElement("a");
    link.href = fileUrl;
    link.download = fileUrl;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  const breadcrumb = [
    { label: "Inventario" },
    { label: "Solicitudes", path: "/panel/vendedor/inventario/solicitudes" },
    { label: "Nuevo Egreso" },
  ];

  return (
    <DashboardLayout
      title="Nuevo Egreso"
      breadcrumb={breadcrumb}
      requireActiveUser={true}
    >
      {productsFile && stockData.length > 0 && (
        <div className="flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold">Validar Stock y Crear Orden de Egreso</h2>
            <Button
              type="secondary"
              variant="outline"
              onClick={() => {
                setProductsFile(undefined);
                setStockData([]);
                setStockState([]);
                setError("");
              }}
            >
              Cancelar
            </Button>
          </div>

          <p className="text-sm text-gray-600">
            Verifica que los productos existan y tengan stock disponible. El
            stock se reservará al crear la orden.
          </p>

          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <p className="text-red-800 text-sm">{error}</p>
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
                  header: "Stock Disponible",
                  key: "availableStock",
                  render: (row: StockItemState) => (
                    <span>
                      {row.availableStock !== undefined
                        ? row.availableStock
                        : "-"}
                    </span>
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
                {
                  header: "Mensaje",
                  key: "message",
                  render: (row: StockItemState) => (
                    <span className="text-sm">{row.message || "-"}</span>
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
              {validating ? "Validando..." : "Validar Stock"}
            </Button>
            <Button
              type="primary"
              onClick={handleSubmit}
              disabled={
                isCreating ||
                stockState.some((item) => item.state === "invalid") ||
                stockData.length === 0 ||
                stockState.every((item) => item.state === "pending")
              }
            >
              {isCreating ? "Creando..." : "Crear Orden de Egreso"}
            </Button>
          </div>
        </div>
      )}
      {(!productsFile || stockData.length === 0) && (
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
    </DashboardLayout>
  );
}
