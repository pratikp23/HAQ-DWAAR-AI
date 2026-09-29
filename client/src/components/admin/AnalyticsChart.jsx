import React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";

const DEFAULT_COLORS = [
  "#240b49", // Deep Purple
  "#ea580c", // Solar Saffron
  "#059669", // Emerald
  "#2563eb", // Blue
  "#7c3aed", // Violet
  "#db2777", // Pink
  "#d97706", // Amber
  "#64748b", // Slate
];

export function StatusBarChart({
  title,
  data = [],
  xKey = "label",
  yKey = "count",
  barColor = "#240b49",
  height = 260,
  emptyMessage = "No activity data recorded in selected range.",
}) {
  const hasData = data && data.some((d) => d[yKey] > 0);

  return (
    <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm space-y-4">
      <div className="flex items-center justify-between pb-2 border-b border-slate-100">
        <h4 className="font-extrabold text-slate-900 text-sm sm:text-base">
          {title}
        </h4>
      </div>

      {!hasData ? (
        <div
          style={{ height }}
          className="flex items-center justify-center text-xs text-slate-400 font-medium"
        >
          {emptyMessage}
        </div>
      ) : (
        <div style={{ width: "100%", height }}>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={data}
              margin={{ top: 10, right: 10, left: -20, bottom: 20 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
              <XAxis
                dataKey={xKey}
                tick={{ fontSize: 11, fill: "#64748b" }}
                interval={0}
                angle={-15}
                textAnchor="end"
              />
              <YAxis
                allowDecimals={false}
                tick={{ fontSize: 11, fill: "#64748b" }}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#1e0a3c",
                  borderRadius: "12px",
                  color: "#fff",
                  fontSize: "12px",
                  border: "none",
                  boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1)",
                }}
                itemStyle={{ color: "#ffedd5" }}
                formatter={(val) => [val, "Count"]}
              />
              <Bar dataKey={yKey} fill={barColor} radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
}

export function DistributionPieChart({
  title,
  data = [],
  nameKey = "label",
  valueKey = "count",
  height = 260,
  colors = DEFAULT_COLORS,
  emptyMessage = "No distribution data available.",
}) {
  const hasData = data && data.some((d) => d[valueKey] > 0);

  return (
    <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm space-y-4">
      <div className="flex items-center justify-between pb-2 border-b border-slate-100">
        <h4 className="font-extrabold text-slate-900 text-sm sm:text-base">
          {title}
        </h4>
      </div>

      {!hasData ? (
        <div
          style={{ height }}
          className="flex items-center justify-center text-xs text-slate-400 font-medium"
        >
          {emptyMessage}
        </div>
      ) : (
        <div style={{ width: "100%", height }}>
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                dataKey={valueKey}
                nameKey={nameKey}
                cx="50%"
                cy="50%"
                innerRadius={50}
                outerRadius={80}
                paddingAngle={3}
              >
                {data.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={entry.color || colors[index % colors.length]}
                  />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{
                  backgroundColor: "#1e0a3c",
                  borderRadius: "12px",
                  color: "#fff",
                  fontSize: "12px",
                  border: "none",
                }}
                itemStyle={{ color: "#ffedd5" }}
              />
              <Legend
                verticalAlign="bottom"
                wrapperStyle={{ fontSize: "11px", paddingTop: "10px" }}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
}

export default {
  StatusBarChart,
  DistributionPieChart,
};
