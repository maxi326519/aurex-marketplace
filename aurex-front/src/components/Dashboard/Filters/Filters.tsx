import { useEffect, useRef, useState, ReactNode } from "react";
import Button from "../../ui/Button";
import SelectInput from "../Inputs/SelectInput";
import filterSvg from "../../../assets/svg/filters.svg";

export type FilterConfig = Array<{
  key: string;
  type: "select" | "date" | "text";
  label: string;
  options?: Array<string | number>; // Solo para 'select'
}>;

interface Props {
  config: FilterConfig;
  filters: Record<string, any>;
  onChange: (filters: Record<string, any>) => void;
  onApply: () => void;
  onReset: () => void;
  customFilterComponents?: ReactNode[]; // Nueva propiedad para componentes personalizados
}

export default function Filters({
  config,
  filters,
  onChange,
  onApply,
  onReset,
  customFilterComponents = [],
}: Props) {
  const [filter, setFilter] = useState(false);
  const dropDownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropDownRef.current &&
        !dropDownRef.current.contains(event.target as Node)
      ) {
        setFilter(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  function handleFilter() {
    setFilter(!filter);
  }

  function handleChange(
    event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) {
    const { name, value, type } = event.target;

    let newValue: string | number | Date = value;
    if (type === "number") {
      if (value !== "") newValue = Number(value);
    } else if (type === "date") {
      newValue = new Date(value);
    }

    onChange({ ...filters, [name]: newValue });
  }

  return (
    <div className="relative" ref={dropDownRef}>
      <button
        className="flex items-center gap-2 px-3 py-2 border border-gray-300 rounded-md bg-white hover:bg-gray-50 transition-colors"
        type="button"
        onClick={handleFilter}
      >
        <span className="text-sm font-medium text-gray-700">Filtros</span>
        <img src={filterSvg} alt="filtros" className="w-4 h-4" />
      </button>
      {filter && (
        <div className="absolute z-50 top-12 left-0 w-80 bg-white border border-gray-200 rounded-lg shadow-lg p-4">
          <div className="space-y-4">
            {config.map((item) =>
              item.type === "select" ? (
                <SelectInput
                  key={item.key}
                  name={item.key}
                  value={filters[item.key] || ""}
                  label={item.label}
                  list={item.options!}
                  onChange={handleChange}
                />
              ) : (
                <div key={item.key} className="space-y-1">
                  <label
                    htmlFor={item.key}
                    className="block text-sm font-medium text-gray-700"
                  >
                    {item.label}
                  </label>
                  <input
                    id={item.key}
                    name={item.key}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    value={
                      item.type === "date"
                        ? (filters[item.key] as Date)
                            ?.toISOString()
                            .split("T")[0] || ""
                        : (filters[item.key] as string) || ""
                    }
                    type={item.type}
                    onChange={handleChange}
                  />
                </div>
              )
            )}
            {customFilterComponents.map((CustomComponent, index) => (
              <div key={index} className="space-y-1">
                {CustomComponent}
              </div>
            ))}
            <div className="flex gap-2 pt-4 border-t border-gray-200">
              <Button
                type="primary"
                className="flex-1"
                onClick={() => onApply()}
              >
                Aplicar
              </Button>
              <Button
                type="secondary"
                variant="outline"
                className="flex-1"
                onClick={() => onReset()}
              >
                Borrar
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
