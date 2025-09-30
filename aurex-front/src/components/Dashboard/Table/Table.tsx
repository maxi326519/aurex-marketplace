import { ChevronUp, ChevronDown, ChevronsUpDown } from "lucide-react";
import { useState, useMemo } from "react";
import usePagination from "../../../hooks/Dashboard/usePagination";
import Pagination from "./Pagination/Pagination";

interface Column<T> {
  header: string;
  key: string;
  render?: (row: T) => React.ReactNode;
  sortable?: boolean;
}

interface Props<T> {
  columns: Column<T>[];
  data: Array<T>;
}

type SortDirection = "asc" | "desc" | null;

export default function Table<T>({ columns, data }: Props<T>) {
  const [sortConfig, setSortConfig] = useState<{
    key: string;
    direction: SortDirection;
  }>({ key: "", direction: null });

  const pagination = usePagination(data);

  // Función para manejar el ordenamiento
  const handleSort = (key: string) => {
    let direction: SortDirection = "asc";

    if (sortConfig.key === key) {
      if (sortConfig.direction === "asc") {
        direction = "desc";
      } else if (sortConfig.direction === "desc") {
        direction = null;
      }
    }

    setSortConfig({ key, direction });
  };

  // Datos ordenados
  const sortedData = useMemo(() => {
    if (!sortConfig.key || sortConfig.direction === null) {
      return data;
    }

    return [...data].sort((a, b) => {
      const aValue = a[sortConfig.key as keyof typeof a];
      const bValue = b[sortConfig.key as keyof typeof b];

      if (aValue === bValue) return 0;

      if (sortConfig.direction === "asc") {
        return aValue < bValue ? -1 : 1;
      } else {
        return aValue > bValue ? -1 : 1;
      }
    });
  }, [data, sortConfig]);

  // Obtener el icono adecuado para la columna
  const getSortIcon = (key: string) => {
    if (sortConfig.key !== key) return <ChevronsUpDown size={16} />;

    if (sortConfig.direction === "asc") return <ChevronUp size={16} />;

    if (sortConfig.direction === "desc") return <ChevronDown size={16} />;

    return <ChevronsUpDown size={16} />;
  };

  return (
    <div className="relative overflow-y-auto bg-white">
      <table className="w-full rounded-md bg-white">
        <thead className="sticky top-0 text-gray-500 bg-white z-10">
          <tr>
            {columns.map((col, index) => (
              <th
                key={index}
                className={`text-left text-xs font-semibold px-4 py-2 border-b border-gray-100 ${
                  col.sortable ? "cursor-pointer hover:bg-gray-50" : ""
                }`}
                onClick={() => col.sortable && handleSort(col.key)}
              >
                <div className="flex items-center gap-1">
                  {col.header.toUpperCase()}
                  {col.sortable && (
                    <span className="text-gray-400">
                      {getSortIcon(col.key)}
                    </span>
                  )}
                </div>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {sortedData.length > 0 ? (
            sortedData.map((row, rowIndex) => (
              <tr key={rowIndex} className="border-b border-gray-100">
                {columns.map((column, colIndex) => (
                  <td key={colIndex} className="px-4 py-2">
                    {column.render
                      ? column.render(row)
                      : (row[
                          column.key as keyof typeof row
                        ] as React.ReactNode)}
                  </td>
                ))}
              </tr>
            ))
          ) : (
            <tr className="border-b border-gray-100">
              <td
                colSpan={columns.length}
                className="py-8 text-center text-gray-500"
              >
                No hay datos
              </td>
            </tr>
          )}
        </tbody>
      </table>
      <Pagination page={pagination.page} setPage={pagination.setPage} />
    </div>
  );
}
