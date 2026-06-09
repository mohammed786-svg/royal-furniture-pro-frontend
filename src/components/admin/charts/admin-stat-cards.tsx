"use client";

import { AdminIcon } from "@/components/admin/layout/admin-icon";

export type AdminStatCardItem = {
  id: string;
  title: string;
  value: string;
  icon?: string;
  color?: string;
  change?: string;
  changeType?: "up" | "down";
  footer?: { label: string; value: string }[];
};

type AdminStatCardsProps = {
  items: AdminStatCardItem[];
  className?: string;
};

export function AdminStatCards({ items, className = "" }: AdminStatCardsProps) {
  return (
    <div className={`admin-stats-grid ${className}`.trim()}>
      {items.map((stat) => (
        <div key={stat.id} className="admin-stat-card">
          {stat.icon && (
            <div
              className="admin-stat-icon"
              style={{
                background: `${stat.color ?? "#3D5EE1"}18`,
                color: stat.color ?? "#3D5EE1",
              }}
            >
              <AdminIcon name={stat.icon} size={22} />
            </div>
          )}
          <div className="flex-1">
            <p className="admin-stat-title">{stat.title}</p>
            <p className="admin-stat-value">{stat.value}</p>
            {stat.footer && stat.footer.length > 0 && (
              <div className="admin-stat-footer">
                {stat.footer.map((item) => (
                  <span key={item.label}>
                    {item.label}: {item.value}
                  </span>
                ))}
              </div>
            )}
          </div>
          {stat.change && (
            <span className={`admin-stat-change ${stat.changeType ?? "up"}`}>
              {stat.change}
            </span>
          )}
        </div>
      ))}
    </div>
  );
}
