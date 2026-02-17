import { memo } from "react";
import { Link } from "react-router-dom";
import { 
    Clock, 
    Share2, 
    Mail, 
    MessageSquare, 
    Send,
    Phone, 
    MapPin, 
    ChevronRight,
    User,
    AtSign
} from "lucide-react";
import { ROUTERS } from "../../../utils/router";
import smashfaster from "/src/assets/users/images/ulikeit/smashfaster.jpg";

const branches = [
  {
    id: 1,
    name: "SQB Super Center",
    address: "81 Nam Ky Khoi Nghia, Ward, Binh Duong, Ho Chi Minh City, Vietnam",
    phone: "038 888 8888",
    map: "https://maps.app.goo.gl/dCA2issmb7C1cb8p8",
  },
  {
    id: 2,
    name: "SQB SUPER PREMIUM",
    address: "Nam Ky Khoi Nghia, Dinh Hoa, Thu Dau Mot, Binh Duong, Vietnam",
    phone: "038 999 9999",
    map: "https://maps.app.goo.gl/dCA2issmb7C1cb8p8",
  },
];

const Contact = () => {
  return (
    <div className="bg-gray-50 min-h-screen py-12">
      <div className="container mx-auto px-4">
        {/* Header Section */}
        <div className="text-center mb-12">
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Contact Us</h1>
            <div className="flex items-center justify-center space-x-6 text-sm text-gray-500">
                <span className="flex items-center"><Clock className="w-4 h-4 mr-2"/> Response time: ~24h</span>
                <span className="flex items-center text-blue-600 font-medium">Customer Care Team</span>
            </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-8 max-w-7xl mx-auto">
          {/* ======= LEFT CONTENT ======= */}
          <div className="w-full lg:w-3/4 space-y-8">
            
            {/* Intro Card */}
            <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100">
                 <p className="text-gray-600 leading-relaxed text-lg">
                    Have questions about products, orders, or need advice on badminton gear? 
                    <Link to="/" className="font-bold text-blue-600 hover:text-blue-700 mx-1">ShopSQB</Link> 
                    is here to help! Fill out the form below or visit our stores directly.
                </p>
            </div>

            {/* Contact Channels */}
            <div className="grid md:grid-cols-2 gap-6">
                <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 flex items-center group hover:border-blue-200 transition-all">
                     <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 mr-4 group-hover:scale-110 transition-transform">
                        <Phone className="w-6 h-6" />
                    </div>
                    <div>
                        <p className="text-sm text-gray-500 mb-1">Hotline Support</p>
                        <a href="tel:0388888888" className="text-xl font-bold text-gray-900 hover:text-blue-600">038 888 8888</a>
                        <p className="text-xs text-green-600 mt-1 flex items-center">
                            <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
                            Available 8:00 - 22:00
                        </p>
                    </div>
                </div>

                <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 flex items-center group hover:border-green-200 transition-all">
                     <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center text-green-600 mr-4 group-hover:scale-110 transition-transform">
                        <Mail className="w-6 h-6" />
                    </div>
                    <div>
                        <p className="text-sm text-gray-500 mb-1">Email Inquiry</p>
                        <a href="mailto:info@sqbbadminton.com" className="text-lg font-bold text-gray-900 hover:text-green-600">info@sqbbadminton.com</a>
                         <p className="text-xs text-gray-400 mt-1">We reply within 24 hours</p>
                    </div>
                </div>
            </div>

            {/* Contact Form */}
            <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100">
                <div className="flex items-center mb-8">
                    <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center text-orange-600 mr-4">
                        <MessageSquare className="w-5 h-5" />
                    </div>
                    <h2 className="text-2xl font-bold text-gray-900">Send us a message</h2>
                </div>
                
                <form className="space-y-6">
                    <div className="grid md:grid-cols-2 gap-6">
                        <div className="relative">
                            <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
                            <div className="relative">
                                <User className="absolute left-4 top-3.5 w-5 h-5 text-gray-400" />
                                <input
                                    type="text"
                                    placeholder="Your name"
                                    className="w-full pl-12 pr-4 py-3 rounded-xl border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all outline-none"
                                    required
                                />
                            </div>
                        </div>
                        <div>
                             <label className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
                             <div className="relative">
                                <AtSign className="absolute left-4 top-3.5 w-5 h-5 text-gray-400" />
                                <input
                                    type="email"
                                    placeholder="your@email.com"
                                    className="w-full pl-12 pr-4 py-3 rounded-xl border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all outline-none"
                                    required
                                />
                            </div>
                        </div>
                    </div>
                    
                    <div>
                         <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number</label>
                         <div className="relative">
                            <Phone className="absolute left-4 top-3.5 w-5 h-5 text-gray-400" />
                            <input
                                type="tel"
                                placeholder="Your phone number"
                                className="w-full pl-12 pr-4 py-3 rounded-xl border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all outline-none"
                                required
                            />
                        </div>
                    </div>
                    
                     <div>
                         <label className="block text-sm font-medium text-gray-700 mb-2">Message</label>
                          <textarea
                            placeholder="How can we help you today?"
                            rows="5"
                            className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all outline-none resize-none"
                            required
                        ></textarea>
                    </div>

                    <button 
                        type="submit" 
                        className="w-full bg-blue-600 text-white font-bold py-4 rounded-xl hover:bg-blue-700 transition-all shadow-lg shadow-blue-200 transform active:scale-[0.98] flex items-center justify-center"
                    >
                        <Send className="w-5 h-5 mr-2" />
                        Send Message
                    </button>
                 </form>
            </div>

             {/* Store Locations */}
             <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100">
                 <div className="flex items-center mb-6">
                    <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center text-purple-600 mr-4">
                        <MapPin className="w-5 h-5" />
                    </div>
                    <h2 className="text-2xl font-bold text-gray-900">Visit Our Stores</h2>
                </div>

                 <div className="grid md:grid-cols-2 gap-6">
                    {branches.map((store, idx) => (
                        <div key={idx} className="border border-gray-200 rounded-xl p-6 hover:border-purple-300 hover:shadow-lg transition-all group relative overflow-hidden">
                             <div className="absolute top-0 right-0 p-16 bg-gradient-to-br from-purple-50 to-transparent rounded-full opacity-50 transform translate-x-1/2 -translate-y-1/2"></div>
                            <h4 className="font-bold text-lg text-gray-900 mb-3 flex items-center group-hover:text-purple-600 transition-colors relative z-10">
                                <span className="w-6 h-6 bg-purple-100 rounded-full text-purple-600 flex items-center justify-center text-xs mr-2">{idx + 1}</span>
                                {store.name}
                            </h4>
                            <div className="space-y-3 text-sm text-gray-600 relative z-10">
                                <p className="flex items-start"><MapPin className="w-4 h-4 mr-2 mt-1 flex-shrink-0 text-gray-400"/> {store.address}</p>
                                <p className="flex items-center"><Phone className="w-4 h-4 mr-2 flex-shrink-0 text-gray-400"/> {store.phone}</p>
                                <a 
                                    href={store.map} 
                                    target="_blank" 
                                    rel="noopener noreferrer"
                                    className="inline-flex items-center text-purple-600 font-medium hover:underline mt-2"
                                >
                                    View on Map <ChevronRight className="w-4 h-4 ml-1" />
                                </a>
                            </div>
                        </div>
                    ))}
                 </div>
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
                    Recommended
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
export default memo(Contact);
