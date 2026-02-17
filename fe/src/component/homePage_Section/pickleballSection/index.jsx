import React, { memo } from "react";
import { Link } from "react-router-dom";
import { ROUTERS } from "../../../utils/router";

const PickleballSection = () => {
  const products = [
    {
      href: `/${ROUTERS.USER.PRODUCTS}/pickleball-rackets`,
      title: "PickleBall Rackets",
      img: "/pickleballProduct/racket.jpg",
    },
    {
      href: `/${ROUTERS.USER.PRODUCTS}/pickleball-shoes`,
      title: "Pickleball Shoes",
      img: "/pickleballProduct/shoes.jpg",
    },
    {
      href: `/${ROUTERS.USER.PRODUCTS}/pickleball-bags`,
      title: "Pickleball Bags",
      img: "/pickleballProduct/bag.jpg",
    },
    {
      href: `/${ROUTERS.USER.PRODUCTS}/pickleball-shirts`,
      title: "Pickleball Shirts",
      img: "/pickleballProduct/shirt.jpg",
    },
  ];

  return (
    <section className="py-12 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-gray-900 uppercase tracking-wide">
                Pickleball Products
            </h2>
            <div className="w-16 h-1 bg-blue-500 mx-auto mt-2 rounded-full"></div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {products.map((item, index) => (
             <Link 
                key={index} 
                to={item.href} 
                className="group block bg-gray-50 rounded-xl shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden"
            >
              <div className="aspect-square relative overflow-hidden">
                <img 
                    src={item.img} 
                    alt={item.title} 
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" 
                />
                 <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors flex items-end justify-center pb-6">
                    <span className="text-white font-bold text-lg drop-shadow-md translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
                        {item.title}
                    </span>
                 </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};

export default memo(PickleballSection);
