import React from "react";
import { X, MapPin, AlertCircle } from "lucide-react";

interface LocationModalProps {
  isOpen: boolean;
  onClose: () => void;
  locations: Array<{ label: string }>;
  selectedLocation: string;
  onLocationSelect: (location: string) => void;
  onConfirm: () => void;
}

export function LocationModal({
  isOpen,
  onClose,
  locations,
  selectedLocation,
  onLocationSelect,
  onConfirm,
}: LocationModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-100 flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-gray-900/60 backdrop-blur-sm"
        onClick={onClose}
      />
      <div className="relative bg-white rounded-2xl w-full max-w-md shadow-2xl overflow-hidden">
        <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
          <h3 className="text-lg font-bold text-gray-900">
            Set Delivery Point
          </h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <X size={20} />
          </button>
        </div>
        <div className="p-6">
          <div className="flex items-center gap-3 p-3 bg-[#E6F4F1] rounded-xl mb-6">
            <div className="bg-white p-2 rounded-lg text-[#00A082]">
              <AlertCircle size={20} />
            </div>
            <p className="text-xs text-[#00A082] font-medium">
              Selecting a location will update the rider's destination
              instantly.
            </p>
          </div>

          <div className="space-y-3">
            {locations.map((loc, idx) => (
              <label
                key={idx}
                className={`flex items-center gap-4 p-4 rounded-xl border-2 cursor-pointer transition-all ${
                  selectedLocation === loc.label
                    ? "border-[#00A082] bg-[#E6F4F1]/50"
                    : "border-gray-100 hover:border-gray-200"
                }`}
              >
                <input
                  type="radio"
                  className="hidden"
                  name="loc"
                  checked={selectedLocation === loc.label}
                  onChange={() => onLocationSelect(loc.label)}
                />
                <div
                  className={`p-2 rounded-lg ${
                    selectedLocation === loc.label
                      ? "bg-[#00A082] text-white"
                      : "bg-gray-100 text-gray-500"
                  }`}
                >
                  <MapPin size={20} />
                </div>
                <span className="font-semibold text-gray-800 flex-1">
                  {loc.label}
                </span>
                {selectedLocation === loc.label && (
                  <div className="w-2 h-2 rounded-full bg-[#00A082] shadow-[0_0_0_4px_rgba(0,160,130,0.2)]" />
                )}
              </label>
            ))}
          </div>

          <div className="flex gap-3 mt-8">
            <button
              onClick={onClose}
              className="flex-1 px-4 py-3 text-gray-600 font-bold text-sm border border-gray-200 rounded-xl hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              onClick={onConfirm}
              disabled={!selectedLocation}
              className="flex-1 px-4 py-3 bg-[#E97474] text-white font-bold text-sm rounded-xl shadow-lg shadow-red-100 hover:opacity-90 disabled:bg-gray-300 disabled:shadow-none transition-all"
            >
              Set Destination
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
