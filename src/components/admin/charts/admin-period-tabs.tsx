"use client";

import type { AnalyticsPeriod } from "@/types/analytics";

const PERIODS: { value: AnalyticsPeriod; label: string }[] = [
  { value: "7d", label: "7 Days" },
  { value: "30d", label: "30 Days" },
  { value: "90d", label: "90 Days" },
];

type AdminPeriodTabsProps = {
  value: AnalyticsPeriod;
  onChange: (period: AnalyticsPeriod) => void;
};

export function AdminPeriodTabs({ value, onChange }: AdminPeriodTabsProps) {
  return (
    <div className="admin-period-tabs">
      {PERIODS.map((period) => (
        <button
          key={period.value}
          type="button"
          className={`admin-period-tab ${value === period.value ? "active" : ""}`}
          onClick={() => onChange(period.value)}
        >
          {period.label}
        </button>
      ))}
    </div>
  );
}
