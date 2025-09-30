import { useEffect, useRef, useState, ReactNode } from "react";

import SelectInput from "../Inputs/SelectInput";

import style from "./Filter.module.css";
import filterSvg from "../../../assets/svg/filters.svg";

export type FilterConfig = Array<{
  key: string;
  type: "select" | "date" | "text";
  label: string;
  options?: Array<string | number>; // Solo para 'select'
}>;

interface Props<T> {
  data: T[];
  config: FilterConfig;
  onChange: (data: T[]) => void;
  onReset: () => void;
  customFilterComponents?: ReactNode[]; // Nueva propiedad para componentes personalizados
}

export default function Filters<T>({
  data,
  config,
  onChange,
  onReset,
  customFilterComponents = [],
}: Props<T>) {
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

    onChange({
      ...data,
      [name]: newValue,
    });
  }

  return (
    <div className={style.filter} ref={dropDownRef}>
      <button className={style.btnFilter} type="button" onClick={handleFilter}>
        <span>Filtros</span>
        <img src={filterSvg} alt="filtros" />
      </button>
      {filter && (
        <form className={style.filterContainer}>
          {config.map((item) =>
            item.type === "select" ? (
              <SelectInput
                name={item.key}
                value={data[item.key as keyof typeof data] as string}
                label={item.label}
                list={item.options!}
                onChange={handleChange}
              />
            ) : (
              <div className="form-floating" key={item.key}>
                <input
                  id={item.key}
                  name={item.key}
                  className="form-control"
                  value={
                    item.type === "date"
                      ? (data[item.key as keyof typeof data] as Date)
                          .toISOString()
                          .split("T")[0]
                      : (data[item.key as keyof typeof data] as string)
                  }
                  type={item.type}
                  onChange={handleChange}
                />
                <label htmlFor={item.key} className="form-label">
                  {item.label}
                </label>
              </div>
            )
          )}
          {customFilterComponents.map((CustomComponent, index) => (
            <div key={index} className="form-floating">
              {CustomComponent}
            </div>
          ))}
          <button className="btn-primary" onClick={onReset} type="button">
            Borrar
          </button>
        </form>
      )}
    </div>
  );
}
