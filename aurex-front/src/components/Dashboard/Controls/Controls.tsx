import Filters, { FilterConfig } from "../Filters/Filters";
import React, { useState } from "react";

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
    <div className="flex justify-between gap-2.5">
      <div className="flex gap-2.5">
        <input
          name="search"
          placeholder="Escribe para buscar..."
          value={search}
          onChange={handleSearch}
          className="px-3 py-1.5 text-sm rounded-md border border-gray-300 text-gray-900 bg-white placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
        />
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
        <div className="flex gap-2 items-center">
          {btnConfig.map((btn, index) =>
            btn.component ? (
              <React.Fragment key={index}>{btn.component}</React.Fragment>
            ) : (
              <Button
                key={index}
                type="primary"
                className="btn-primary text-sm py-1.5 px-3"
                onClick={btn.onClick}
              >
                {btn.leftIcon}
                {btn.label}
              </Button>
            )
          )}
        </div>
      )}
    </div>
  );
}
