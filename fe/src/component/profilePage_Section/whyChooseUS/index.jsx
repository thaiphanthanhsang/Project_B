import React from "react";


import { ShieldCheck, Truck, HeartHandshake, Dumbbell } from "lucide-react";

const reasons = [
  {
    icon: <ShieldCheck className="w-12 h-12 text-blue-600" />,
    title: "100% Authentic",
    desc: "All products are directly imported from trusted distributors.",
  },
  {
    icon: <Truck className="w-12 h-12 text-blue-600" />,
    title: "Fast Delivery",
    desc: "Nationwide shipping system ensures speed and safety.",
  },
  {
    icon: <HeartHandshake className="w-12 h-12 text-blue-600" />,
    title: "Dedicated Service",
    desc: "Our knowledgeable staff are always ready to assist customers.",
  },
  {
    icon: <Dumbbell className="w-12 h-12 text-blue-600" />,
    title: "Wide Product Range",
    desc: "We offer a full selection of equipment for tennis, gym, football, badminton, and more.",
  },
];


const WhyChooseUs = () => {
  return (
    <div>
        <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-gray-900 uppercase tracking-wide">
                Why Choose Us?
            </h2>
            <div className="w-16 h-1 bg-blue-500 mx-auto mt-2 rounded-full"></div>
        </div>

        <div className="grid sm:grid-cols-2 gap-4">
          {reasons.map((item, index) => (
            <div 
                key={index} 
                className="bg-gray-50 rounded-xl p-6 text-center hover:bg-white hover:shadow-md transition-all duration-300 border border-gray-100 group"
            >
              <div className="flex justify-center mb-3 transform group-hover:scale-110 transition-transform duration-300">{item.icon}</div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">{item.title}</h3>
              <p className="text-sm text-gray-600 leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>
    </div>
  );
};

export default WhyChooseUs;
