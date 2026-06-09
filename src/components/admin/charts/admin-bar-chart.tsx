"use client";

import type { ChartDataPoint } from "@/types/analytics";

type AdminBarChartProps = {
  data: ChartDataPoint[];
  orientation?: "horizontal" | "vertical";
  valueFormatter?: (value: number) => string;
  barColor?: string;
};

const DEFAULT_COLOR = "#3D5EE1";

export function AdminBarChart({
  data,
  orientation = "vertical",
  valueFormatter = (v) => v.toLocaleString("en-IN"),
  barColor = DEFAULT_COLOR,
}: AdminBarChartProps) {
  const maxValue = Math.max(...data.map((d) => d.value), 1);

  if (data.length === 0) {
    return <p className="admin-chart-empty">No data available</p>;
  }

  if (orientation === "horizontal") {
    return (
      <div className="admin-bar-chart admin-bar-chart--horizontal">
        {data.map((item) => {
          const width = `${(item.value / maxValue) * 100}%`;
          const color = item.color ?? barColor;

          return (
            <div key={item.label} className="admin-bar-chart-row">
              <span className="admin-bar-chart-label" title={item.label}>
                {item.label}
              </span>
              <div className="admin-bar-chart-track">
                <div
                  className="admin-bar-chart-fill"
                  style={{ width, background: color }}
                />
              </div>
              <span className="admin-bar-chart-value">
                {valueFormatter(item.value)}
              </span>
            </div>
          );
        })}
      </div>
    );
  }

  return (
    <div className="admin-bar-chart admin-bar-chart--vertical">
      {data.map((item) => {
        const height = `${(item.value / maxValue) * 100}%`;
        const color = item.color ?? barColor;

        return (
          <div key={item.label} className="admin-bar-chart-column">
            <span className="admin-bar-chart-value">{valueFormatter(item.value)}</span>
            <div className="admin-bar-chart-track">
              <div
                className="admin-bar-chart-fill"
                style={{ height, background: color }}
              />
            </div>
            <span className="admin-bar-chart-label" title={item.label}>
              {item.label}
            </span>
          </div>
        );
      })}
    </div>
  );
}
