import { Download, FileSpreadsheet } from "lucide-react";
import {
  Product,
  ProductStatus,
  VolumeType,
} from "../../../../interfaces/Product";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import * as XLSX from "xlsx";
import useProducts from "../../../../hooks/Dashboard/products/useProduct";

import DashboardLayout from "../../../../components/Dashboard/SellerDashboard";
import DragAndDrop from "../../../../components/Excel/DragAndDrop";
import Button from "../../../../components/ui/Button";
import Table from "../../../../components/Dashboard/Table/Table";
import Modal from "../../../../components/Modal";

interface ProductPostState extends Product {
  state: "pending" | "success" | "error";
  message: string;
}

export default function ImportProductsPage() {
  const navigate = useNavigate();
  const products = useProducts();
  const [productsFile, setProductsFile] = useState<File>();
  const [productsData, setProductsData] = useState<Product[]>([]);
  const [productsState, setProductsState] = useState<ProductPostState[]>([]);
  const [error, setError] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [progress, setProgress] = useState<number>(0);
  const [showSummaryModal, setShowSummaryModal] = useState<boolean>(false);

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

          // Formatear los datos según el formato del Excel
          const formattedProducts = formatProducts(jsonData);
          setProductsData(formattedProducts);

          // Inicializar el estado de los productos
          setProductsState(
            formattedProducts.map((product) => ({
              ...product,
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

  const formatProducts = (data: any[]): Product[] => {
    const rows = data.slice(1); // Excluir la fila de encabezados
    const products: Product[] = [];

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

        const product: Product = {
          ean: String(row[0] || "").trim(), // Columna A: EAN
          sku: String(row[1] || "").trim(), // Columna B: SKU
          name: String(row[2] || "").trim(), // Columna C: Nombre
          price: Number(row[3] || 0), // Columna D: Valor declarado
          volumeType:
            VolumeType[String(row[4] || "Chico") as keyof typeof VolumeType],
          totalStock: 0, // No se importa cantidad
          weight: 0, // No se importa peso
          status: ProductStatus.HIDDEN, // Valor por defecto
        };

        // Validaciones requeridas
        if (!product.ean)
          throw new Error(`Fila ${index + 1}: EAN es requerido`);
        if (!product.sku)
          throw new Error(`Fila ${index + 1}: SKU es requerido`);
        if (!product.name)
          throw new Error(
            `Fila ${index + 1}: Nombre del producto es requerido`
          );
        if (!product.price || product.price <= 0)
          throw new Error(
            `Fila ${index + 1}: Valor declarado debe ser mayor a 0`
          );
        if (!Object.values(VolumeType).includes(product.volumeType))
          throw new Error(`Fila ${index + 1}: Tipo de volumen inválido`);

        products.push(product);
      } catch (error) {
        setError(`Error en fila ${index + 2}: ${(error as Error).message}`);
      }
    });

    return products;
  };

  const sendDataInBatches = async (data: Product[]) => {
    setLoading(true);

    // Inicializar el estado de todos los productos
    const initialState: ProductPostState[] = data.map((product) => ({
      ...product,
      state: "pending" as const,
      message: "",
    }));
    setProductsState(initialState);

    let successCount = 0;
    let errorCount = 0;

    // Crear productos uno por uno
    for (let i = 0; i < data.length; i++) {
      try {
        await products.api.postProduct(data[i]);
        successCount++;

        // Actualizar estado del producto a éxito
        setProductsState((prev) => {
          const updated = [...prev];
          updated[i] = {
            ...updated[i],
            state: "success",
            message: "Producto creado exitosamente",
          };
          return updated;
        });
      } catch (error) {
        errorCount++;
        const errorMessage =
          (error as any).response?.data?.error ||
          (error as any).message ||
          "Error desconocido";

        // Actualizar estado del producto a error
        setProductsState((prev) => {
          const updated = [...prev];
          updated[i] = {
            ...updated[i],
            state: "error",
            message: errorMessage,
          };
          return updated;
        });
      }

      // Actualizar progreso
      setProgress(((i + 1) / data.length) * 100);
    }

    setLoading(false);
    setShowSummaryModal(true);
  };

  const handleSubmit = async () => {
    if (productsData.length === 0) {
      setError("No hay productos válidos para importar.");
      return;
    }

    sendDataInBatches(productsData);
  };

  const handleCloseSummary = () => {
    setShowSummaryModal(false);
    const successCount = productsState.filter((p) => p.state === "success")
      .length;
    if (successCount > 0) {
      navigate("/panel/vendedor/inventario/productos");
    }
  };

  function downloadExcel() {
    const fileUrl = `/modelo-excel-productos.xlsx`;
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
      render: (row: ProductPostState) => <b># {row.ean}</b>,
    },
    {
      header: "SKU",
      key: "sku",
      render: (row: ProductPostState) => <b># {row.sku}</b>,
    },
    {
      header: "Nombre",
      key: "name",
      render: (row: ProductPostState) => row.name,
    },
    {
      header: "Valor declarado",
      key: "price",
      render: (row: ProductPostState) => <span>${row.price}</span>,
    },
    {
      header: "Tipo volumen",
      key: "volumeType",
      render: (row: ProductPostState) => row.volumeType,
    },
    {
      header: "Estado",
      key: "state",
      render: (row: ProductPostState) => (
        <div className="flex flex-col gap-1">
          <span
            className={`px-3 py-1 rounded-full text-sm font-medium ${
              row.state === "pending"
                ? "bg-yellow-100 text-yellow-800"
                : row.state === "success"
                ? "bg-green-100 text-green-800"
                : "bg-red-100 text-red-800"
            }`}
          >
            {row.state === "pending"
              ? "Pendiente"
              : row.state === "success"
              ? "✓ Creado"
              : "✗ Error"}
          </span>
          {row.message && (
            <span className="text-xs text-gray-600">{row.message}</span>
          )}
        </div>
      ),
    },
  ];

  const breadcrumb = [
    {
      label: "Inventario",
      path: "/panel/vendedor/inventario/productos",
    },
    {
      label: "Productos",
      path: "/panel/vendedor/inventario/productos",
    },
    {
      label: "Importar Productos",
    },
  ];

  return (
    <DashboardLayout
      title="Importar Productos"
      breadcrumb={breadcrumb}
      requireActiveUser={true}
    >
      {productsFile ? (
        <div className="flex flex-col gap-4">
          {loading && productsData.length === 0 ? (
            <div className="text-center p-8">
              <p>Procesando archivo Excel...</p>
            </div>
          ) : error && productsData.length === 0 ? (
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
                    onClick={() => setProductsFile(undefined)}
                  >
                    Cancelar
                  </Button>
                  <Button
                    type="primary"
                    onClick={handleSubmit}
                    disabled={loading || productsData.length === 0}
                  >
                    {loading
                      ? `Importando... (${Math.round(progress)}%)`
                      : "Confirmar Importación"}
                  </Button>
                </div>
              </div>

              {loading && (
                <div className="w-full">
                  <div className="mb-2 text-center text-lg font-semibold">
                    Procesando archivo... ({Math.round(progress)}%)
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                    <div
                      className="bg-primary h-3 rounded-full transition-all duration-300"
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                </div>
              )}

              <Table
                data={
                  productsState.length > 0
                    ? productsState
                    : productsData.map((p) => ({
                        ...p,
                        state: "pending" as const,
                        message: "",
                      }))
                }
                columns={tableColumns}
              />
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
      {showSummaryModal && (
        <Modal title="Resumen de Importación" onClose={handleCloseSummary}>
          <div className="flex flex-col gap-4 p-6">
            {(() => {
              const successCount = productsState.filter(
                (p) => p.state === "success"
              ).length;
              const errorCount = productsState.filter(
                (p) => p.state === "error"
              ).length;
              const total = productsState.length;

              if (errorCount === 0) {
                return (
                  <div className="flex flex-col items-center gap-4">
                    <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
                      <span className="text-3xl text-green-600">✓</span>
                    </div>
                    <div className="text-center">
                      <h3 className="text-xl font-semibold text-gray-800 mb-2">
                        ¡Importación exitosa!
                      </h3>
                      <p className="text-gray-600">
                        Se importaron <strong>{successCount}</strong> productos
                        exitosamente.
                      </p>
                    </div>
                    <Button type="primary" onClick={handleCloseSummary}>
                      Continuar
                    </Button>
                  </div>
                );
              } else {
                return (
                  <div className="flex flex-col gap-4">
                    <div className="flex items-center gap-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                      <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center">
                        <span className="text-2xl text-yellow-600">⚠</span>
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-800">
                          Importación parcialmente completada
                        </h3>
                        <p className="text-sm text-gray-600">
                          {successCount} de {total} productos se importaron
                          correctamente.
                        </p>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                        <div className="text-2xl font-bold text-green-600">
                          {successCount}
                        </div>
                        <div className="text-sm text-gray-600">
                          Productos creados
                        </div>
                      </div>
                      <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                        <div className="text-2xl font-bold text-red-600">
                          {errorCount}
                        </div>
                        <div className="text-sm text-gray-600">
                          Productos con error
                        </div>
                      </div>
                    </div>
                    <div className="flex gap-2 justify-end pt-4 border-t">
                      <Button
                        type="primary"
                        variant="outline"
                        onClick={handleCloseSummary}
                      >
                        Ver detalles
                      </Button>
                      {successCount > 0 && (
                        <Button type="primary" onClick={handleCloseSummary}>
                          Continuar
                        </Button>
                      )}
                    </div>
                  </div>
                );
              }
            })()}
          </div>
        </Modal>
      )}
    </DashboardLayout>
  );
}
