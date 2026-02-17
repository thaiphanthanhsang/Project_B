import React from "react";
import { Globe, Flame } from "lucide-react";


const MissionVision = () => {
  return (
    <div>
        <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-gray-900 uppercase tracking-wide">
                Vision & Mission
            </h2>
            <div className="w-16 h-1 bg-blue-500 mx-auto mt-2 rounded-full"></div>
        </div>
        
        <div className="grid md:grid-cols-2 gap-6">
          {/* Vision Card */}
          <div className="bg-gradient-to-br from-blue-50 to-white rounded-xl p-6 border border-blue-100 flex flex-col items-center text-center">
            <div className="mb-4 bg-white p-3 rounded-full shadow-sm">
                <Globe className="w-8 h-8 text-blue-600" />
            </div>
            <h3 className="text-lg font-bold text-gray-900 mb-3">Our Vision</h3>
            <p className="text-gray-600 text-sm leading-relaxed">
              To become the <strong className="text-blue-600">leading sports retail chain</strong> in
              Vietnam, where customers can always find high-quality products and
              dedicated service.
            </p>
          </div>

          {/* Mission Card */}
          <div className="bg-gradient-to-br from-orange-50 to-white rounded-xl p-6 border border-orange-100 flex flex-col items-center text-center">
             <div className="mb-4 bg-white p-3 rounded-full shadow-sm">
                <Flame className="w-8 h-8 text-orange-500" />
            </div>
            <h3 className="text-lg font-bold text-gray-900 mb-3">Our Mission</h3>
            <p className="text-gray-600 text-sm leading-relaxed">
              To inspire the spirit of sports and improve community health by
              providing <em className="text-gray-800 not-italic font-semibold">reliable, authentic, and high-value</em> products.
            </p>
          </div>
        </div>
    </div>
  );
};

export default MissionVision;
