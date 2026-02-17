import React from "react";
import { motion as Motion, AnimatePresence } from "framer-motion";
import { X, Search, TrendingUp, Filter } from "lucide-react";

/**
 * SearchAnalyticsModal
 * Displays a detailed list of search terms and their frequency.
 *
 * @param {boolean} isOpen - Control modal visibility
 * @param {function} onClose - Function to close modal
 * @param {Array} data - Array of search data objects { keyword, count }
 */
const SearchAnalyticsModal = ({ isOpen, onClose, data = [] }) => {
  if (!isOpen) return null;

  // Calculate total searches for percentage bars
  const totalSearches = data.reduce((acc, item) => acc + item.count, 0);
  const maxCount = Math.max(...data.map((item) => item.count), 1);

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[99999] flex items-center justify-center p-4 sm:p-6">
          {/* Backdrop */}
          <Motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm transition-opacity"
          />

          {/* Modal Container */}
          <Motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ type: "spring", duration: 0.4, bounce: 0.3 }}
            className="glass-card relative w-full max-w-4xl max-h-[85vh] flex flex-col ring-1 ring-white/60 bg-white/90"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-5 border-b border-slate-100 bg-white/50 z-10">
              <div className="flex items-center gap-3">
                <div className="p-2.5 bg-indigo-50 text-indigo-500 rounded-xl border border-indigo-100">
                  <Search size={22} strokeWidth={2.5} />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-slate-800 tracking-tight">
                    Search Analytics Report
                  </h2>
                  <p className="text-sm text-slate-500 font-medium">
                    Total Volume: {totalSearches.toLocaleString()} searches
                  </p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-full transition-all"
              >
                <X size={24} />
              </button>
            </div>

            {/* Content - Scrollable */}
            <div className="flex-1 overflow-y-auto p-6 bg-slate-50/50">
              {data.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-64 text-center">
                  <div className="h-16 w-16 bg-white rounded-full flex items-center justify-center mb-4 text-slate-300 shadow-sm border border-slate-100">
                    <Search size={32} />
                  </div>
                  <h3 className="text-lg font-semibold text-slate-700">
                    No search data available
                  </h3>
                  <p className="text-slate-400">
                    Search terms will appear here once users start searching.
                  </p>
                </div>
              ) : (
                <div className="bg-white/80 rounded-xl shadow-sm border border-slate-100 overflow-hidden">
                  <table className="w-full text-left text-sm">
                    <thead className="bg-slate-50 border-b border-slate-100 text-slate-500 font-bold uppercase tracking-wider text-xs">
                      <tr>
                        <th className="px-6 py-4 w-16 text-center">Rank</th>
                        <th className="px-6 py-4">Keyword</th>
                        <th className="px-6 py-4 w-32 text-right">Volume</th>
                        <th className="px-6 py-4 w-48">Impact</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-50">
                      {data.map((item, index) => {
                        const percentage = Math.round(
                          (item.count / totalSearches) * 100,
                        );
                        const relativeWidth = (item.count / maxCount) * 100;

                        return (
                          <tr
                            key={index}
                            className="hover:bg-indigo-50/40 transition-colors"
                          >
                            <td className="px-6 py-4 text-center text-slate-400 font-medium">
                              #{index + 1}
                            </td>
                            <td className="px-6 py-4 font-semibold text-slate-700">
                              {item.keyword}
                              {index < 3 && (
                                <span className="ml-2 inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold bg-amber-50 text-amber-600 border border-amber-100">
                                  Top {index + 1}
                                </span>
                              )}
                            </td>
                            <td className="px-6 py-4 text-right font-bold text-indigo-600">
                              {item.count.toLocaleString()}
                            </td>
                            <td className="px-6 py-4 align-middle">
                              <div className="w-full flex items-center gap-3">
                                <div className="flex-1 h-2 bg-slate-100 rounded-full overflow-hidden">
                                  <div
                                    className="h-full bg-indigo-500 rounded-full shadow-sm"
                                    style={{ width: `${relativeWidth}%` }}
                                  ></div>
                                </div>
                                <span className="text-xs font-semibold text-slate-500 w-8 text-right">
                                  {percentage}%
                                </span>
                              </div>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="px-6 py-4 bg-white/50 border-t border-slate-100 flex justify-end">
              <button onClick={onClose} className="btn-ethereal px-5 py-2.5">
                Close Report
              </button>
            </div>
          </Motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default SearchAnalyticsModal;
