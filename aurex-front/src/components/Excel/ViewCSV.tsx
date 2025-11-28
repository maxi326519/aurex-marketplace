import { Product, ProductStatus } from "../../interfaces/Product";
import { useEffect, useState } from "react";
import { Upload } from "lucide-react";
import * as XLSX from "xlsx";
import Swal from "sweetalert2";

import Table from "../Dashboard/Table/Table";
import Separator from "../Separator";
import Button from "../ui/Button";

const tableColumns = [
  { header: "# EAN", key: "ean", reder: (row: Product) => <b>#{row.ean}</b> },
  { header: "# SKU", key: "sku", reder: (row: Product) => <b>#{row.sku}</b> },
  { header: "Nombre", key: "name" },
  {
    header: "Valor declarado",
    key: "price",
    render: (row: Product) => <span>${Number(row.price)?.toFixed(2)}</span>,
  },
  { header: "Cantidad", key: "totalStock" },
];

interface Props {
  file: File;
  remito: File | null;
  onSubmit: (data: Product[], reset: boolean) => Promise<void>;
  onSubmitRemittance: () => void;
  onBack: () => void;
  onClose: () => void;
  requireRemittance?: boolean; // Si es false, no se requiere remito
}

export default function ImportProducts({
  file,
  remito,
  onSubmitRemittance,
  onSubmit,
  onBack,
  onClose,
  requireRemittance = true,
}: Props) {
  const [products, setProducts] = useState<Product[]>([]);
  const [error, setError] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [progress, setProgress] = useState<number>(0);

  useEffect(() => {
    setLoading(true);
    convertExcelToJson(file);
  }, [file]);

  useEffect(() => {
    // TODO: manage this error
    console.log(error);
  }, [error]);

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
          setProducts(formattedProducts);
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

        // Mapear las columnas según el formato del Excel
        const product: Product = {
          ean: String(row[0] || "").trim(), // Columna A: EAN
          sku: String(row[1] || "").trim(), // Columna B: SKU
          name: String(row[2] || "").trim(), // Columna C: Producto
          totalStock: Number([row[3]]), // Columna D: Cantidad
          price: Number(row[4] || 0), // Columna E: Valor declarado
          volumeType: 0,
          weight: 0, // No hay columna para peso
          status: ProductStatus.EMPTY, // Valor por defecto
        };

        console.log(product);

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

        products.push(product);
      } catch (error) {
        setLoading(false);
        throw new Error(
          `Error en fila ${index + 2}: ${(error as Error).message}`
        );
      }
    });

    return products;
  };

  const sendDataInBatches = async (data: Product[], batchSize: number) => {
    setLoading(true);
    const totalBatches = Math.ceil(data.length / batchSize);

    for (let i = 0; i < totalBatches; i++) {
      const batch = data.slice(i * batchSize, (i + 1) * batchSize);

      try {
        await onSubmit(batch, i === 0);
        setProgress(((i + 1) / totalBatches) * 100);
      } catch (error) {
        setError(`Error al enviar el lote ${i + 1}: ${error}`);
        setLoading(false);
        return;
      }
    }

    Swal.fire(
      "¡Importación exitosa!",
      `Se importaron ${data.length} productos correctamente.`,
      "success"
    );
    setLoading(false);
    onClose();
  };

  const handleSubmit = async () => {
    if (products.length === 0) {
      setError("No hay productos válidos para importar.");
      return;
    }

    sendDataInBatches(products, 50);
  };

  return (
    <div className="flex flex-col gap-4 p-4 mx-auto">
      {loading ? (
        <div className="w-full">
          <div className="mb-2 text-center text-lg font-semibold">
            Procesando archivo... ({Math.round(progress)}%)
          </div>
          <div className="w-full bg-gray-200 rounded-full h-3">
            <div
              className="bg-blue-600 h-3 rounded-full transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
          <p className="text-center text-sm text-gray-600 mt-2">
            Importando productos, por favor espere...
          </p>
        </div>
      ) : products.length > 0 ? (
        <div className="space-y-4">
          <div className="flex justify-center gap-4">
            <button
              className="px-6 py-2 bg-gray-500 text-white rounded hover:bg-gray-600 transition-colors"
              onClick={onBack}
            >
              Cancelar
            </button>
            {requireRemittance ? (
              remito ? (
                <div className="flex gap-4">
                  <button
                    className="flex items-center gap-2 px-6 py-2 bg-gray-500 text-white rounded hover:bg-gray-600 transition-colors"
                    onClick={onSubmitRemittance}
                  >
                    <Upload size={18} />
                    <span>Volver a submir remito</span>
                  </button>
                  <button
                    className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors disabled:opacity-50"
                    onClick={handleSubmit}
                    disabled={loading}
                  >
                    {loading ? "Importando..." : "Confirmar Importación"}
                  </button>
                </div>
              ) : (
                <Button type="primary" onClick={onSubmitRemittance}>
                  <span>Submir remito</span>
                  <Upload />
                </Button>
              )
            ) : (
              <button
                className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors disabled:opacity-50"
                onClick={handleSubmit}
                disabled={loading}
              >
                {loading ? "Importando..." : "Confirmar Importación"}
              </button>
            )}
          </div>
          <Separator />
          <div className="flex flex-col items-center p-4 mt-10 w-full rounded-lg border bg-green-50 border-green-200">
            <h3 className="font-semibold text-green-800 mb-2">
              ¡Archivo procesado correctamente!
            </h3>
            <p className="text-green-700">
              Se encontraron <strong>{products.length}</strong> productos para
              importar.
            </p>
          </div>
          <Table data={products} columns={tableColumns} />
        </div>
      ) : (
        <div className="text-center">
          <p>Procesando archivo Excel...</p>
        </div>
      )}
    </div>
  );
}
