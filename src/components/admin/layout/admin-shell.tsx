"use client";

import { useState } from "react";
import { useTheme } from "next-themes";
import { AdminGuard } from "@/components/admin/auth/admin-guard";
import { AdminHeader } from "@/components/admin/layout/admin-header";
import { AdminSidebar } from "@/components/admin/layout/admin-sidebar";

export function AdminShell({ children }: { children: React.ReactNode }) {
  const { resolvedTheme } = useTheme();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <AdminGuard>
      <div className={`admin-shell ${resolvedTheme === "dark" ? "dark" : ""}`}>
        <div className="admin-shell-layout">
          <AdminSidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />
          <div className="admin-main">
            <AdminHeader onMenuOpen={() => setSidebarOpen(true)} />
            <div className="admin-content">{children}</div>
          </div>
        </div>
      </div>
    </AdminGuard>
  );
}
