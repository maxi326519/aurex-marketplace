import React, { useState } from "react";
import Filters, { FilterConfig } from "../Filters/Filters";

import styles from "./Controls.module.css";
import searchSvg from "../../../assets/svg/dashboard/search.svg";
import Button from "../../ui/Button";

export type BtnConfig = Array<{
  label?: string;
  leftIcon?: React.ReactNode;
  component?: React.ReactNode;
  onClick: () => void;
}>;

interface Props {
  filtersData?: Record<string, any>;
  filtersConfig?: FilterConfig;
  btnConfig?: BtnConfig;
  onFilter?: (filters: Record<string, any>) => void;
  onApplyFilters?: () => void;
  onResetFilters?: () => void;
  searchTerm?: string;
  onSearchChange?: (term: string) => void;
}

export default function Controls({
  filtersData,
  filtersConfig,
  btnConfig,
  onFilter,
  onApplyFilters,
  onResetFilters,
  searchTerm = "",
  onSearchChange,
}: Props) {
  const [internalSearch, setInternalSearch] = useState("");

  const search = searchTerm !== undefined ? searchTerm : internalSearch;

  function handleSearch(event: React.ChangeEvent<HTMLInputElement>) {
    const value = event.target.value;
    if (onSearchChange) {
      onSearchChange(value);
    } else {
      setInternalSearch(value);
    }
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
          <button title="Buscar" type="button">
            <img src={searchSvg} alt="" />
          </button>
        </div>
        {filtersData && filtersConfig && onFilter && (
          <Filters
            config={filtersConfig}
            filters={filtersData}
            onChange={onFilter}
            onApply={onApplyFilters || (() => {})}
            onReset={onResetFilters || (() => {})}
          />
        )}
      </div>
      {btnConfig && (
        <div className={styles.btnContainer}>
          {btnConfig.map((btn, index) => (
            btn.component ? (
              <React.Fragment key={index}>{btn.component}</React.Fragment>
            ) : (
              <Button
                key={index}
                type="primary"
                className="btn-primary"
                onClick={btn.onClick}
              >
                {btn.leftIcon}
                {btn.label}
              </Button>
            )
          ))}
        </div>
      )}
    </div>
  );
}
