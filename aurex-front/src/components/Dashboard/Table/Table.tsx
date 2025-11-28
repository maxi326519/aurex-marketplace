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

export interface PaginationInfo {
  page: number;
  limit: number;
  totalItems: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}

interface Props<T> {
  columns: Column<T>[];
  data: Array<T>;
  enableInternalPagination?: boolean;
  pagination?: PaginationInfo | null;
  onPageChange?: (page: number) => void;
  loading?: boolean;
}

type SortDirection = "asc" | "desc" | null;

export default function Table<T>({ 
  columns, 
  data, 
  enableInternalPagination = true, 
  pagination: externalPagination, 
  onPageChange, 
  loading = false 
}: Props<T>) {
  const [sortConfig, setSortConfig] = useState<{
    key: string;
    direction: SortDirection;
  }>({ key: "", direction: null });

  const internalPagination = usePagination(data);

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
    <div className="relative border border-border rounded-sm bg-white overflow-y-auto">
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
          {loading ? (
            <tr className="border-b border-gray-100">
              <td
                colSpan={columns.length}
                className="py-8 text-center text-gray-500"
              >
                <div className="flex items-center justify-center gap-2">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-gray-900"></div>
                  Cargando...
                </div>
              </td>
            </tr>
          ) : sortedData.length > 0 ? (
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
      {enableInternalPagination && (
        <Pagination page={internalPagination.page} setPage={internalPagination.setPage} />
      )}
      {!enableInternalPagination && externalPagination && onPageChange && (
        <nav className="flex justify-between items-center border-t border-gray-100 px-4 py-2">
          <div className="text-sm text-gray-600">
            Mostrando {((externalPagination.page - 1) * externalPagination.limit) + 1} a {Math.min(externalPagination.page * externalPagination.limit, externalPagination.totalItems)} de {externalPagination.totalItems} resultados
          </div>
          <div className="flex items-center gap-[10px]">
            <button
              className="border-none text-gray-500 bg-white px-3 py-1 hover:bg-gray-200"
              onClick={() => onPageChange(externalPagination.page - 1)}
              disabled={!externalPagination.hasPrevPage}
            >
              {"<"}
            </button>
            <span>
              {externalPagination.page} de {externalPagination.totalPages}
            </span>
            <button
              className="border-none text-gray-500 bg-white px-3 py-1 hover:bg-gray-200"
              onClick={() => onPageChange(externalPagination.page + 1)}
              disabled={!externalPagination.hasNextPage}
            >
              {">"}
            </button>
          </div>
        </nav>
      )}
    </div>
  );
}
