import React, { useState } from "react";
import Filters, { FilterConfig } from "../Filters/Filters";

import styles from "./Controls.module.css";
import searchSvg from "../../../assets/svg/dashboard/search.svg";
import Button from "../../ui/Button";

export type BtnConfig = Array<{
  label: string;
  onClick: () => void;
}>;

interface Props<T> {
  data: T[];
  filtersConfig?: FilterConfig;
  btnConfig?: BtnConfig;
  onFilter?: (data: T[]) => void;
}

export default function Controls<T>({
  data,
  filtersConfig,
  btnConfig,
  onFilter,
}: Props<T>) {
  const [search, setSearch] = useState("");

  function handleSearch(event: React.ChangeEvent<HTMLInputElement>) {
    setSearch(event.target.value);
  }

  return (
    <div className={styles.controls}>
      <div className={styles.leftControls}>
        <div className={styles.searchBar}>
          <input
            name="search"
            placeholder="Escribe para buscar..."
            value={search}
            onChange={handleSearch}
          />
          <button>
            <img src={searchSvg} alt="" />
          </button>
        </div>
        {filtersConfig && onFilter && (
          <Filters
            data={data}
            config={filtersConfig}
            onChange={onFilter}
            onReset={() => onFilter(data)}
          />
        )}
      </div>
      {btnConfig && (
        <div className={styles.btnContainer}>
          {btnConfig.map((btn) => (
            <Button
              type="primary"
              className="btn-primary"
              onClick={btn.onClick}
            >
              {btn.label}
            </Button>
          ))}
        </div>
      )}
    </div>
  );
}
