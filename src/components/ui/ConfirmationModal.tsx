"use client";

import { AlertCircle, X, Loader2, Info } from "lucide-react";

interface ConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmText?: string;
  variant?: "danger" | "warning" | "info";
  isLoading?: boolean;
}

export function ConfirmationModal({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmText = "Confirm",
  variant = "warning",
  isLoading = false,
}: ConfirmationModalProps) {
  if (!isOpen) return null;

  const themes = {
    danger: {
      button: "bg-red-600 hover:bg-red-700 shadow-red-100",
      iconBg: "bg-red-50",
      iconColor: "text-red-500",
      icon: <AlertCircle size={32} />,
    },
    warning: {
      button: "bg-[#FF7B7B] hover:bg-[#ff6a6a] shadow-red-100",
      iconBg: "bg-orange-50",
      iconColor: "text-orange-500",
      icon: <AlertCircle size={32} />,
    },
    info: {
      button: "bg-blue-600 hover:bg-blue-700 shadow-blue-100",
      iconBg: "bg-blue-50",
      iconColor: "text-blue-500",
      icon: <Info size={32} />,
    },
  };

  const theme = themes[variant];

  return (
    <div className="fixed inset-0 z-100 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm animate-in fade-in duration-200"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative bg-white w-full max-w-md rounded-4xl p-8 shadow-2xl animate-in zoom-in-95 duration-200">
        <button
          onClick={onClose}
          className="absolute right-6 top-6 p-2 cursor-pointer hover:bg-gray-100 rounded-full transition-colors"
          disabled={isLoading}
        >
          <X size={20} className="text-gray-400" />
        </button>

        <div className="flex flex-col items-center text-center">
          <div
            className={`w-16 h-16 rounded-full flex items-center justify-center mb-6 ${theme.iconBg} ${theme.iconColor}`}
          >
            {theme.icon}
          </div>

          <h3 className="text-xl font-semibold text-[#2D3748] mb-2">{title}</h3>
          <p className="text-gray-500 text-sm leading-relaxed mb-8">
            {message}
          </p>

          <div className="flex flex-col sm:flex-row gap-3 w-full">
            <button
              onClick={onClose}
              disabled={isLoading}
              className="flex-1 px-6 cursor-pointer py-3.5 border border-gray-500 text-gray-500  rounded-xl text-sm hover:bg-gray-50 transition-all active:scale-95 disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              onClick={onConfirm}
              disabled={isLoading}
              className={`flex-1 flex cursor-pointer items-center justify-center gap-2 px-6 py-3.5 text-white text-sm rounded-xl transition-all shadow-lg active:scale-95 disabled:opacity-70 ${theme.button}`}
            >
              {isLoading && <Loader2 size={18} className="animate-spin" />}
              {confirmText}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
