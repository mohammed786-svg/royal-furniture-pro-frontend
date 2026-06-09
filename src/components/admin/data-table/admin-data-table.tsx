"use client";

import { MoreVertical } from "lucide-react";

export type AdminTableColumn<T> = {
  key: string;
  label: string;
  sortable?: boolean;
  render?: (row: T) => React.ReactNode;
  className?: string;
};

type AdminDataTableProps<T extends { id: string }> = {
  columns: AdminTableColumn<T>[];
  rows: T[];
  loading?: boolean;
  selectedIds: Set<string>;
  onToggleSelect: (id: string) => void;
  onToggleSelectAll: () => void;
  onEdit: (row: T) => void;
  onDelete?: (row: T) => void;
  renderRowActions?: (row: T) => React.ReactNode;
};

export function AdminDataTable<T extends { id: string }>({
  columns,
  rows,
  loading,
  selectedIds,
  onToggleSelect,
  onToggleSelectAll,
  onEdit,
  onDelete,
  renderRowActions,
}: AdminDataTableProps<T>) {
  const allSelected = rows.length > 0 && rows.every((r) => selectedIds.has(r.id));

  return (
    <div className="admin-data-table-wrap">
      <table className="admin-data-table">
        <thead>
          <tr>
            <th className="w-10">
              <input
                type="checkbox"
                checked={allSelected}
                onChange={onToggleSelectAll}
                aria-label="Select all"
              />
            </th>
            {columns.map((col) => (
              <th key={col.key} className={col.className}>
                {col.label}
              </th>
            ))}
            <th className="w-12">Action</th>
          </tr>
        </thead>
        <tbody>
          {loading ? (
            <tr>
              <td colSpan={columns.length + 2} className="admin-data-empty">
                Loading...
              </td>
            </tr>
          ) : rows.length === 0 ? (
            <tr>
              <td colSpan={columns.length + 2} className="admin-data-empty">
                No records found
              </td>
            </tr>
          ) : (
            rows.map((row) => (
              <tr key={row.id}>
                <td>
                  <input
                    type="checkbox"
                    checked={selectedIds.has(row.id)}
                    onChange={() => onToggleSelect(row.id)}
                    aria-label={`Select ${row.id}`}
                  />
                </td>
                {columns.map((col) => (
                  <td key={col.key} className={col.className}>
                    {col.render
                      ? col.render(row)
                      : ((row as Record<string, unknown>)[col.key] as React.ReactNode)}
                  </td>
                ))}
                <td>
                  <div className="admin-data-actions">
                    <button
                      type="button"
                      className="admin-data-action-btn"
                      aria-label="Actions"
                      onClick={() => onEdit(row)}
                      title="Edit"
                    >
                      <MoreVertical size={16} />
                    </button>
                    <div className="admin-data-action-menu">
                      <button type="button" onClick={() => onEdit(row)}>
                        View
                      </button>
                      {renderRowActions?.(row)}
                      {onDelete && (
                        <button
                          type="button"
                          className="danger"
                          onClick={() => onDelete(row)}
                        >
                          Delete
                        </button>
                      )}
                    </div>
                  </div>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
