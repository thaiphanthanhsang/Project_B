import { memo } from "react";

import { Link } from "react-router-dom";
import { 
    Clock, 
    ChevronRight,
    Search
} from "lucide-react";
import { ROUTERS } from "../../../utils/router";
import smashfaster from "/src/assets/users/images/ulikeit/smashfaster.jpg";

const newsList = [
  {
    id: 1,
    title: "Review of Trung Son Pickleball Court in Binh Chanh District, Ho Chi Minh City",
    link: `/${ROUTERS.USER.NEWS}/review-trung-son-pickleball-court`,
    img: "/newsImages/san-pickleball-trung-son.jpg",
    time: "27-09-2025 15:07",
    desc: "Located in Binh Chanh District, Ho Chi Minh City, Trung Son Pickleball Court is highly rated by many players...",
  },
  {
    id: 2,
    title: "Mastering Pickleball Footwork: How to Move Efficiently and Control the Court",
    link: `/${ROUTERS.USER.NEWS}/pickleball-footwork-tips`,
    img: "/newsImages/cach-di-chuyen-trong-pickleball.jpg",
    time: "27-09-2025 14:20",
    desc: "Smart movement is the key to dominating the pickleball court. Whether in singles or doubles, proper footwork helps you...",
  },
  {
    id: 3,
    title: "DUPR Pickleball: Overview and Guide to How the DUPR Rating System Works",
    link: `/${ROUTERS.USER.NEWS}/dupr-pickleball`,
    img: "/newsImages/dupr-pickleball.jpg",
    time: "27-09-2025 11:03",
    desc: "DUPR Pickleball is currently the most popular and dynamic rating system used widely in the pickleball community...",
  },
  {
    id: 4,
    title: "Singles vs Doubles Pickleball: A Detailed Comparison Between the Two Formats",
    link: `/${ROUTERS.USER.NEWS}/singles-vs-doubles-pickleball`,
    img: "/newsImages/so-sanh-pickleball-don-va-doi.jpg",
    time: "27-09-2025 09:42",
    desc: "Pickleball can be played in singles or doubles, but there are many differences in rules, strategies, and playing style...",
  },
  {
    id: 5,
    title: "How to Hold a Pickleball Paddle: Simple and Effective Techniques for Beginners",
    link: `/${ROUTERS.USER.NEWS}/how-to-hold-pickleball-paddle`,
    img: "/newsImages/cach-cam-vot-pickleball.jpg",
    time: "27-09-2025 08:06",
    desc: "To play pickleball effectively, learning the correct way to hold the paddle is crucial—especially for beginners...",
  },
  {
    id: 6,
    title: "Pickleball Paddle 14mm vs 16mm: In-Depth Comparison of the Key Differences",
    link: `/${ROUTERS.USER.NEWS}/pickleball-paddle-14mm-vs-16mm`,
    img: "/newsImages/so-sanh-vot-pickleball-14mm-va-16mm.jpg",
    time: "26-09-2025 16:10",
    desc: "When choosing a pickleball paddle, the thickness of the paddle face greatly affects your playing style and control...",
  },
];


