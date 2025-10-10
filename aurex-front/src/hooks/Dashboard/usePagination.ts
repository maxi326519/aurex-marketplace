import { useEffect, useState } from "react";

interface Page {
  current: number;
  length: number;
  buttons: number[];
}

interface UsePagination<T> {
  rows: T[];
  page: Page;
  setPage: (page: number) => void;
}

const initPage = (): Page => ({
  current: 1,
  length: 1,
  buttons: [],
});

export default function usePagination<T>(data: T[]): UsePagination<T> {
  const [page, setPage] = useState(initPage());
  const [rows, setRows] = useState<T[]>([]);

  const propPerPage = 10;
  const maxButtonsToShow = 5;

  // Update page and row when data is updated
  useEffect(() => {
    handleUpdatePage(1);
  }, [data]);

  // Calcule pagination buttons
  function handleButtons(current: number, length: number): number[] {
    let startPage: number;
    let endPage: number;

    if (length <= maxButtonsToShow) {
      // Si el total de páginas es menor o igual a 5, muestra todas las páginas.
      startPage = 1;
      endPage = length;
    } else {
      // Si hay más de 5 páginas, calcula el rango.
      if (current <= 3) {
        startPage = 1;
        endPage = 5;
      } else if (current + 2 >= length) {
        startPage = length - 4;
        endPage = length;
      } else {
        startPage = current - 2;
        endPage = current + 2;
      }
    }

    // Generar las páginas en el rango.
    const pageNumbers = Array.from(
      { length: endPage - startPage + 1 },
      (_, i) => startPage + i
    );
    return pageNumbers;
  }

  function handleUpdatePage(pageNumber: number) {
    // Get page length by property quantity
    const pageLength = Math.ceil(data.length / propPerPage);

    // If the page number is valid
    if (pageNumber > 0 && pageNumber <= pageLength) {
      setPage({
        current: pageNumber,
        length: pageLength,
        buttons: handleButtons(pageNumber, pageLength),
      });

      // Set property by page
      handleUpdateData(pageNumber);
    }
  }

  function handleUpdateData(pageNumber: number) {
    // Get values
    const start = (pageNumber - 1) * propPerPage;
    const end = pageNumber * propPerPage;

    // Slice properties
    const propSlice = data.slice(start, end);

    // Save properties
    setRows(propSlice);
  }

  return {
    rows,
    page: page,
    setPage: handleUpdatePage,
  };
}
