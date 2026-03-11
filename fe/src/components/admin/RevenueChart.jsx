import React, { useState, useMemo } from "react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import {
  TrendingUp,
  Calendar,
  Zap,
  ArrowUpRight,
  ArrowDownRight,
  Activity,
  Maximize2,
} from "lucide-react";
import { motion as Motion, AnimatePresence } from "framer-motion";

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white/95 backdrop-blur-sm border border-slate-100 p-4 rounded-xl shadow-[0_10px_40px_-10px_rgba(0,0,0,0.1)] text-slate-800 min-w-[200px]">
        <div className="flex items-center justify-between mb-3">
          <p className="text-slate-400 text-xs font-bold uppercase tracking-widest">
            {label}
          </p>
          <div className="px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-600 text-[10px] font-bold border border-emerald-100">
            LIVE DATA
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="h-10 w-1 bg-indigo-500 rounded-full"></div>
          <div>
            <p className="text-2xl font-bold text-slate-900">
              {new Intl.NumberFormat("en-US", {
                style: "currency",
                currency: "VND",
              }).format(payload[0].value)}
            </p>
            <p className="text-xs text-slate-500 font-medium mt-0.5 flex items-center gap-1">
              <Activity size={12} /> Revenue Stream
            </p>
          </div>
        </div>
      </div>
    );
  }
  return null;
};

const RevenueChart = ({ data = [] }) => {
  const [timeRange, setTimeRange] = useState("30D");

  // Mock logic to filter data
  const filteredData = useMemo(() => {
    if (!data.length) return [];
    const days =
      timeRange === "7D" ? 7 : timeRange === "30D" ? 30 : data.length;
    return data.slice(-days);
  }, [data, timeRange]);

  const totalRevenue = useMemo(
    () => filteredData.reduce((acc, curr) => acc + (curr.revenue || 0), 0),
    [filteredData],
  );

  const prevRevenue = totalRevenue * 0.92;
  const growth = ((totalRevenue - prevRevenue) / prevRevenue) * 100;
  const isPositive = growth >= 0;

  return (
    <div className="col-span-12 xl:col-span-8 relative group">
      <Motion.div
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6 }}
        className="glass-card h-full flex flex-col"
      >
        {/* Header */}
        <div className="p-6 relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-6">
          <div className="space-y-1">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-indigo-50 rounded-lg text-indigo-600 border border-indigo-100">
                <Zap size={20} fill="currentColor" />
              </div>
              <h4 className="text-xl font-bold text-slate-800 tracking-tight">
                Revenue Analytics
              </h4>
            </div>
          </div>

          {/* Controls */}
          <div className="flex bg-slate-100/80 p-1 rounded-xl border border-slate-200">
            {["7D", "30D", "90D"].map((range) => (
              <button
                key={range}
                onClick={() => setTimeRange(range)}
                className={`relative px-5 py-2 text-xs font-bold rounded-lg transition-all duration-300 ${
                  timeRange === range
                    ? "text-indigo-600 shadow-sm bg-white"
                    : "text-slate-500 hover:text-slate-800"
                }`}
              >
                {timeRange === range && (
                  <Motion.div
                    layoutId="activeTab"
                    className="absolute inset-0 bg-white rounded-lg shadow-sm ring-1 ring-black/5"
                    transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                  />
                )}
                <span className="relative z-10">{range}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Metrics */}
        <div className="px-8 pb-4 flex items-end gap-12 relative z-10">
          <div>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">
              Total Revenue
            </p>
            <div className="flex items-center gap-4">
              <h3 className="text-4xl font-extrabold text-slate-900 tracking-tight">
                {new Intl.NumberFormat("en-US", {
                  style: "decimal",
                  maximumFractionDigits: 0,
                }).format(totalRevenue)}
                <span className="text-2xl text-slate-400 ml-1 font-semibold">
                  ₫
                </span>
              </h3>
            </div>
          </div>

          <div className="pb-2">
            <div
              className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-bold border ${
                isPositive
                  ? "bg-emerald-50 text-emerald-600 border-emerald-100"
                  : "bg-rose-50 text-rose-600 border-rose-100"
              }`}
            >
              {isPositive ? (
                <ArrowUpRight size={16} />
              ) : (
                <ArrowDownRight size={16} />
              )}
              {Math.abs(growth).toFixed(1)}%
            </div>
          </div>
        </div>

        {/* Chart */}
        <div className="flex-1 w-full min-h-[350px] relative z-10 mt-4">
          <ResponsiveContainer width="100%" height="100%" minHeight={350}>
            <AreaChart
              data={filteredData}
              margin={{ top: 20, right: 0, left: 0, bottom: 0 }}
            >
              <defs>
                <linearGradient id="colorEthereal" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#6366f1" stopOpacity={0.3} />
                  <stop offset="100%" stopColor="#6366f1" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid
                strokeDasharray="3 3"
                vertical={false}
                stroke="#e2e8f0"
              />
              <XAxis
                dataKey="date"
                axisLine={false}
                tickLine={false}
                tick={{ fill: "#64748b", fontSize: 11, fontWeight: 700 }}
                dy={15}
                minTickGap={30}
              />
              <YAxis
                axisLine={false}
                tickLine={false}
                tick={{ fill: "#64748b", fontSize: 11, fontWeight: 700 }}
                tickFormatter={(value) => `${(value / 1000000).toFixed(0)}M`}
                dx={-10}
                width={40}
              />
              <Tooltip content={<CustomTooltip />} />
              <Area
                type="monotone"
                dataKey="revenue"
                stroke="#6366f1"
                strokeWidth={4}
                fill="url(#colorEthereal)"
                animationDuration={1500}
                activeDot={{
                  r: 7,
                  stroke: "#fff",
                  strokeWidth: 4,
                  fill: "#6366f1",
                  shadow: "0 4px 10px rgba(99,102,241,0.5)",
                }}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </Motion.div>
    </div>
  );
};

export default RevenueChart;
