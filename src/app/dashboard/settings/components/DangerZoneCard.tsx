import React from "react";
import { LogOut, AlertTriangle, Shield } from "lucide-react";

interface DangerZoneCardProps {
  onLogoutClick: () => void;
  isLoggingOut: boolean;
}

export function DangerZoneCard({
  onLogoutClick,
  isLoggingOut,
}: DangerZoneCardProps) {
  return (
    <div className="bg-white rounded-3xl shadow-sm border border-red-100 overflow-hidden hover:border-red-200 hover:shadow-md transition-all duration-300">
      <div className="p-4 md:p-6">
        {/* Header */}
        <div className="flex items-center gap-4 mb-6">
          <div className="w-12 h-12 bg-linear-to-br from-[#FFEBEB] to-[#FFE0E0] rounded-2xl flex items-center justify-center shrink-0 ring-2 ring-red-100 shadow-sm">
            <AlertTriangle className="text-[#FF7B7B]" size={24} />
          </div>
          <div>
            <h3 className="text-gray-900 text-lg">Danger Zone</h3>
            <p className="text-xs md:text-sm text-gray-500 mt-0.5">
              Handle with caution
            </p>
          </div>
        </div>

        {/* Warning Banner */}
        <div className="mb-6 p-4 bg-linear-to-r from-red-50 to-orange-50 border border-red-100 rounded-xl">
          <div className="flex gap-3">
            <Shield className="text-red-600 shrink-0 mt-0.5" size={18} />
            <div className="space-y-1">
              <p className="text-sm text-red-900">Security Notice</p>
              <p className="text-xs text-red-700 leading-relaxed">
                Logging out will end your current session. You'll need to sign
                in again to access your account.
              </p>
            </div>
          </div>
        </div>

        {/* Logout Button */}
        <button
          onClick={onLogoutClick}
          disabled={isLoggingOut}
          className="group w-full py-4 bg-linear-to-r from-[#FF7B7B] to-[#ff6a6a] hover:from-[#ff6a6a] hover:to-[#ff5757] text-sm text-white cursor-pointer rounded-2xl transition-all shadow-lg shadow-red-100 hover:shadow-xl hover:shadow-red-200 active:scale-[0.98] flex items-center justify-center gap-3 disabled:opacity-70 disabled:cursor-not-allowed disabled:hover:shadow-lg relative overflow-hidden"
        >
          {/* Animated gradient overlay */}
          <div className="absolute inset-0 bg-linear-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>

          {isLoggingOut ? (
            <>
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              <span>Logging out...</span>
            </>
          ) : (
            <>
              <LogOut size={20} />
              <span className="tracking-wide">LOGOUT FROM PANEL</span>
            </>
          )}
        </button>

        <p className="text-[10px] text-gray-400 mt-4 text-center italic">
          Your data will remain secure and accessible after re-authentication.
        </p>
      </div>
    </div>
  );
}
