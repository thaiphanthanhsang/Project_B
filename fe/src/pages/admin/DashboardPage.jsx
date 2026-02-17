import React, { useEffect, useState } from "react";
import { dashboardService } from "../../services/dashboardService";
import DashboardCard from "../../components/admin/DashboardCard";
import RevenueChart from "../../components/admin/RevenueChart";
import LowStockTable from "../../components/admin/LowStockTable";
import NotificationDropdown from "../../components/admin/NotificationDropdown";
import {
  DollarSign,
  ShoppingCart,
  Users,
  Package,
  RefreshCw,
  Search,
} from "lucide-react";
import toast, { Toaster } from "react-hot-toast";
import "./TailAdmin.css";
import SearchAnalyticsModal from "../../components/admin/SearchAnalyticsModal";

const DashboardPage = () => {
  const [stats, setStats] = useState({
    revenue: 0,
    totalOrders: 0,
    totalUsers: 0,
    lowStock: 0,
    completionRate: 0,
  });
  const [salesData, setSalesData] = useState([]);
  const [lowStockList, setLowStockList] = useState([]);
  const [searchData, setSearchData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [isSearchReportOpen, setIsSearchReportOpen] = useState(false);

  const fetchAllData = async (isRefresh = false) => {
    if (isRefresh) setRefreshing(true);
    else setLoading(true);

    try {
      const [statsData, sales, lowStock, search] = await Promise.all([
        dashboardService.getStats({}),
        dashboardService.getSalesChart({}),
        dashboardService.getLowStockList(),
        dashboardService.getSearchAnalytics(),
      ]);

      setStats(statsData);
      setSalesData(sales);
      setLowStockList(lowStock);
      setSearchData(search);

      if (isRefresh) toast.success("Dashboard synced successfully");
    } catch (error) {
      console.error("Dashboard Load Error:", error);
      if (isRefresh) toast.error("Sync Failed");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchAllData();
  }, []);

  // Skeleton Loader (Premium)
  if (loading && !stats.revenue) {
    return (
      <div className="bg-slate-50 min-h-screen p-6 2xl:p-10">
        <div className="animate-pulse space-y-8">
          <div className="flex justify-between">
            <div className="h-10 w-48 bg-slate-200 rounded-lg"></div>
            <div className="h-10 w-32 bg-slate-200 rounded-full"></div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map((i) => (
              <div
                key={i}
                className="h-40 bg-white rounded-2xl shadow-sm"
              ></div>
            ))}
          </div>
          <div className="h-96 bg-white rounded-2xl shadow-sm"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-holographic min-h-screen p-6 2xl:p-10 font-sans transition-all duration-500 text-white selection:bg-cyan-500/30">
      <Toaster
        position="top-right"
        toastOptions={{
          className: "",
          style: {
            border: "1px solid rgba(255,255,255,0.1)",
            padding: "12px 16px",
            color: "#fff",
            backgroundColor: "rgba(10, 10, 20, 0.8)",
            backdropFilter: "blur(12px)",
            boxShadow: "0 0 20px rgba(0,0,0,0.5)",
            borderRadius: "12px",
            fontWeight: 500,
          },
        }}
      />

      {/* Header Area */}
      <div className="mb-10 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between relative z-10">
        <div>
          <h2 className="text-4xl font-black tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-white via-cyan-100 to-indigo-200 drop-shadow-[0_0_10px_rgba(255,255,255,0.3)]">
            COMMAND CENTER
          </h2>
          <p className="text-blue-200/70 font-medium mt-2 text-sm tracking-wide uppercase">
            System Status:{" "}
            <span className="text-cyan-400 text-glow">Online</span>
          </p>
        </div>

        <div className="flex items-center gap-4">
          <button
            onClick={() => fetchAllData(true)}
            disabled={refreshing}
            className="btn-holo flex items-center gap-2 px-6 py-3 text-sm active:scale-95 disabled:opacity-50"
          >
            <RefreshCw
              size={18}
              className={
                refreshing ? "animate-spin text-cyan-400" : "text-slate-300"
              }
            />
            <span className={refreshing ? "text-cyan-400" : "text-white"}>
              {refreshing ? "SYNCING..." : "REFRESH DATA"}
            </span>
          </button>
          <div className="h-10 w-[1px] bg-white/10 mx-2"></div>
          <NotificationDropdown />
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 gap-8 md:grid-cols-2 xl:grid-cols-4 mb-10 relative z-10">
        <DashboardCard
          title="Total Revenue"
          value={new Intl.NumberFormat("vi-VN", {
            style: "currency",
            currency: "VND",
          }).format(stats.revenue)}
          icon={<DollarSign />}
          change="+12.5%"
          isPositive={true}
        />
        <DashboardCard
          title="Total Orders"
          value={stats.totalOrders}
          icon={<ShoppingCart />}
          change="+5.2%"
          isPositive={true}
        />
        <DashboardCard
          title="Total Customers"
          value={stats.totalUsers}
          icon={<Users />}
          change="+2.4%"
          isPositive={true}
        />
        <DashboardCard
          title="Completion Rate"
          value={`${stats.completionRate}%`}
          icon={<Package />} // Changed from Product Sold logic to Completion Rate based on data
          change="-0.5%"
          isPositive={false}
        />
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-12 gap-6">
        {/* Revenue Chart */}
        <RevenueChart data={salesData} />

        {/* Top Search Keywords (Sidebar Widget) */}
        {/* Top Search Keywords (Sidebar Widget) */}
        {/* Top Search Keywords (Sidebar Widget) */}
        <div className="col-span-12 xl:col-span-4 glass-card p-6 flex flex-col h-full group">
          <div className="mb-6 flex items-center justify-between z-10">
            <div>
              <h4 className="text-lg font-bold text-slate-800 tracking-tight">
                Top Searches
              </h4>
              <p className="text-xs text-slate-500 mt-0.5">
                Most searched keywords
              </p>
            </div>
            <div className="p-2 bg-indigo-50 rounded-lg text-indigo-500 border border-indigo-100">
              <Search size={18} />
            </div>
          </div>
          <div className="flex flex-col gap-5 flex-1 justify-center relative z-10">
            {searchData.length > 0 ? (
              searchData.slice(0, 6).map((item, index) => (
                <div key={index} className="group/item">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-semibold text-slate-700 group-hover/item:text-indigo-600 transition-all">
                      {item.keyword}
                    </span>
                    <span className="text-xs font-bold text-slate-500 bg-slate-100 px-2 py-0.5 rounded-md group-hover/item:bg-indigo-50 group-hover/item:text-indigo-600 transition-colors">
                      {item.count}
                    </span>
                  </div>
                  <div className="relative h-1.5 w-full rounded-full bg-slate-100 overflow-hidden">
                    <div
                      className="absolute left-0 h-full rounded-full bg-slate-400 group-hover/item:bg-indigo-500 transition-all duration-500"
                      style={{
                        width: `${Math.min((item.count / 10) * 100, 100)}%`,
                      }}
                    ></div>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-10">
                <Search size={48} className="mx-auto text-slate-200 mb-2" />
                <p className="text-sm text-slate-400">
                  No search data recorded yet.
                </p>
              </div>
            )}
          </div>
          <button
            onClick={() => setIsSearchReportOpen(true)}
            className="mt-6 w-full btn-ethereal py-3 text-sm z-10 text-slate-600 hover:text-indigo-600"
          >
            View Full Report
          </button>
        </div>

        {/* Low Stock Table (Full width below) */}
        <div className="col-span-12">
          <LowStockTable data={lowStockList} />
        </div>
      </div>

      {/* Modals */}
      <SearchAnalyticsModal
        isOpen={isSearchReportOpen}
        onClose={() => setIsSearchReportOpen(false)}
        data={searchData}
      />
    </div>
  );
};

export default DashboardPage;
