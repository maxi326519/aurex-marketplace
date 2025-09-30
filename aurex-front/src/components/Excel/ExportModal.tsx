import { Product } from "../../interfaces/Product";
import * as XLSX from "xlsx";

interface Props {
  data: Product[];
  onClose: () => void;
}

export default function ExportModal({ data, onClose }: Props) {
  const exportToExcel = () => {
    // Crear una hoja de trabajo (worksheet) a partir de los datos
    const worksheet = XLSX.utils.json_to_sheet(data);

    // Crear un libro de trabajo (workbook) y agregar la hoja de trabajo
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Historial");

    // Escribir el archivo Excel y descargarlo
    XLSX.writeFile(workbook, "historial.xlsx");
  };

  return (
    <div className="fixed z-50 top-0 left-0 flex justify-center items-center w-full h-full bg-[#0006]">
      <div className="flex p-3 max-h-[600px] rounded-[10px] bg-white overflow-hidden">
        <header className="flex flex-col gap-4 min-w-[400px]">
          <div className="flex justify-between items-center">
            <h4 className="text-lg font-semibold">Exportar historial</h4>
            <button
              className="btn-close py-2 px-4 hover:bg-gray-100 rounded-full"
              onClick={onClose}
            >
              x
            </button>
          </div>
          <span className="w-full text-center">
            Exportar {data.length} registros del historial
          </span>
          <button
            onClick={exportToExcel}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all"
          >
            Exportar a Excel
          </button>
        </header>
      </div>
    </div>
  );
}
