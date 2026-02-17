import React from "react";
import { ArrowUp, ArrowDown } from "lucide-react";

const DashboardCard = ({ title, value, icon, change, isPositive }) => {
  return (
    <div className="glass-card p-6 flex flex-col justify-between group">
      {/* Background Icon - Subtle */}
      <div className="absolute -right-6 -bottom-6 opacity-5 pointer-events-none group-hover:opacity-10 transition-opacity duration-300 transform rotate-12">
        {React.cloneElement(icon, { size: 120, color: "#6366f1" })}
      </div>

      <div className="flex justify-between items-start z-10">
        <div className="flex flex-col gap-1">
          <span className="text-slate-500 text-xs font-bold tracking-wider uppercase">
            {title}
          </span>
          <h4 className="text-3xl font-extrabold text-slate-800 tracking-tight mt-1">
            {value}
          </h4>
        </div>
        <div className="p-3 rounded-2xl bg-indigo-50/80 text-indigo-600 border border-indigo-100 group-hover:bg-indigo-600 group-hover:text-white transition-all duration-300 shadow-sm">
          {React.cloneElement(icon, { size: 22, strokeWidth: 2 })}
        </div>
      </div>

      <div className="mt-6 flex items-center gap-3 z-10">
        <div
          className={`flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold border ${
            isPositive
              ? "bg-emerald-50 text-emerald-600 border-emerald-100"
              : "bg-rose-50 text-rose-600 border-rose-100"
          }`}
        >
          {isPositive ? <ArrowUp size={12} /> : <ArrowDown size={12} />}
          {change}
        </div>
        <span className="text-xs text-slate-400 font-medium">
          vs last month
        </span>
      </div>
    </div>
  );
};

export default DashboardCard;
