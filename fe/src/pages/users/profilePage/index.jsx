import { memo } from "react";
import { Link } from "react-router-dom";
import { ChevronRight } from "lucide-react";
import { ROUTERS } from "../../../utils/router";
import MissionVision from "../../../component/profilePage_Section/missionVision";
import ShopProfile from "../../../component/profilePage_Section/shopProfile";
import WhyChooseUs from "../../../component/profilePage_Section/whyChooseUS";

const ProfilePage = () => {
  return (
    <div className="bg-gray-50 min-h-screen py-12">
      <div className="container mx-auto px-4">
        {/* Header Section */}
        <div className="text-center mb-12">
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4 uppercase tracking-wide">
                About ShopSQB
            </h1>
            <div className="flex items-center justify-center space-x-6 text-sm text-gray-500">
                <span className="flex items-center">⭐ Established in 2023</span>
                <span className="flex items-center text-blue-600 font-medium">Trusted Sports Retailer</span>
            </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-8 max-w-7xl mx-auto">
          {/* ======= LEFT CONTENT ======= */}
          <div className="w-full lg:w-3/4 space-y-8">
             {/* Component 1: Shop Profile */}
             <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 overflow-hidden">
                <ShopProfile />
             </div>

             {/* Component 2: Why Choose Us */}
             <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 overflow-hidden">
                <WhyChooseUs />
             </div>

             {/* Component 3: Mission Vision */}
             <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 overflow-hidden">
                <MissionVision />
             </div>
          </div>

          {/* ======= RIGHT SIDEBAR ======= */}
          <aside className="w-full lg:w-1/4 space-y-8">
             {/* Categories */}
             <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
                    <span className="w-1 h-6 bg-blue-500 rounded-full mr-3"></span>
                    Categories
                </h3>
                <nav className="space-y-1">
                    {[
                        { to: "/news/promotions", label: "Promotions", icon: "🏷" },
                        { to: `/${ROUTERS.USER.NEWS}`, label: "Badminton News", icon: "🏸" },
                        { to: "/news/training-tips", label: "Training Tips", icon: "💡" },
                        { to: `/${ROUTERS.USER.PRODUCTS}`, label: "New Arrivals", icon: "🛍" },
                    ].map((item, idx) => (
                        <Link 
                            key={idx}
                            to={item.to} 
                            className="flex items-center px-4 py-3 text-gray-600 hover:bg-blue-50 hover:text-blue-600 rounded-lg transition-all group"
                        >
                            <span className="mr-3 group-hover:scale-110 transition-transform">{item.icon}</span>
                            <span className="font-medium">{item.label}</span>
                            <ChevronRight className="w-4 h-4 ml-auto opacity-0 group-hover:opacity-100 transition-opacity" />
                        </Link>
                    ))}
                </nav>
             </div>

             {/* Recommended Read */}
             <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
                    <span className="w-1 h-6 bg-blue-500 rounded-full mr-3"></span>
                    Quick Links
                </h3>
                <div className="space-y-4">
                     {[
                        { title: "Contact Support", link: "/contact", icon: "📞" },
                        { title: "Payment Instructions", link: "/payment", icon: "💳" },
                        { title: "Warranty Policy", link: "/news", icon: "🛡️" }
                    ].map((item, idx) => (
                        <Link key={idx} to={item.link} className="flex items-center p-3 bg-gray-50 rounded-lg hover:bg-blue-50 hover:text-blue-600 transition-colors">
                             <span className="mr-3 text-xl">{item.icon}</span>
                             <span className="font-medium">{item.title}</span>
                        </Link>
                    ))}
                </div>
             </div>
          </aside>
        </div>
      </div>
    </div>
  );
};
export default memo(ProfilePage);
