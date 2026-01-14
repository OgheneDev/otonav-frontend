"use client";

import React, { useState } from "react";
import {
  Search,
  ChevronDown,
  ChevronUp,
  Phone,
  MapPin,
  ChevronLeft,
  ChevronRight,
  Calendar,
} from "lucide-react";

const tabs = [
  "Pending",
  "Confirmed",
  "Processing",
  "Picked",
  "Shipped",
  "Delivered",
  "Cancelled",
];

export default function OrderManagementPage() {
  const [activeTab, setActiveTab] = useState("Pending");
  const [expandedRow, setExpandedRow] = useState<string | null>("#6548-2");

  return (
    <div className="max-w-7xl mx-auto px-4 py-6 md:px-0">
      {/* Title Section */}
      <section className="mb-6">
        <h2 className="text-2xl font-bold text-[#2D3748] text-center md:text-start">
          Order Management
        </h2>
        <p className="text-gray-400 text-sm text-center md:text-start">
          Keep Track on Orders sent out.
        </p>
      </section>

      {/* Filters Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <button className="flex items-center justify-center gap-2 px-4 py-3 md:py-2 bg-white border border-gray-100 rounded-xl text-gray-500 text-sm shadow-sm w-full md:w-fit">
          Filter by date range <ChevronDown size={16} />
        </button>

        <div className="relative w-full md:w-64">
          <input
            type="text"
            placeholder="Search by order id"
            className="w-full pl-4 pr-10 py-3 md:py-2 bg-white border border-gray-50 rounded-xl text-sm focus:outline-none shadow-sm"
          />
          <Search
            size={18}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-300"
          />
        </div>
      </div>

      {/* Tabs - Scrollable on Mobile */}
      <div className="flex items-center gap-6 border-b border-gray-100 mb-6 overflow-x-auto no-scrollbar scroll-smooth">
        {tabs.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`pb-3 text-sm font-medium whitespace-nowrap transition-all relative ${
              activeTab === tab
                ? "text-[#3B82F6]"
                : "text-gray-400 hover:text-gray-600"
            }`}
          >
            {tab}
            {activeTab === tab && (
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#3B82F6]" />
            )}
          </button>
        ))}
      </div>

      {/* Table Header - Hidden on Mobile */}
      <div className="hidden md:block bg-white rounded-t-2xl border-x border-t border-gray-50">
        <div className="grid grid-cols-5 p-4 text-[10px] font-black uppercase tracking-wider text-gray-400">
          <span>Order ID</span>
          <span>Created</span>
          <span>Customer</span>
          <span>Rider</span>
          <span>Status</span>
        </div>
      </div>

      {/* Table Rows / Cards Container */}
      <div className="space-y-4 md:space-y-0 md:border-x md:border-b border-gray-50 md:rounded-b-2xl md:bg-white overflow-hidden mb-8">
        <OrderRow
          id="#6547"
          time="2 min ago"
          customer="Joseph Wheeler"
          rider="Aba Kyari"
          status="Pending"
          onToggle={() =>
            setExpandedRow(expandedRow === "#6547" ? null : "#6547")
          }
          isExpanded={expandedRow === "#6547"}
        />
        <OrderRow
          id="#6548"
          time="5 min ago"
          customer="Otonye Ita"
          rider="Abdullahi Okoli"
          status="Pending"
          isExpanded={expandedRow === "#6548-2"}
          onToggle={() =>
            setExpandedRow(expandedRow === "#6548-2" ? null : "#6548-2")
          }
        />
      </div>

      {/* Pagination - Stacked on Mobile */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-gray-400">
        <div className="flex items-center gap-2">
          Showing
          <select className="bg-white border border-gray-200 rounded-lg px-2 py-1 text-gray-700 outline-none">
            <option>10</option>
          </select>
          of 50
        </div>
        <div className="flex items-center gap-1">
          <button className="p-2 bg-gray-100 rounded-lg">
            <ChevronLeft size={16} />
          </button>
          {[1, 2, 3, 4, 5].map((page) => (
            <button
              key={page}
              className={`w-10 h-10 md:w-8 md:h-8 rounded-lg font-bold transition-colors ${
                page === 1 ? "bg-[#3B82F6] text-white" : "hover:bg-gray-100"
              }`}
            >
              {page}
            </button>
          ))}
          <button className="p-2 bg-gray-100 rounded-lg">
            <ChevronRight size={16} />
          </button>
        </div>
      </div>
    </div>
  );
}

