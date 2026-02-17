import React from "react";
import { Link } from "react-router-dom";
import { ROUTERS } from "../../../utils/router";

const ShopProfile = () => {
  return (
    <div className="flex flex-col md:flex-row items-center gap-8">
      {/* Image Side */}
      <div className="w-full md:w-1/2 relative group">
        <div className="relative rounded-2xl overflow-hidden shadow-md aspect-[4/3] border border-gray-100">
          <img
            src="/shopProfile/Sport Shop.jpg"
            alt="Sport Shop"
            loading="lazy"
            className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-700"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
        </div>
      </div>

      {/* Content Side */}
      <div className="w-full md:w-1/2 space-y-5">
        <h2 className="text-2xl md:text-3xl font-bold text-gray-900 leading-tight">
          <span className="text-blue-600 block mb-1">🏆 SQB Badminton</span>
          Official Sports Equipment
        </h2>
        <p className="text-base text-gray-600 leading-relaxed">
          We offer <strong className="text-gray-900">premium sports equipment</strong> from
          international brands. With the mission to{" "}
          <em className="text-gray-800 not-italic">inspire the spirit of sports</em>, we provide a modern shopping
          experience and dedicated customer service.
        </p>
        
        <ul className="space-y-2">
          {[
            "100% authentic products",
            "Professional consultation service",
            "Fast nationwide delivery",
            "Wide range of sports products"
          ].map((item, idx) => (
            <li key={idx} className="flex items-center text-gray-700 text-sm md:text-base">
              <span className="w-2 h-2 bg-blue-500 rounded-full mr-3 flex-shrink-0"></span>
              {item}
            </li>
          ))}
        </ul>

        <div className="pt-2">
            <Link 
                to={`/${ROUTERS.USER.PRODUCTS}`} 
                className="inline-flex items-center justify-center px-6 py-2.5 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors shadow-sm hover:shadow-md"
            >
                Explore now →
            </Link>
        </div>
      </div>
    </div>
  );
};


export default ShopProfile;
