"use client";

import { useEffect, useState } from "react";
import { AdminIcon } from "@/components/admin/layout/admin-icon";
import { adminMenuGroups } from "@/lib/admin/navigation";
import {
  getDefaultPermissionKeys,
  getStoredAdminPermissions,
  setStoredAdminPermissions,
} from "@/lib/admin/permissions";

export function RolePermissionsManager() {
  const [selected, setSelected] = useState<string[]>([]);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    const stored = getStoredAdminPermissions();
    setSelected(stored.length > 0 ? stored : getDefaultPermissionKeys());
  }, []);

  const toggle = (key: string) => {
    setSelected((prev) =>
      prev.includes(key) ? prev.filter((k) => k !== key) : [...prev, key],
    );
    setSaved(false);
  };

  const selectAll = () => {
    const all = adminMenuGroups.flatMap((g) =>
      g.items.filter((i) => !i.superAdminOnly).map((i) => i.key),
    );
    setSelected(all);
    setSaved(false);
  };

  const save = () => {
    setStoredAdminPermissions(selected);
    setSaved(true);
  };

  return (
    <div className="admin-widget-card">
      <div className="mb-4">
        <h2 className="text-lg font-semibold">Admin Manager Permissions</h2>
        <p className="text-sm text-[var(--admin-muted)]">
          Super Admin controls which sidebar menus Admin Managers can access. Changes
          apply immediately for all admin accounts.
        </p>
      </div>

      <div className="mb-4 flex gap-2">
        <button
          type="button"
          onClick={selectAll}
          className="admin-btn admin-btn-outline"
        >
          Select All (Non-Admin)
        </button>
        <button type="button" onClick={save} className="admin-btn admin-btn-primary">
          Save Permissions
        </button>
        {saved && (
          <span className="flex items-center text-sm text-[var(--admin-success)]">
            Permissions saved successfully
          </span>
        )}
      </div>

      {adminMenuGroups.map((group) => {
        const items = group.items.filter((i) => !i.superAdminOnly);
        if (!items.length) return null;
        return (
          <div key={group.id} className="mb-6">
            <h3 className="mb-2 text-xs font-bold tracking-wider text-[var(--admin-muted)]">
              {group.label}
            </h3>
            <div className="admin-permissions-grid">
              {items.map((item) => (
                <label key={item.key} className="admin-permission-item">
                  <input
                    type="checkbox"
                    checked={selected.includes(item.key)}
                    onChange={() => toggle(item.key)}
                  />
                  <AdminIcon name={item.icon} size={16} />
                  {item.label}
                </label>
              ))}
            </div>
          </div>
        );
      })}

      <p className="mt-4 text-xs text-[var(--admin-muted)]">
        Administration menus (Admin Users, Roles, Login History) are always restricted
        to Super Admin only.
      </p>
    </div>
  );
}
