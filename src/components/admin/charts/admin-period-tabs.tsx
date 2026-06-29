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
  periods?: { value: AnalyticsPeriod; label: string }[];
};

export function AdminPeriodTabs({
  value,
  onChange,
  periods = PERIODS,
}: AdminPeriodTabsProps) {
  return (
    <div className="admin-period-tabs">
      {periods.map((period) => (
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
