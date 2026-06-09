"use client";

import { MoreVertical } from "lucide-react";
import { resolveMediaUrl } from "@/lib/media/resolve-url";

export type AdminGridField = {
  label: string;
  value: string;
};

type AdminDataGridProps<T extends { id: string; name: string }> = {
  rows: T[];
  loading?: boolean;
  imageKey?: keyof T;
  subtitle?: (row: T) => string;
  status?: (row: T) => { label: string; tone: "active" | "inactive" };
  fields: (row: T) => AdminGridField[];
  onEdit: (row: T) => void;
  onDelete: (row: T) => void;
};

export function AdminDataGrid<T extends { id: string; name: string }>({
  rows,
  loading,
  imageKey,
  subtitle,
  status,
  fields,
  onEdit,
  onDelete,
}: AdminDataGridProps<T>) {
  if (loading) {
    return <div className="admin-data-empty admin-data-grid-empty">Loading...</div>;
  }

  if (rows.length === 0) {
    return (
      <div className="admin-data-empty admin-data-grid-empty">No records found</div>
    );
  }

  return (
    <div className="admin-data-grid">
      {rows.map((row) => {
        const image = imageKey ? resolveMediaUrl(row[imageKey] as string | null) : null;
        const badge = status?.(row);
        return (
          <div key={row.id} className="admin-data-grid-card">
            <div className="admin-data-grid-card-top">
              <span className="admin-data-id">#{row.id}</span>
              {badge && (
                <span className={`admin-status-badge ${badge.tone}`}>
                  {badge.label}
                </span>
              )}
              <div className="admin-data-actions">
                <button
                  type="button"
                  className="admin-data-action-btn"
                  aria-label="Actions"
                >
                  <MoreVertical size={16} />
                </button>
                <div className="admin-data-action-menu">
                  <button type="button" onClick={() => onEdit(row)}>
                    Edit
                  </button>
                  <button
                    type="button"
                    className="danger"
                    onClick={() => onDelete(row)}
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
            <div className="admin-data-grid-card-body">
              <div className="admin-data-grid-avatar">
                {image ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={image} alt={row.name} />
                ) : (
                  <span>{row.name.charAt(0).toUpperCase()}</span>
                )}
              </div>
              <div>
                <h4>{row.name}</h4>
                {subtitle && <p>{subtitle(row)}</p>}
              </div>
            </div>
            <div className="admin-data-grid-fields">
              {fields(row).map((field) => (
                <div key={field.label}>
                  <span>{field.label}</span>
                  <strong>{field.value}</strong>
                </div>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}