function OrderRow({
  id,
  time,
  customer,
  rider,
  status,
  isExpanded,
  onToggle,
}: any) {
  return (
    <div className="border border-gray-100 md:border-0 md:border-t bg-white rounded-2xl md:rounded-none overflow-hidden shadow-sm md:shadow-none">
      {/* Mobile-Responsive Row */}
      <div
        className="flex flex-col md:grid md:grid-cols-5 p-4 md:items-center text-sm cursor-pointer md:cursor-default"
        onClick={() => {
          if (window.innerWidth < 768) onToggle();
        }}
      >
        <div className="flex justify-between items-center mb-2 md:mb-0">
          <span className="font-bold text-gray-800">{id}</span>
          <span className="md:hidden text-[10px] text-gray-400 uppercase font-black">
            {time}
          </span>
        </div>

        <span className="hidden md:block text-gray-500 font-medium">
          {time}
        </span>

        <div className="flex flex-col md:block mb-3 md:mb-0">
          <span className="md:hidden text-[10px] text-gray-400 uppercase font-bold">
            Customer
          </span>
          <span className="text-gray-500 font-medium">{customer}</span>
        </div>

        <div className="flex flex-col md:block mb-4 md:mb-0">
          <span className="md:hidden text-[10px] text-gray-400 uppercase font-bold">
            Rider
          </span>
          <span className="text-gray-500 font-medium">{rider}</span>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 px-3 py-1.5 bg-[#FFFBEB] text-[#F59E0B] rounded-lg text-xs font-bold border border-[#FEF3C7]">
            {status} <ChevronDown size={14} />
          </div>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onToggle();
            }}
            className="text-gray-300"
          >
            {isExpanded ? (
              <ChevronUp
                size={24}
                className="bg-gray-400 text-white rounded-full p-1"
              />
            ) : (
              <ChevronDown
                size={24}
                className="border border-gray-300 rounded-full p-1"
              />
            )}
          </button>
        </div>
      </div>

      {/* Expanded Details Section */}
      {isExpanded && (
        <div className="p-6 bg-[#F7F9F9] border-t border-gray-50 animate-in slide-in-from-top-2 duration-200">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-[#FF7B7B] rounded-full flex items-center justify-center text-white">
                    <Users size={20} />
                  </div>
                  <div>
                    <p className="text-[10px] text-gray-400 uppercase font-black">
                      Assigned Rider
                    </p>
                    <p className="font-bold text-gray-800">{rider}</p>
                  </div>
                </div>
                <Phone size={18} className="text-gray-400 cursor-pointer" />
              </div>

              <div className="flex gap-4">
                <div className="w-10 h-10 bg-[#00A082] rounded-full flex items-center justify-center text-white shrink-0">
                  <MapPin size={20} />
                </div>
                <div>
                  <p className="font-bold text-gray-800 text-sm">
                    Delivery Location
                  </p>
                  <p className="text-xs text-gray-500">
                    24B Gold City Estate, Lugbe
                  </p>
                  <p className="text-[10px] text-[#00A082] font-semibold">
                    Near Arcane Lane
                  </p>
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-[#3B82F6] rounded-full flex items-center justify-center text-white">
                    <Users size={20} />
                  </div>
                  <div>
                    <p className="text-[10px] text-gray-400 uppercase font-black">
                      Customer
                    </p>
                    <p className="font-bold text-gray-800">{customer}</p>
                  </div>
                </div>
                <Phone size={18} className="text-gray-400 cursor-pointer" />
              </div>

              <button className="w-full py-4 bg-[#FF7B7B] text-white font-bold rounded-2xl shadow-lg shadow-red-100 active:scale-95 transition-transform">
                Track Order
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// Re-using the Users component provided
function Users({ size, className }: { size?: number; className?: string }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
      <circle cx="12" cy="7" r="4" />
    </svg>
  );
}
