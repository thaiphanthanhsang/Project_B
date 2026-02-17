import React from "react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  Legend
} from "recharts";
import "./DashboardCharts.css";

const DashboardCharts = ({ salesData, searchData, orderStatusData }) => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
      {/* Revenue Trend Area Chart */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
        <div className="mb-6">
            <h3 className="text-lg font-bold text-gray-800">Revenue Trend</h3>
            <p className="text-sm text-gray-500">Income over the last 30 days</p>
        </div>
        <div className="h-[300px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={salesData}>
              <defs>
                <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8}/>
                  <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
              <XAxis 
                dataKey="date" 
                axisLine={false} 
                tickLine={false} 
                tick={{fill: '#9ca3af', fontSize: 12}} 
                dy={10}
              />
              <YAxis 
                axisLine={false} 
                tickLine={false} 
                tick={{fill: '#9ca3af', fontSize: 12}}
                tickFormatter={(value) => `${value / 1000}k`}
              />
              <Tooltip 
                contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}
                formatter={(value) => new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(value)}
              />
              <Area 
                type="monotone" 
                dataKey="revenue" 
                stroke="#3b82f6" 
                strokeWidth={2}
                fillOpacity={1} 
                fill="url(#colorRevenue)" 
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Top Search Keywords Bar Chart */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
         <div className="mb-6">
            <h3 className="text-lg font-bold text-gray-800">Top Search Keywords</h3>
            <p className="text-sm text-gray-500">What customers are looking for</p>
        </div>
        <div className="h-[300px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              layout="vertical"
              data={searchData}
              margin={{ top: 5, right: 30, left: 40, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} stroke="#f3f4f6" />
              <XAxis type="number" hide />
              <YAxis 
                dataKey="keyword" 
                type="category" 
                width={100} 
                tick={{fill: '#4b5563', fontSize: 13, fontWeight: 500}} 
                axisLine={false}
                tickLine={false}
              />
              <Tooltip 
                 cursor={{fill: '#f9fafb'}}
                 contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}
              />
              <Bar dataKey="count" fill="#8b5cf6" radius={[0, 4, 4, 0]} barSize={20} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default DashboardCharts;