const News = () => {
  return (
    <div className="bg-gray-50 min-h-screen py-12">
      <div className="container mx-auto px-4">
        {/* Header Section */}
        <div className="text-center mb-12">
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4 uppercase tracking-wide">
                News & Blog
            </h1>
            <div className="flex items-center justify-center space-x-6 text-sm text-gray-500">
                <span className="flex items-center"><Clock className="w-4 h-4 mr-2"/> Latest Updates</span>
                <span className="flex items-center text-blue-600 font-medium">Badminton & Pickleball</span>
            </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-8 max-w-7xl mx-auto">
          {/* ======= LEFT CONTENT: NEWS GRID ======= */}
          <div className="w-full lg:w-3/4">
             <div className="grid md:grid-cols-2 gap-8">
                {newsList.map((news) => (
                    <div
                    key={news.id}
                    className="bg-white rounded-2xl overflow-hidden border border-gray-100 hover:shadow-lg transition-all duration-300 group flex flex-col"
                    >
                    <Link to={news.link} className="block overflow-hidden aspect-video relative">
                        <img
                        src={news.img}
                        alt={news.title}
                        loading="lazy"
                        className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-500"
                        />
                        <div className="absolute inset-0 bg-black/5 group-hover:bg-black/0 transition-colors"></div>
                    </Link>
                    
                    <div className="p-6 flex-1 flex flex-col">
                        <div className="flex items-center text-xs text-gray-400 mb-3 space-x-2">
                             <Clock className="w-3 h-3" />
                             <span>{news.time}</span>
                        </div>
                        
                        <h3 className="text-lg font-bold text-gray-900 mb-3 line-clamp-2 group-hover:text-blue-600 transition-colors">
                        <Link to={news.link} title={news.title}>
                            {news.title}
                        </Link>
                        </h3>
                        
                        <p className="text-gray-600 mb-4 line-clamp-3 leading-relaxed text-sm flex-1">
                            {news.desc}
                        </p>
                        
                        <Link 
                            to={news.link} 
                            className="inline-flex items-center text-blue-600 font-bold hover:text-blue-700 hover:underline mt-auto"
                        >
                            Read more <ChevronRight className="w-4 h-4 ml-1" />
                        </Link>
                    </div>
                    </div>
                ))}
            </div>
            
            {/* Pagination Placeholder (Visual Only) */}
            <div className="mt-12 flex justify-center space-x-2">
                <button className="w-10 h-10 rounded-lg bg-blue-600 text-white font-bold">1</button>
                <button className="w-10 h-10 rounded-lg hover:bg-gray-200 text-gray-600 font-medium transition-colors">2</button>
                <button className="w-10 h-10 rounded-lg hover:bg-gray-200 text-gray-600 font-medium transition-colors">3</button>
                <span className="w-10 h-10 flex items-center justify-center text-gray-400">...</span>
                <button className="w-10 h-10 rounded-lg hover:bg-gray-200 text-gray-600 font-medium transition-colors"><ChevronRight className="w-5 h-5"/></button>
            </div>
          </div>

          {/* ======= RIGHT SIDEBAR ======= */}
          <aside className="w-full lg:w-1/4 space-y-8">
             {/* Search Widget */}
             <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                <h3 className="text-lg font-bold text-gray-900 mb-4">Search</h3>
                <div className="relative">
                    <input 
                        type="text" 
                        placeholder="Search articles..." 
                        className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all outline-none text-sm"
                    />
                    <Search className="absolute left-3 top-3.5 w-4 h-4 text-gray-400" />
                </div>
             </div>

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
                    Trending Now
                </h3>
                <div className="space-y-6">
                     {[
                        { img: "/badmintonProduct/rackets.jpg", title: "Beginner's Guide to Rackets", date: "Sep 29", link: "/news" },
                        { img: "/badmintonProduct/shoes.jpg", title: "Top 5 Shoes for Speed", date: "Sep 10", link: "/news" },
                        { img: smashfaster, title: "Smash Faster in 3 Steps", date: "Aug 02", link: "/news" }
                    ].map((item, idx) => (
                        <Link key={idx} to={item.link} className="flex gap-4 group">
                             <div className="w-20 h-20 flex-shrink-0 rounded-lg overflow-hidden relative">
                                <img 
                                    src={item.img} 
                                    alt={item.title} 
                                    className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-500"
                                />
                                <div className="absolute inset-0 bg-black/5 group-hover:bg-black/0 transition-colors"></div>
                            </div>
                            <div>
                                <h4 className="text-sm font-bold text-gray-800 line-clamp-2 mb-2 group-hover:text-blue-600 transition-colors">
                                    {item.title}
                                </h4>
                                <span className="text-xs font-medium text-gray-400 bg-gray-100 px-2 py-1 rounded-full">
                                    {item.date}
                                </span>
                            </div>
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
export default memo(News);
