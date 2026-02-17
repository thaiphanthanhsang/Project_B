import React from "react";
import { motion as Motion, AnimatePresence } from "framer-motion";
import { X, AlertTriangle } from "lucide-react";

const ConfirmationModal = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmText = "Delete",
  cancelText = "Cancel",
  isDestructive = true,
}) => {
  if (!isOpen) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[99999] flex items-center justify-center p-4">
          {/* Backdrop */}
          <Motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm transition-opacity"
          />

          {/* Modal */}
          <Motion.div
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 10 }}
            transition={{ type: "spring", duration: 0.3 }}
            className="relative w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all"
          >
            <div className="flex items-start gap-4">
              {/* Icon */}
              <div
                className={`flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full ${
                  isDestructive ? "bg-red-100" : "bg-indigo-100"
                }`}
              >
                {isDestructive ? (
                  <AlertTriangle
                    className={`h-6 w-6 ${
                      isDestructive ? "text-red-600" : "text-indigo-600"
                    }`}
                  />
                ) : (
                  <AlertTriangle className="h-6 w-6 text-indigo-600" />
                )}
              </div>

              {/* Content */}
              <div className="flex-1 pt-1">
                <h3 className="text-lg font-bold leading-6 text-gray-900">
                  {title}
                </h3>
                <div className="mt-2">
                  <p className="text-sm text-gray-500">{message}</p>
                </div>
              </div>

              {/* Close Button */}
              <button
                onClick={onClose}
                className="absolute top-4 right-4 text-gray-400 hover:text-gray-500 focus:outline-none"
              >
                <X size={20} />
              </button>
            </div>

            {/* Actions */}
            <div className="mt-8 flex justify-end gap-3">
              <button
                type="button"
                className="inline-flex justify-center rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition-colors"
                onClick={onClose}
              >
                {cancelText}
              </button>
              <button
                type="button"
                className={`inline-flex justify-center rounded-lg border border-transparent px-4 py-2 text-sm font-semibold text-white shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 transition-colors ${
                  isDestructive
                    ? "bg-red-600 hover:bg-red-700 focus:ring-red-500"
                    : "bg-indigo-600 hover:bg-indigo-700 focus:ring-indigo-500"
                }`}
                onClick={onConfirm}
              >
                {confirmText}
              </button>
            </div>
          </Motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default ConfirmationModal;
