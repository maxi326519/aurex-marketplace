import { useState, useRef, useEffect } from "react";
import { ChevronDown, Loader2 } from "lucide-react";

interface SearchSelectProps {
  name: string;
  value: string; // ID del item seleccionado
  label: string;
  list: Array<{ key: string; value: string }>; // key=id, value=label
  loading?: boolean;
  onSearch: (searchTerm: string) => void;
  onSelect: (item: { key: string; value: string }) => void;
  error?: string;
  placeholder?: string;
  displayValue?: string; // Valor a mostrar en el input cuando está seleccionado
}

export default function SearchSelect({
  name,
  value,
  label,
  list,
  loading = false,
  onSearch,
  onSelect,
  error,
  placeholder = "Buscar...",
  displayValue,
}: SearchSelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [inputValue, setInputValue] = useState(displayValue || "");
  const wrapperRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Actualizar inputValue cuando displayValue cambia externamente
  useEffect(() => {
    if (displayValue !== undefined) {
      setInputValue(displayValue);
    }
  }, [displayValue]);

  // Cerrar dropdown al hacer clic fuera
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        wrapperRef.current &&
        !wrapperRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
        // Restaurar displayValue si hay un valor seleccionado
        if (value) {
          // Prioridad: displayValue > item en lista > inputValue actual
          if (displayValue) {
            setInputValue(displayValue);
          } else {
            // Buscar el item seleccionado en la lista actual
            const selectedItem = list.find(item => item.key === value);
            if (selectedItem) {
              setInputValue(selectedItem.value);
            } else if (inputValue) {
              // Si hay un inputValue y un value válido, mantenerlo (puede ser que el item aún no esté en la lista)
              // No hacer nada, mantener el inputValue actual
            } else {
              // Solo limpiar si realmente no hay valor
              setInputValue("");
            }
          }
        } else {
          setInputValue("");
        }
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [value, displayValue, list, inputValue]);

  // Manejar cambios en el input
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setInputValue(newValue);
    setSearchTerm(newValue);
    setIsOpen(true);

    // Si se borra el texto y hay un valor seleccionado, limpiar selección
    if (!newValue && value) {
      onSelect({ key: "", value: "" });
    }
    
    // Ejecutar búsqueda siempre (incluso si está vacío para mostrar productos iniciales)
    onSearch(newValue);
  };

  // Manejar selección de un item
  const handleSelect = (item: { key: string; value: string }) => {
    setInputValue(item.value);
    setSearchTerm("");
    setIsOpen(false);
    onSelect(item);
  };

  // Manejar click en el input
  const handleInputClick = () => {
    setIsOpen(true);
    // Si hay un valor seleccionado, limpiar para buscar
    if (value) {
      setInputValue("");
      setSearchTerm("");
      onSelect({ key: "", value: "" });
    }
    inputRef.current?.focus();
  };

  // Manejar tecla Enter
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Escape") {
      setIsOpen(false);
      if (value && displayValue) {
        setInputValue(displayValue);
      }
    } else if (e.key === "ArrowDown" && list.length > 0) {
      e.preventDefault();
      setIsOpen(true);
    }
  };

  return (
    <div className="relative" ref={wrapperRef}>
      <label className="block">
        <span className="block text-sm font-medium text-slate-700">
          {label}
        </span>
        <div className="relative">
          <input
            ref={inputRef}
            type="text"
            id={name}
            name={name}
            value={inputValue}
            onChange={handleInputChange}
            onClick={handleInputClick}
            onKeyDown={handleKeyDown}
            placeholder={placeholder}
            className="
              rounded-md mt-1 block w-full px-3 py-2 bg-white border border-slate-300 text-sm shadow-sm placeholder-slate-400
              focus:outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500
              disabled:bg-slate-50 disabled:text-slate-500 disabled:border-slate-200 disabled:shadow-none
              invalid:border-pink-500 invalid:text-pink-600
              focus:invalid:border-pink-500 focus:invalid:ring-pink-500
              pr-10
            "
          />
          <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
            {loading ? (
              <Loader2 className="h-4 w-4 text-slate-400 animate-spin" />
            ) : (
              <ChevronDown
                className={`h-4 w-4 text-slate-400 transition-transform ${
                  isOpen ? "transform rotate-180" : ""
                }`}
              />
            )}
          </div>
        </div>
      </label>

      {/* Dropdown */}
      {isOpen && (
        <div className="absolute z-50 w-full mt-1 bg-white border border-slate-300 rounded-md shadow-lg max-h-60 overflow-auto">
          {loading && list.length === 0 ? (
            <div className="p-4 text-center text-sm text-slate-500">
              <Loader2 className="h-5 w-5 animate-spin mx-auto mb-2" />
              Buscando...
            </div>
          ) : list.length === 0 ? (
            <div className="p-4 text-center text-sm text-slate-500">
              {searchTerm ? "No se encontraron resultados" : "Escribe para buscar"}
            </div>
          ) : (
            <table className="w-full text-sm">
              <thead className="bg-slate-50 sticky top-0">
                <tr>
                  <th className="px-4 py-2 text-left text-xs font-semibold text-slate-600 border-b">
                    #
                  </th>
                  <th className="px-4 py-2 text-left text-xs font-semibold text-slate-600 border-b">
                    Descripción
                  </th>
                </tr>
              </thead>
              <tbody>
                {list.map((item) => (
                  <tr
                    key={item.key}
                    onClick={() => handleSelect(item)}
                    className="
                      cursor-pointer hover:bg-sky-50 transition-colors
                      border-b border-slate-100
                    "
                  >
                    <td className="px-4 py-2 text-slate-700 font-medium">
                      {item.value.split(" - ")[0] || item.value}
                    </td>
                    <td className="px-4 py-2 text-slate-600">
                      {item.value.split(" - ").slice(1).join(" - ") || item.value}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      )}

      {error && (
        <small className="text-pink-600 text-xs mt-1 block">{error}</small>
      )}
    </div>
  );
}

