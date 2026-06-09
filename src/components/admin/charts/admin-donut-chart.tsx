"use client";

import type { DonutSegment } from "@/types/analytics";

type AdminDonutChartProps = {
  segments: DonutSegment[];
  valueSuffix?: string;
  showPercentages?: boolean;
};

function buildDonutGradient(segments: DonutSegment[], total: number) {
  if (total === 0) return "#e5e7eb 0% 100%";

  return segments
    .reduce(
      (acc, item, i) => {
        const start = segments.slice(0, i).reduce((sum, seg) => sum + seg.value, 0);
        const end = start + item.value;
        const startPct = (start / total) * 100;
        const endPct = (end / total) * 100;
        acc.stops.push(`${item.color} ${startPct}% ${endPct}%`);
        return acc;
      },
      { stops: [] as string[] },
    )
    .stops.join(", ");
}

export function AdminDonutChart({
  segments,
  valueSuffix = "",
  showPercentages = true,
}: AdminDonutChartProps) {
  const total = segments.reduce((sum, item) => sum + item.value, 0);
  const gradient = buildDonutGradient(segments, total);

  return (
    <div className="admin-donut-chart">
      <div
        className="admin-donut-ring"
        style={{ background: `conic-gradient(${gradient})` }}
      />
      <div className="admin-donut-legend">
        {segments.map((item) => {
          const pct = total > 0 ? Math.round((item.value / total) * 100) : 0;
          const display = showPercentages
            ? `${item.label} (${pct}%)`
            : `${item.label} (${item.value}${valueSuffix})`;

          return (
            <div key={item.label} className="admin-donut-legend-item">
              <span className="admin-donut-dot" style={{ background: item.color }} />
              {display}
            </div>
          );
        })}
      </div>
    </div>
  );
}
