import { memo } from "react";
import { Link } from "react-router-dom";
import { ROUTERS } from "../../../utils/router";

const BadmintonSection = () => {
  const products = [
    {
      href: `/${ROUTERS.USER.PRODUCTS}/rackets`,
      img: "/badmintonProduct/rackets.jpg",
      title: "Badminton Rackets",
    },
    {
      href: `/${ROUTERS.USER.PRODUCTS}/shoes`,
      img: "/badmintonProduct/shoes.jpg",
      title: "Badminton Shoes",
    },
    {
      href: `/${ROUTERS.USER.PRODUCTS}/shirts`,
      img: "/badmintonProduct/shirt.jpg",
      title: "Badminton Shirts",
    },
    {
      href: `/${ROUTERS.USER.PRODUCTS}/bags`,
      img: "/badmintonProduct/balo.jpg",
      title: "Badminton Backpacks",
    },
  ];

  return (
    <section className="py-12 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-gray-900 uppercase tracking-wide">
                Badminton Products
            </h2>
            <div className="w-16 h-1 bg-blue-500 mx-auto mt-2 rounded-full"></div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {products.map((item, idx) => (
            <Link 
                key={idx} 
                to={item.href} 
                className="group block bg-white rounded-xl shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden"
            >
              <div className="aspect-square bg-gray-100 overflow-hidden relative">
                <img 
                    src={item.img} 
                    alt={item.title} 
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-black/5 group-hover:bg-black/0 transition-colors"></div>
              </div>
              <div className="p-4 text-center">
                <p className="font-semibold text-gray-800 group-hover:text-blue-600 transition-colors">
                    {item.title}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};

export default memo(BadmintonSection);
