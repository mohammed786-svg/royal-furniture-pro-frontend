"use client";

import { useMemo, useState } from "react";
import { useTheme } from "next-themes";
import { useRouter } from "next/navigation";
import {
  Bell,
  Check,
  Expand,
  Menu,
  MessageCircle,
  Minimize,
  Moon,
  Search,
  Sun,
} from "lucide-react";
import { AdminFiscalYearSelector } from "@/components/admin/layout/admin-fiscal-year-selector";
import { AdminHeaderPanel } from "@/components/admin/layout/admin-header-panel";
import { AdminProfileDropdown } from "@/components/admin/profile/admin-profile-dropdown";
import { useFullscreen } from "@/hooks/use-fullscreen";
import { useAdminAuthStore } from "@/lib/admin/auth-store";
import {
  adminChatMessages,
  adminNotifications,
  type AdminChatMessage,
  type AdminNotification,
} from "@/lib/admin/header-data";

type AdminHeaderProps = {
  onMenuOpen: () => void;
};

type PanelType = "notifications" | "chat" | null;

export function AdminHeader({ onMenuOpen }: AdminHeaderProps) {
  const user = useAdminAuthStore((s) => s.user);
  const logout = useAdminAuthStore((s) => s.logout);
  const router = useRouter();
  const { resolvedTheme, setTheme } = useTheme();
  const { isFullscreen, toggle: toggleFullscreen } = useFullscreen();

  const [activePanel, setActivePanel] = useState<PanelType>(null);
  const [profileOpen, setProfileOpen] = useState(false);
  const [notifications, setNotifications] = useState(adminNotifications);
  const [chats, setChats] = useState(adminChatMessages);

  const unreadNotifications = useMemo(
    () => notifications.filter((n) => !n.read).length,
    [notifications],
  );
  const unreadChats = useMemo(() => chats.filter((c) => c.unread).length, [chats]);

  const initials = user?.fullName
    ?.split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  const closeOverlays = () => {
    setActivePanel(null);
    setProfileOpen(false);
  };

  const togglePanel = (panel: PanelType) => {
    setProfileOpen(false);
    setActivePanel((prev) => (prev === panel ? null : panel));
  };

  const toggleProfile = () => {
    setActivePanel(null);
    setProfileOpen((prev) => !prev);
  };

  const markNotificationRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n)),
    );
  };

  const markAllNotificationsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  const markChatRead = (id: string) => {
    setChats((prev) => prev.map((c) => (c.id === id ? { ...c, unread: false } : c)));
  };

  return (
    <header className="admin-header">
      <button
        type="button"
        className="admin-header-icon-btn admin-mobile-menu-btn"
        onClick={onMenuOpen}
        aria-label="Open menu"
      >
        <Menu size={20} />
      </button>

      <div className="admin-header-search">
        <Search size={16} />
        <input type="search" placeholder="Search products, orders, customers..." />
      </div>

      <AdminFiscalYearSelector onOpen={closeOverlays} />

      <div className="admin-header-actions">
        <button
          type="button"
          className="admin-header-icon-btn"
          onClick={() => setTheme(resolvedTheme === "dark" ? "light" : "dark")}
          aria-label="Toggle theme"
        >
          {resolvedTheme === "dark" ? <Sun size={18} /> : <Moon size={18} />}
        </button>

        <div className="admin-header-action-wrap">
          <button
            type="button"
            data-admin-panel-trigger
            className={`admin-header-icon-btn ${activePanel === "notifications" ? "active" : ""}`}
            onClick={() => togglePanel("notifications")}
            aria-label="Notifications"
            aria-expanded={activePanel === "notifications"}
          >
            <Bell size={18} />
            {unreadNotifications > 0 && <span className="admin-header-badge" />}
          </button>
          <AdminHeaderPanel
            open={activePanel === "notifications"}
            onClose={() => setActivePanel(null)}
            title="Notifications"
          >
            <div className="admin-panel-toolbar">
              <span className="text-xs text-[var(--admin-muted)]">
                {unreadNotifications} unread
              </span>
              {unreadNotifications > 0 && (
                <button
                  type="button"
                  onClick={markAllNotificationsRead}
                  className="admin-panel-link"
                >
                  Mark all read
                </button>
              )}
            </div>
            <ul className="admin-panel-list">
              {notifications.map((item) => (
                <NotificationItem
                  key={item.id}
                  item={item}
                  onRead={() => markNotificationRead(item.id)}
                />
              ))}
            </ul>
          </AdminHeaderPanel>
        </div>

        <div className="admin-header-action-wrap">
          <button
            type="button"
            data-admin-panel-trigger
            className={`admin-header-icon-btn ${activePanel === "chat" ? "active" : ""}`}
            onClick={() => togglePanel("chat")}
            aria-label="Messages"
            aria-expanded={activePanel === "chat"}
          >
            <MessageCircle size={18} />
            {unreadChats > 0 && <span className="admin-header-badge" />}
          </button>
          <AdminHeaderPanel
            open={activePanel === "chat"}
            onClose={() => setActivePanel(null)}
            title="Messages"
          >
            <ul className="admin-panel-list">
              {chats.map((item) => (
                <ChatItem
                  key={item.id}
                  item={item}
                  onRead={() => markChatRead(item.id)}
                />
              ))}
            </ul>
            <div className="admin-panel-footer">
              <button
                type="button"
                className="admin-btn admin-btn-primary w-full text-xs"
              >
                Open Support Inbox
              </button>
            </div>
          </AdminHeaderPanel>
        </div>

        <button
          type="button"
          className="admin-header-icon-btn admin-fullscreen-btn"
          onClick={toggleFullscreen}
          aria-label={isFullscreen ? "Exit fullscreen" : "Enter fullscreen"}
        >
          {isFullscreen ? <Minimize size={18} /> : <Expand size={18} />}
        </button>

        <div className="admin-header-action-wrap">
          <button
            type="button"
            data-admin-profile-trigger
            className={`admin-header-profile ${profileOpen ? "active" : ""}`}
            onClick={toggleProfile}
            aria-label="Profile menu"
            aria-expanded={profileOpen}
          >
            <div className="admin-header-avatar">{initials}</div>
            <div className="admin-header-user-meta">
              <p className="text-sm font-semibold leading-tight">{user?.fullName}</p>
              <p className="text-xs text-[var(--admin-muted)]">{user?.roleName}</p>
            </div>
          </button>
          <AdminProfileDropdown
            open={profileOpen}
            onClose={() => setProfileOpen(false)}
            initials={initials ?? "AD"}
          />
        </div>
        <button
          type="button"
          onClick={async () => {
            await logout();
            router.replace("/admin/login");
          }}
          className="admin-header-logout"
        >
          Logout
        </button>
      </div>
    </header>
  );
}

