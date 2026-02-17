import React from "react";
import { Package, AlertTriangle } from "lucide-react";

const LowStockTable = ({ data }) => {
  return (
    <div className="rounded-xl border border-slate-100 bg-white shadow-sm overflow-hidden">
      <div className="px-6 py-5 border-b border-slate-50 flex justify-between items-center bg-white">
        <div>
          <h4 className="text-lg font-bold text-slate-800">
            Low Stock Inventory
          </h4>
          <p className="text-xs text-slate-500 mt-1">
            Products with quantity lower than 5
          </p>
        </div>
        <span className="bg-red-50 text-red-600 text-xs font-bold px-3 py-1 rounded-full border border-red-100 flex items-center gap-1">
          <AlertTriangle size={12} /> {data.length} Alerts
        </span>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead className="bg-slate-50 text-xs uppercase text-slate-500 font-semibold tracking-wider">
            <tr>
              <th className="px-6 py-4">Product</th>
              <th className="px-6 py-4">Category</th>
              <th className="px-6 py-4 text-center">Price</th>
              <th className="px-6 py-4 text-center">Stock Level</th>
              <th className="px-6 py-4 text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {data.length === 0 ? (
              <tr>
                <td
                  colSpan="5"
                  className="p-8 text-center text-slate-400 italic"
                >
                  Inventory levels are healthy.
                </td>
              </tr>
            ) : (
              data.map((product) => (
                <tr
                  key={product.id}
                  className="hover:bg-slate-50/50 transition-colors"
                >
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-4">
                      <div className="h-10 w-10 flex-shrink-0 rounded-lg bg-slate-100 border border-slate-200 overflow-hidden">
                        {product.imageUrl ? (
                          <img
                            src={`http://localhost:5000${product.imageUrl}`}
                            alt=""
                            className="h-full w-full object-cover"
                          />
                        ) : (
                          <div className="h-full w-full flex items-center justify-center text-slate-400">
                            <Package size={18} />
                          </div>
                        )}
                      </div>
                      <div>
                        <p
                          className="text-sm font-semibold text-slate-800 max-w-[180px] truncate"
                          title={product.name}
                        >
                          {product.name}
                        </p>
                        <p className="text-xs text-slate-400">
                          SKU: {product.id.substring(0, 6)}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-slate-600 font-medium">
                    {product.category || "General"}
                  </td>
                  <td className="px-6 py-4 text-center text-sm font-semibold text-slate-700">
                    {new Intl.NumberFormat("vi-VN", {
                      style: "currency",
                      currency: "VND",
                    }).format(product.price)}
                  </td>
                  <td className="px-6 py-4 text-center">
                    {product.quantity === 0 ? (
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-slate-100 text-slate-500 border border-slate-200">
                        Out of Stock
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-red-50 text-red-600 border border-red-100 animate-pulse">
                        <span className="h-1.5 w-1.5 rounded-full bg-red-500"></span>
                        Critical: {product.quantity}
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button className="text-indigo-600 hover:text-indigo-800 text-sm font-bold hover:underline transition-all">
                      Restock
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default LowStockTable;
