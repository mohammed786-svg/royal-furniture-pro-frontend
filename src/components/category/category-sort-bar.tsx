"use client";

import { ChevronDown } from "lucide-react";

type CategorySortBarProps = {
  options: string[];
  value?: string;
};

export function CategorySortBar({
  options,
  value = "Recommended",
}: CategorySortBarProps) {
  return (
    <div className="category-sort-bar">
      <label className="category-sort-bar__label">
        <span className="category-sort-bar__text">Sort By</span>
        <span className="category-sort-bar__select-wrap">
          <select
            className="category-sort-bar__select"
            defaultValue={value}
            aria-label="Sort products"
          >
            {options.map((opt) => (
              <option key={opt} value={opt}>
                {opt}
              </option>
            ))}
          </select>
          <ChevronDown
            className="category-sort-bar__chevron"
            strokeWidth={2}
            aria-hidden
          />
        </span>
      </label>
    </div>
  );
}
