"use client";

import React, { useEffect, useState } from "react";
import {
  ChevronRight,
  Phone,
  MapPin,
  Package,
  Bike,
  Users,
  TrendingUp,
  ArrowUpRight,
  ChevronUp,
  ChevronDown,
} from "lucide-react";
import { useAuthStore, useRiderStore, useOrderStore } from "@/stores";

export default function DashboardPage() {
  const { authUser } = useAuthStore();
  const { orders, getAllOrders, isLoadingOrders } = useOrderStore();
  const { riders, getAllRiders, isLoadingRiders } = useRiderStore();

  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setIsLoading(true);
    try {
      await Promise.all([
        getAllOrders(),
        getAllRiders({ includePending: false }),
      ]);
    } catch (error) {
      console.error("Failed to load dashboard data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Calculate stats
  const totalOrders = orders.length;
  const deliveredOrders = orders.filter(
    (order) => order.status === "delivered",
  ).length;
  const confirmedOrders = orders.filter(
    (order) => order.status === "confirmed",
  );
  const totalRiders = riders.filter(
    (rider) =>
      !rider.orgMembership?.isSuspended &&
      rider.orgMembership?.isActive !== false,
  ).length;

  return (
    <div className="max-w-7xl mx-auto">
      {/* Title Section */}
      <section className="mb-8">
        <h2 className="text-2xl md:text-3xl text-gray-900 font-semibold text-center md:text-start">
          Dashboard
        </h2>
        <div className="h-1 w-12 hidden md:block bg-[#00A082] rounded-full mt-2 mb-3" />
        <p className="text-gray-500 text-sm text-center md:text-start mt-1">
          Hi, {authUser?.name}. Welcome back to{" "}
          <span className="text-[#FF7B7B] font-semibold">
            {authUser?.organizations?.[0]?.name}
          </span>{" "}
          Vendor Dashboard!
        </p>
      </section>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        <StatCard
          label="Total Orders"
          value={isLoading ? "..." : totalOrders}
          color="bg-gradient-to-br from-[#E6F4F1] to-[#D0EDE6]"
          icon={<Package className="text-[#00A082]" />}
          trend=""
        />
        <StatCard
          label="Completed Deliveries"
          value={isLoading ? "..." : deliveredOrders}
          color="bg-gradient-to-br from-[#EBFBF5] to-[#D1F5E6]"
          icon={<Package className="text-[#10B981]" />}
          trend={!isLoading && deliveredOrders > 0 ? `+${deliveredOrders}` : ""}
        />
        <StatCard
          label="Active Riders"
          value={isLoading ? "..." : totalRiders}
          color="bg-gradient-to-br from-[#FFF7ED] to-[#FFEDD5]"
          icon={<Bike className="text-[#F97316]" />}
          trend=""
        />
      </div>

      {/* Active Delivery Section */}
      <section>
        <div className="flex items-center mb-6">
          <div>
            <h3 className="text-xl font-semibold text-gray-900">
              Active Deliveries
            </h3>
            <p className="text-xs text-gray-500 mt-0.5">
              Keep track of ongoing deliveries
            </p>
          </div>
        </div>

        {/* Delivery Cards Container */}
        {isLoading ? (
          <div className="space-y-4">
            {[1, 2].map((i) => (
              <div
                key={i}
                className="bg-white p-6 rounded-2xl border border-gray-100 animate-pulse"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="space-y-2">
                    <div className="h-4 w-24 bg-gray-200 rounded" />
                    <div className="h-3 w-16 bg-gray-100 rounded" />
                  </div>
                  <div className="h-8 w-8 bg-gray-200 rounded-full" />
                </div>
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 bg-gray-200 rounded-full" />
                    <div className="space-y-2">
                      <div className="h-3 w-16 bg-gray-200 rounded" />
                      <div className="h-4 w-32 bg-gray-100 rounded" />
                    </div>
                  </div>
                  <div className="h-12 w-full bg-gray-100 rounded-xl" />
                </div>
              </div>
            ))}
          </div>
        ) : confirmedOrders.length === 0 ? (
          <div className="bg-white rounded-2xl border border-dashed border-gray-300 py-12 text-center">
            <Package className="mx-auto h-12 w-12 text-gray-300 mb-4" />
            <h3 className="text-lg font-medium text-gray-900">
              No active deliveries
            </h3>
            <p className="text-gray-500 max-w-xs mx-auto mt-1">
              All confirmed deliveries will appear here.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {confirmedOrders.slice(0, 2).map((order) => (
              <DeliveryCard
                key={order.id}
                id={order.orderNumber}
                customer={order.customer}
                rider={order.rider}
                items={1}
                location={order.customerLocationLabel || "Location not set"}
              />
            ))}
            {/* Show second card as collapsed if more than 1 */}
            {confirmedOrders.length > 1 &&
              confirmedOrders.slice(1).map((order, index) => (
                <div
                  key={order.id}
                  className="group bg-white p-4 rounded-2xl border border-gray-100 flex items-center justify-between hover:border-gray-200 hover:shadow-sm transition-all cursor-pointer"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gray-50 rounded-lg flex items-center justify-center group-hover:bg-gray-100 transition-colors">
                      <Package
                        className="text-gray-400 group-hover:text-gray-600 transition-colors"
                        size={20}
                      />
                    </div>
                    <div>
                      <span className="text-sm text-gray-800">
                        Order #{order.orderNumber}
                      </span>
                      <p className="text-[10px] text-gray-400 mt-0.5">
                        {order.customer?.name || "Customer"}
                      </p>
                    </div>
                  </div>
                  <ChevronRight
                    size={18}
                    className="text-gray-400 group-hover:text-gray-600 transition-colors"
                  />
                </div>
              ))}
          </div>
        )}
      </section>
    </div>
  );
}

// Sub-components for clarity
function StatCard({ label, value, color, icon, trend }: any) {
  return (
    <div className="group bg-white p-6 rounded-3xl shadow-sm border border-gray-100 hover:shadow-md hover:border-gray-200 transition-all duration-300 hover:-translate-y-1">
      <div className="flex items-center gap-5">
        <div
          className={`w-16 h-16 rounded-2xl flex items-center justify-center ${color} ring-1 ring-black/5 shadow-sm`}
        >
          {React.cloneElement(icon, { size: 28 })}
        </div>
        <div className="flex-1">
          <div className="flex items-end gap-2 mb-1">
            <h3 className="text-3xl text-gray-900">{value}</h3>
            {trend && (
              <div className="flex items-center gap-1 px-2 py-0.5 bg-green-50 rounded-full mb-1">
                <TrendingUp size={10} className="text-green-600" />
                <span className="text-[10px] text-green-600">{trend}</span>
              </div>
            )}
          </div>
          <p className="text-xs text-gray-500">{label}</p>
        </div>
      </div>
    </div>
  );
}

function DeliveryCard({ id, customer, rider, items, location }: any) {
  const [isCollapsed, setIsCollapsed] = useState(false);

  const toggleCollapse = () => {
    setIsCollapsed(!isCollapsed);
  };

  return (
    <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md hover:border-gray-200 transition-all duration-300">
      <div className="p-5 border-b border-gray-100 flex items-center justify-between bg-linear-to-r from-gray-50/50 to-white">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-linear-to-br from-gray-100 to-gray-50 rounded-xl text-gray-600 ring-1 ring-gray-200">
            <Package size={20} />
          </div>
          <div>
            <h4 className="text-sm text-gray-900">Order #{id}</h4>
            <p className="text-[10px] text-gray-500 mt-0.5">
              {items} Item{items !== 1 ? "s" : ""}
            </p>
          </div>
        </div>
        <button
          onClick={toggleCollapse}
          className="p-2 cursor-pointer hover:bg-gray-100 rounded-lg transition-colors"
        >
          {isCollapsed ? (
            <ChevronDown size={20} className="text-gray-400" />
          ) : (
            <ChevronUp size={20} className="text-gray-400" />
          )}
        </button>
      </div>

      {!isCollapsed && (
        <div className="p-6 space-y-6">
          <ContactRow
            label="Customer"
            name={customer?.name || "Customer"}
            phone={customer?.phoneNumber}
          />

          <ContactRow
            label="Assigned Rider"
            name={rider?.name || "Unassigned"}
            phone={rider?.phoneNumber}
          />

          <div className="flex gap-4 p-4 bg-linear-to-r from-gray-50 to-transparent rounded-2xl border border-gray-100">
            <div className="w-10 h-10 bg-linear-to-br from-[#E6F4F1] to-[#D0EDE6] rounded-full flex items-center justify-center shrink-0 ring-2 ring-[#00A082]/10">
              <MapPin size={18} className="text-[#00A082]" />
            </div>
            <div>
              <p className="text-gray-900 text-sm mb-1">Delivery Location</p>
              <p className="text-xs text-gray-600">{location}</p>
            </div>
          </div>

          <button className="group w-full py-4 bg-linear-to-r from-[#FF7B7B] to-[#ff6a6a] hover:from-[#ff6a6a] hover:to-[#ff5757] cursor-pointer text-white text-sm rounded-2xl transition-all shadow-lg shadow-red-100 hover:shadow-xl hover:shadow-red-200 active:scale-[0.98] flex items-center justify-center gap-2 relative overflow-hidden">
            <div className="absolute inset-0 bg-linear-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
            <span>Track Order</span>
            <ArrowUpRight
              size={16}
              className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform"
            />
          </button>
        </div>
      )}
    </div>
  );
}

function ContactRow({
  label,
  name,
  phone,
}: {
  label: string;
  name: string;
  phone?: string;
}) {
  return (
    <div className="flex items-center justify-between group">
      <div className="flex items-center gap-4">
        <div className="w-10 h-10 bg-linear-to-br from-[#FFEBEB] to-[#FFE0E0] rounded-full flex items-center justify-center ring-1 ring-red-100">
          <Users size={18} className="text-[#FF7B7B]" />
        </div>
        <div>
          <p className="text-[10px] text-gray-400 uppercase tracking-wider mb-0.5">
            {label}
          </p>
          <p className="text-gray-800 text-sm">{name}</p>
        </div>
      </div>
      {phone && (
        <a href={`tel:${phone}`}>
          <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
            <Phone
              size={18}
              className="text-gray-300 group-hover:text-[#00A082] cursor-pointer transition-colors"
            />
          </button>
        </a>
      )}
    </div>
  );
}
