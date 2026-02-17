import React from "react";
import { DollarSign, ShoppingCart, Users, Activity, Package } from "lucide-react";
import "./DashboardStats.css";

const DashboardStats = ({ stats }) => {
  const statItems = [
    {
      title: "Total Revenue",
      value: new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(stats.revenue),
      icon: <DollarSign size={24} className="text-green-600" />,
      change: "+12.5%",
      bg: "bg-green-50",
      border: "border-green-200"
    },
    {
      title: "Total Orders",
      value: stats.totalOrders,
      icon: <ShoppingCart size={24} className="text-blue-600" />,
      change: "+5.2%",
      bg: "bg-blue-50",
      border: "border-blue-200"
    },
    {
      title: "Active Users",
      value: stats.totalUsers,
      icon: <Users size={24} className="text-purple-600" />,
      change: "+3.1%",
      bg: "bg-purple-50",
      border: "border-purple-200"
    },
    {
        title: "Completion Rate",
        value: `${stats.completionRate}%`,
        icon: <Activity size={24} className="text-pink-600" />,
        change: "-1.2%",
        bg: "bg-pink-50",
        border: "border-pink-200"
    },
    {
        title: "Low Stock Alert",
        value: stats.lowStock,
        icon: <Package size={24} className="text-orange-600" />,
        change: "Needs Action",
        bg: "bg-orange-50",
        border: "border-orange-200"
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
      {statItems.map((item, index) => (
        <div 
          key={index} 
          className={`bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow border border-gray-100 relative overflow-hidden group`}
        >
            <div className={`absolute top-0 right-0 p-3 opacity-10 group-hover:opacity-20 transition-opacity`}>
                {React.cloneElement(item.icon, { size: 48 })}
            </div>
            
            <div className="flex items-center justify-between mb-4">
                <div className={`p-2 rounded-lg ${item.bg} ${item.border} border`}>
                    {item.icon}
                </div>
                {item.change && (
                    <span className={`text-xs font-semibold px-2 py-1 rounded-full ${item.change.includes('+') ? 'text-green-600 bg-green-50' : item.change === 'Needs Action' ? 'text-red-600 bg-red-50' : 'text-red-500 bg-red-50'}`}>
                        {item.change}
                    </span>
                )}
            </div>
            
            <div>
                 <p className="text-sm text-gray-500 font-medium mb-1">{item.title}</p>
                 <h3 className="text-2xl font-bold text-gray-800">{item.value}</h3>
            </div>
        </div>
      ))}
    </div>
  );
};

export default DashboardStats;
