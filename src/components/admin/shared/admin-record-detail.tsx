"use client";

import type { ReactNode } from "react";
import Link from "next/link";
import type { LucideIcon } from "lucide-react";

type AdminRecordHeroProps = {
  eyebrow?: string;
  title: ReactNode;
  subtitle?: string;
  badge?: ReactNode;
  chips?: ReactNode;
  actions?: ReactNode;
};

export function AdminRecordHero({
  eyebrow,
  title,
  subtitle,
  badge,
  chips,
  actions,
}: AdminRecordHeroProps) {
  return (
    <div className="admin-record-hero">
      <div className="admin-record-hero__main">
        {eyebrow && <p className="admin-record-hero__eyebrow">{eyebrow}</p>}
        <div className="admin-record-hero__title-row">
          <h2 className="admin-record-hero__title">{title}</h2>
          {badge}
        </div>
        {subtitle && <p className="admin-record-hero__subtitle">{subtitle}</p>}
        {chips && <div className="admin-record-hero__chips">{chips}</div>}
      </div>
      {actions && <div className="admin-record-hero__actions">{actions}</div>}
    </div>
  );
}

type AdminRecordMetric = {
  label: string;
  value: ReactNode;
  hint?: string;
  tone?: "default" | "success" | "warning" | "danger" | "info";
};

export function AdminRecordMetrics({ items }: { items: AdminRecordMetric[] }) {
  return (
    <div className="admin-record-metrics">
      {items.map((item) => (
        <div
          key={item.label}
          className={`admin-record-metric admin-record-metric--${item.tone ?? "default"}`}
        >
          <span className="admin-record-metric__label">{item.label}</span>
          <strong className="admin-record-metric__value">{item.value}</strong>
          {item.hint && <span className="admin-record-metric__hint">{item.hint}</span>}
        </div>
      ))}
    </div>
  );
}

type AdminRecordTab = {
  id: string;
  label: string;
  icon?: LucideIcon;
};

type AdminRecordTabsProps = {
  tabs: AdminRecordTab[];
  active: string;
  onChange: (id: string) => void;
};

export function AdminRecordTabs({ tabs, active, onChange }: AdminRecordTabsProps) {
  return (
    <div className="admin-record-tabs" role="tablist">
      {tabs.map((tab) => {
        const Icon = tab.icon;
        const isActive = active === tab.id;
        return (
          <button
            key={tab.id}
            type="button"
            role="tab"
            aria-selected={isActive}
            className={`admin-record-tab ${isActive ? "active" : ""}`}
            onClick={() => onChange(tab.id)}
          >
            {Icon && <Icon size={16} strokeWidth={2} aria-hidden />}
            {tab.label}
          </button>
        );
      })}
    </div>
  );
}

type AdminInfoCardProps = {
  title: string;
  icon?: LucideIcon;
  children: ReactNode;
  className?: string;
};

export function AdminInfoCard({
  title,
  icon: Icon,
  children,
  className,
}: AdminInfoCardProps) {
  return (
    <div className={`admin-info-card ${className ?? ""}`.trim()}>
      <div className="admin-info-card__head">
        {Icon && (
          <span className="admin-info-card__icon" aria-hidden>
            <Icon size={18} strokeWidth={1.75} />
          </span>
        )}
        <h4>{title}</h4>
      </div>
      <div className="admin-info-card__body">{children}</div>
    </div>
  );
}

export function AdminInfoRow({
  label,
  value,
  strong,
}: {
  label: string;
  value: ReactNode;
  strong?: boolean;
}) {
  return (
    <div className="admin-info-row">
      <span className="admin-info-row__label">{label}</span>
      <span className={`admin-info-row__value ${strong ? "strong" : ""}`.trim()}>
        {value}
      </span>
    </div>
  );
}

type AdminQuickAction = {
  href: string;
  label: string;
  description: string;
  icon: LucideIcon;
};

export function AdminQuickActions({ items }: { items: AdminQuickAction[] }) {
  return (
    <div className="admin-quick-actions">
      {items.map((item) => {
        const Icon = item.icon;
        return (
          <Link key={item.href} href={item.href} className="admin-quick-action">
            <span className="admin-quick-action__icon" aria-hidden>
              <Icon size={20} strokeWidth={1.75} />
            </span>
            <span className="admin-quick-action__text">
              <strong>{item.label}</strong>
              <small>{item.description}</small>
            </span>
          </Link>
        );
      })}
    </div>
  );
}

export function AdminRecordChip({
  children,
  tone = "default",
}: {
  children: ReactNode;
  tone?: "default" | "success" | "warning" | "muted";
}) {
  return (
    <span className={`admin-record-chip admin-record-chip--${tone}`}>{children}</span>
  );
}

export function AdminRecordPanel({ children }: { children: ReactNode }) {
  return <div className="admin-record-panel">{children}</div>;
}