function NotificationItem({
  item,
  onRead,
}: {
  item: AdminNotification;
  onRead: () => void;
}) {
  return (
    <li className={`admin-panel-item ${item.read ? "read" : ""}`}>
      <div className="admin-panel-item-main">
        <p className="admin-panel-item-title">{item.title}</p>
        <p className="admin-panel-item-text">{item.message}</p>
        <span className="admin-panel-item-time">{item.time}</span>
      </div>
      {!item.read && (
        <button
          type="button"
          onClick={onRead}
          className="admin-panel-item-action"
          aria-label="Mark read"
        >
          <Check size={14} />
        </button>
      )}
    </li>
  );
}

function ChatItem({ item, onRead }: { item: AdminChatMessage; onRead: () => void }) {
  return (
    <li
      className={`admin-panel-item admin-chat-item ${item.unread ? "" : "read"}`}
      onClick={onRead}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => e.key === "Enter" && onRead()}
    >
      <div className="admin-chat-avatar">{item.initials}</div>
      <div className="admin-panel-item-main">
        <p className="admin-panel-item-title">{item.sender}</p>
        <p className="admin-panel-item-text">{item.message}</p>
        <span className="admin-panel-item-time">{item.time}</span>
      </div>
      {item.unread && <span className="admin-chat-unread-dot" />}
    </li>
  );
}
