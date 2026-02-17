import { memo, useState } from "react";
import { Link } from "react-router-dom";
import { 
    Clock, 
    Share2, 
    CreditCard, 
    Wallet, 
    Banknote, 
    Store, 
    Phone, 
    MapPin, 
    Copy, 
    Check,
    ChevronRight
} from "lucide-react";
import { ROUTERS } from "../../../../utils/router";
import smashfaster from "/src/assets/users/images/ulikeit/smashfaster.jpg";

const PaymentPage = () => {
  const [copied, setCopied] = useState(false);
  const accountNumber = "111122223333444";

  const handleCopy = () => {
    navigator.clipboard.writeText(accountNumber);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="bg-gray-50 min-h-screen py-12">
      <div className="container mx-auto px-4">
        {/* Header Section */}
        <div className="text-center mb-12">
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Payment Instructions</h1>
            <div className="flex items-center justify-center space-x-6 text-sm text-gray-500">
                <span className="flex items-center"><Clock className="w-4 h-4 mr-2"/> Updated: 31-12-2024</span>
                <span className="flex items-center text-blue-600 font-medium">SQB Official Support</span>
            </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-8 max-w-7xl mx-auto">
          {/* ======= LEFT CONTENT ======= */}
          <div className="w-full lg:w-3/4 space-y-8">
            
            {/* Intro Card */}
            <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100">
                 <p className="text-gray-600 leading-relaxed text-lg">
                    Welcome to <Link to="/" className="font-bold text-blue-600 hover:text-blue-700">ShopSQB</Link>. 
                    To ensure a smooth shopping experience, we offer flexible payment methods for both in-store and online purchases.
                </p>
            </div>

            {/* 1. In-Store Payment */}
            <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100">
                <div className="flex items-center mb-6">
                    <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 mr-4">
                        <Store className="w-5 h-5" />
                    </div>
                    <h2 className="text-2xl font-bold text-gray-900">1. Direct Payment at Stores</h2>
                </div>
                
                <div className="grid sm:grid-cols-3 gap-4">
                    {[
                        { icon: <Banknote className="w-6 h-6"/>, label: "Cash" },
                        { icon: <Phone className="w-6 h-6"/>, label: "Transfer" },
                        { icon: <CreditCard className="w-6 h-6"/>, label: "Cards (Visa/Master)" }
                    ].map((item, idx) => (
                        <div key={idx} className="flex flex-col items-center justify-center p-6 bg-gray-50 rounded-xl border border-gray-100 hover:border-blue-200 transition-colors">
                            <div className="text-blue-600 mb-3">{item.icon}</div>
                            <span className="font-medium text-gray-900">{item.label}</span>
                        </div>
                    ))}
                </div>
            </div>

             {/* 2. Online Payment */}
             <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100">
                <div className="flex items-center mb-6">
                    <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center text-green-600 mr-4">
                        <CreditCard className="w-5 h-5" />
                    </div>
                    <h2 className="text-2xl font-bold text-gray-900">2. Online Payment Methods</h2>
                </div>
                
                <div className="grid md:grid-cols-2 gap-6 mb-8">
                    <div className="p-6 border rounded-xl hover:shadow-md transition-all cursor-pointer group">
                        <div className="flex justify-between items-start mb-4">
                            <div className="bg-orange-100 p-2 rounded-lg text-orange-600">
                                <Wallet className="w-6 h-6" />
                            </div>
                            <div className="w-4 h-4 rounded-full border-2 border-gray-300 group-hover:border-blue-500"></div>
                        </div>
                        <h3 className="font-bold text-lg text-gray-900 mb-2">COD (Cash on Delivery)</h3>
                        <p className="text-sm text-gray-500">Pay safely when you receive your package.</p>
                    </div>

                    <div className="p-6 border-2 border-blue-500 bg-blue-50/50 rounded-xl cursor-pointer relative overflow-hidden">
                        <div className="absolute top-0 right-0 bg-blue-500 text-white text-xs px-2 py-1 rounded-bl-lg font-bold">RECOMMENDED</div>
                         <div className="flex justify-between items-start mb-4">
                            <div className="bg-blue-100 p-2 rounded-lg text-blue-600">
                                <Banknote className="w-6 h-6" />
                            </div>
                            <div className="w-4 h-4 rounded-full border-4 border-blue-500 shadow-sm"></div>
                        </div>
                        <h3 className="font-bold text-lg text-gray-900 mb-2">Bank Transfer</h3>
                        <p className="text-sm text-gray-500">Fast and secure direct bank transfer.</p>
                    </div>
                </div>

                {/* Bank Info Card */}
                <div className="relative overflow-hidden bg-gradient-to-r from-blue-900 to-blue-700 rounded-2xl p-8 text-white shadow-xl">
                    <div className="absolute top-0 right-0 p-32 bg-white opacity-5 rounded-full transform translate-x-1/2 -translate-y-1/2"></div>
                    
                    <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                        <div>
                             <p className="text-blue-200 text-sm font-medium tracking-wider mb-1">BANK TRANSFER TO</p>
                             <h3 className="text-2xl font-bold tracking-tight mb-4">SQB BADMINTON STORE</h3>
                             <p className="opacity-80 mb-1">Vietcombank - Phu Tho Branch</p>
                             <p className="opacity-80">Ho Chi Minh City</p>
                        </div>

                         <div className="bg-white/10 backdrop-blur-sm p-4 rounded-xl border border-white/20 w-full md:w-auto">
                            <p className="text-xs text-blue-200 mb-2">ACCOUNT NUMBER</p>
                            <div className="flex items-center gap-3">
                                <span className="font-mono text-2xl md:text-3xl font-bold tracking-wider">{accountNumber}</span>
                                <button 
                                    onClick={handleCopy}
                                    className="p-2 hover:bg-white/20 rounded-lg transition-colors"
                                    title="Copy Account Number"
                                >
                                    {copied ? <Check className="w-5 h-5 text-green-400" /> : <Copy className="w-5 h-5" />}
                                </button>
                            </div>
                            {copied && <span className="text-xs text-green-300 mt-1 block">Copied to clipboard!</span>}
                         </div>
                    </div>
                </div>
            </div>

             {/* 3. Store Locations */}
             <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100">
                 <div className="flex items-center mb-6">
                    <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center text-purple-600 mr-4">
                        <MapPin className="w-5 h-5" />
                    </div>
                    <h2 className="text-2xl font-bold text-gray-900">3. Visit Our Stores</h2>
                </div>

                 <div className="grid md:grid-cols-2 gap-6">
                    {[
                        { 
                            name: "SQB Super Center", 
                            addr: "81 Nam Ky Khoi Nghia, Binh Duong",
                            bank: "Vietcombank - SQB Badminton"
                        },
                        { 
                            name: "SQB SUPER PREMIUM", 
                            addr: "Dinh Hoa Ward, Thu Dau Mot City",
                            bank: "Techcombank - Nguyen Van B"
                        }
                    ].map((store, idx) => (
                        <div key={idx} className="border border-gray-200 rounded-xl p-6 hover:border-blue-300 hover:shadow-lg transition-all group">
                            <h4 className="font-bold text-lg text-gray-900 mb-3 flex items-center group-hover:text-blue-600 transition-colors">
                                <span className="w-6 h-6 bg-blue-100 rounded-full text-blue-600 flex items-center justify-center text-xs mr-2">{idx + 1}</span>
                                {store.name}
                            </h4>
                            <div className="space-y-2 text-sm text-gray-600">
                                <p className="flex items-start"><MapPin className="w-4 h-4 mr-2 mt-1 flex-shrink-0"/> {store.addr}</p>
                                <p className="flex items-center"><CreditCard className="w-4 h-4 mr-2 flex-shrink-0"/> {store.bank}</p>
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
export default memo(PaymentPage);
