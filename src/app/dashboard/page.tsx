"use client";

import React from "react";

import {
  ChevronLeft,
  ChevronRight,
  Phone,
  MapPin,
  Package,
  Bike,
  Users,
} from "lucide-react";
import { useAuthStore } from "@/stores";

export default function DashboardPage() {
  const { authUser } = useAuthStore();

  return (
    <div className="max-w-7xl mx-auto">
      {/* Title Section */}
      <section className="mb-8">
        <h2 className="text-2xl font-bold text-gray-800 text-center md:text-start">
          Dashboard
        </h2>
        <p className="text-gray-500 text-sm text-center md:text-start">
          Hi, {authUser?.name}. Welcome back to OtoNav Vendor Dashboard!
        </p>
      </section>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        <StatCard
          label="Total Orders"
          value={75}
          color="bg-[#E6F4F1]"
          icon={<Package className="text-[#00A082]" />}
        />
        <StatCard
          label="Completed Deliveries"
          value={45}
          color="bg-[#EBFBF5]"
          icon={<Package className="text-[#10B981]" />}
        />
        <StatCard
          label="Registered Riders"
          value={22}
          color="bg-[#FFF7ED]"
          icon={<Bike className="text-[#F97316]" />}
        />
      </div>

      {/* Active Delivery Section */}
      <section>
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-xl font-bold text-gray-800">Active Delivery</h3>
            <p className="text-xs text-gray-400 font-medium">
              Keep Track of Active Deliveries
            </p>
          </div>
          <div className="flex gap-2">
            <button className="p-2 bg-white rounded-xl shadow-sm hover:bg-gray-50 border border-gray-100">
              <ChevronLeft size={20} className="text-gray-400" />
            </button>
            <button className="p-2 bg-white rounded-xl shadow-sm hover:bg-gray-50 border border-gray-100">
              <ChevronRight size={20} className="text-[#00A082]" />
            </button>
          </div>
        </div>

        {/* Delivery Cards Container */}
        <div className="space-y-4">
          <DeliveryCard id="ABC1234" items={4} />
          {/* Collapsed second card as seen in the image */}
          <div className="bg-white p-4 rounded-2xl border border-gray-100 flex items-center justify-between opacity-60">
            <div className="flex items-center gap-3">
              <Package className="text-gray-400" size={20} />
              <span className="font-bold text-sm">Order #ABC1234</span>
            </div>
            <ChevronRight size={18} className="text-gray-400" />
          </div>
        </div>
      </section>
    </div>
  );
}

// Sub-components for clarity
function StatCard({ label, value, color, icon }: any) {
  return (
    <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-50 flex items-center gap-5">
      <div
        className={`w-16 h-16 rounded-2xl flex items-center justify-center ${color}`}
      >
        {React.cloneElement(icon, { size: 28 })}
      </div>
      <div>
        <h3 className="text-3xl font-bold text-gray-800">{value}</h3>
        <p className="text-xs text-gray-400 font-medium mb-1">{label}</p>
      </div>
    </div>
  );
}

function DeliveryCard({ id, items }: { id: string; items: number }) {
  return (
    <div className="bg-white rounded-4xl shadow-sm border border-gray-100 overflow-hidden">
      <div className="p-5 border-b border-gray-50 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-gray-100 rounded-lg text-gray-600">
            <Package size={20} />
          </div>
          <div>
            <h4 className="font-bold text-sm text-gray-800">Order #{id}</h4>
            <p className="text-[10px] text-gray-400 font-bold">{items} Items</p>
          </div>
        </div>
        <ChevronRight size={20} className="text-gray-400 rotate-90" />
      </div>

      <div className="p-6 space-y-6">
        <ContactRow label="Customer" name="Otonye-Esther Ita" />
        <ContactRow label="Assigned Rider" name="Abdullahi Okoli" />

        <div className="flex gap-4">
          <div className="w-10 h-10 bg-[#E6F4F1] rounded-full flex items-center justify-center shrink-0">
            <MapPin size={18} className="text-[#00A082]" />
          </div>
          <div>
            <p className="font-bold text-gray-800 text-sm">Delivery Location</p>
            <p className="text-xs text-gray-500">24B Gold City Estate, Lugbe</p>
            <p className="text-[10px] text-[#00A082] font-semibold mt-0.5">
              Near Arcane Lane
            </p>
          </div>
        </div>

        <button className="w-full py-4 bg-[#FF7B7B] hover:bg-[#ff6a6a] cursor-pointer text-white text-sm rounded-2xl transition-all shadow-lg shadow-red-100 active:scale-[0.98]">
          Track Order
        </button>
      </div>
    </div>
  );
}

function ContactRow({ label, name }: { label: string; name: string }) {
  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-4">
        <div className="w-10 h-10 bg-[#FFEBEB] rounded-full flex items-center justify-center">
          <Users size={18} className="text-[#FF7B7B]" />
        </div>
        <div>
          <p className="text-[10px] text-gray-400 uppercase font-black tracking-tighter">
            {label}
          </p>
          <p className="font-bold text-gray-800 text-sm">{name}</p>
        </div>
      </div>
      <Phone
        size={18}
        className="text-gray-300 hover:text-gray-500 cursor-pointer transition-colors"
      />
    </div>
  );
}
