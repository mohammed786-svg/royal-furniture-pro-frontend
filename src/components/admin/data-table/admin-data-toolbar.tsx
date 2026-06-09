"use client";

import { Calendar, Filter, LayoutGrid, List, RefreshCw, Search } from "lucide-react";

export type ViewMode = "table" | "grid";

type AdminDataToolbarProps = {
  title: string;
  search: string;
  viewMode: ViewMode;
  sortBy: string;
  onSearchChange: (value: string) => void;
  onViewModeChange: (mode: ViewMode) => void;
  onSortChange: (value: string) => void;
  onRefresh: () => void;
};

const SORT_OPTIONS = [
  { value: "display_order-asc", label: "Sort by Order" },
  { value: "name-asc", label: "Sort by A-Z" },
  { value: "name-desc", label: "Sort by Z-A" },
  { value: "created_at-desc", label: "Newest First" },
  { value: "base_price-asc", label: "Price Low-High" },
  { value: "base_price-desc", label: "Price High-Low" },
];

export function AdminDataToolbar({
  title,
  search,
  viewMode,
  sortBy,
  onSearchChange,
  onViewModeChange,
  onSortChange,
  onRefresh,
}: AdminDataToolbarProps) {
  return (
    <div className="admin-data-toolbar">
      <div className="admin-data-toolbar-left">
        <h3>{title}</h3>
        <div className="admin-data-toolbar-filters">
          <button type="button" className="admin-data-chip" disabled>
            <Calendar size={14} />
            <span>All Dates</span>
          </button>
          <button type="button" className="admin-data-chip" disabled>
            <Filter size={14} />
            Filter
          </button>
          <select
            className="admin-data-select"
            value={sortBy}
            onChange={(e) => onSortChange(e.target.value)}
            aria-label="Sort"
          >
            {SORT_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>
      </div>
      <div className="admin-data-toolbar-right">
        <button
          type="button"
          className="admin-data-icon-btn"
          onClick={onRefresh}
          aria-label="Refresh"
        >
          <RefreshCw size={16} />
        </button>
        <div className="admin-data-view-toggle">
          <button
            type="button"
            className={viewMode === "table" ? "active" : ""}
            onClick={() => onViewModeChange("table")}
            aria-label="Table view"
          >
            <List size={16} />
          </button>
          <button
            type="button"
            className={viewMode === "grid" ? "active" : ""}
            onClick={() => onViewModeChange("grid")}
            aria-label="Grid view"
          >
            <LayoutGrid size={16} />
          </button>
        </div>
        <div className="admin-data-search">
          <Search size={16} />
          <input
            type="search"
            placeholder="Search"
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
          />
        </div>
      </div>
    </div>
  );
}
