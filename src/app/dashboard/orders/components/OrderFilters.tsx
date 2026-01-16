import React from "react";
import { Search } from "lucide-react";

interface OrderFiltersProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  activeFilter: "All" | "Pending" | "Confirmed" | "Delivered" | "Cancelled";
  onFilterChange: (
    filter: "All" | "Pending" | "Confirmed" | "Delivered" | "Cancelled"
  ) => void;
}

export function OrderFilters({
  searchQuery,
  onSearchChange,
  activeFilter,
  onFilterChange,
}: OrderFiltersProps) {
  const filterOptions = [
    "All",
    "Pending",
    "Confirmed",
    "Delivered",
    "Cancelled",
  ] as const;

  return (
    <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 mb-6 flex flex-col md:flex-row gap-4 items-center">
      <div className="relative flex-1 w-full">
        <Search
          className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
          size={18}
        />
        <input
          type="text"
          placeholder="Search by ID, customer, or rider..."
          className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:ring-1 focus:ring-[#00A082] outline-none transition-all"
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
        />
      </div>
      <div className="flex items-center gap-2 w-full md:w-auto">
        <div className="flex gap-1 overflow-x-auto pb-1 md:pb-0 no-scrollbar">
          {filterOptions.map((option) => (
            <button
              key={option}
              onClick={() => onFilterChange(option)}
              className={`px-4 py-2 rounded-lg cursor-pointer text-xs font-semibold whitespace-nowrap transition-all ${
                activeFilter === option
                  ? "bg-[#E6F4F1] text-[#E97474] border border-[#E97474]/20 shadow-sm"
                  : "bg-white text-gray-600 border border-gray-200 hover:bg-gray-50"
              }`}
            >
              {option}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
