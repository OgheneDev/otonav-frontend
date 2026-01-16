"use client";

import React, { useState, useEffect } from "react";
import {
  Search,
  ChevronDown,
  ChevronUp,
  Phone,
  MapPin,
  ChevronLeft,
  ChevronRight,
  Filter,
  Package,
  Clock,
  ExternalLink,
  User,
  Bike,
  AlertCircle,
  X,
  Trash2,
} from "lucide-react";
import { useOrderStore, useToastStore } from "@/stores";
import type { Order } from "@/types/order";
import { ConfirmationModal } from "@/components/ui/ConfirmationModal";

// Status mapping for frontend display
const statusDisplayMap = {
  pending: {
    label: "Pending",
    color: "bg-amber-50 text-amber-700 border-amber-200",
    canCancel: true,
  },
  rider_accepted: {
    label: "Rider Accepted",
    color: "bg-[#E6F4F1] text-[#00A082] border-[#00A082]/20",
    canCancel: true,
  },
  customer_location_set: {
    label: "Location Set",
    color: "bg-indigo-50 text-indigo-700 border-indigo-200",
    canCancel: true,
  },
  confirmed: {
    label: "Confirmed",
    color: "bg-cyan-50 text-cyan-700 border-cyan-200",
    canCancel: true,
  },
  delivered: {
    label: "Delivered",
    color: "bg-emerald-50 text-emerald-700 border-emerald-200",
    canCancel: false,
  },
  cancelled: {
    label: "Cancelled",
    color: "bg-rose-50 text-rose-700 border-rose-200",
    canCancel: false,
  },
} as const;

const filterOptions = [
  "All",
  "Pending",
  "Confirmed",
  "Delivered",
  "Cancelled",
] as const;

export default function OrderManagementPage() {
  const { showToast } = useToastStore();
  const {
    orders,
    getAllOrders,
    isLoadingOrders,
    ownerSetCustomerLocation,
    getCustomerLocationLabels,
    cancelOrder,
  } = useOrderStore();

  const [activeFilter, setActiveFilter] =
    useState<(typeof filterOptions)[number]>("All");
  const [expandedRow, setExpandedRow] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [showLocationModal, setShowLocationModal] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [customerLocations, setCustomerLocations] = useState<
    Array<{ label: string }>
  >([]);
  const [selectedLocation, setSelectedLocation] = useState("");
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const [showCancelModal, setShowCancelModal] = useState(false);
  const [orderToCancel, setOrderToCancel] = useState<Order | null>(null);

  useEffect(() => {
    getAllOrders();
  }, [getAllOrders]);

  const filteredOrders = orders.filter((order) => {
    const displayStatus = getDisplayStatus(order.status);
    const matchesFilter =
      activeFilter === "All" || displayStatus === activeFilter;
    const searchLower = searchQuery.toLowerCase();
    const matchesSearch =
      searchQuery === "" ||
      order.orderNumber.toLowerCase().includes(searchLower) ||
      order.customer?.name?.toLowerCase().includes(searchLower) ||
      order.rider?.name?.toLowerCase().includes(searchLower) ||
      order.packageDescription.toLowerCase().includes(searchLower);

    return matchesFilter && matchesSearch;
  });

  const handleSetLocation = async (order: Order) => {
    setSelectedOrder(order);
    setSelectedLocation("");
    try {
      const locations = await getCustomerLocationLabels(order.id);
      setCustomerLocations(locations);
      setShowLocationModal(true);
    } catch (error: any) {
      showToast(error.message || "Failed to load locations", "error");
    }
  };

  const handleConfirmLocation = async () => {
    if (!selectedOrder || !selectedLocation) return;
    try {
      await ownerSetCustomerLocation(selectedOrder.id, selectedLocation);
      showToast("Location set successfully", "success");
      setShowLocationModal(false);
      getAllOrders();
    } catch (error: any) {
      showToast(error.message || "Failed to set location", "error");
    }
  };

  const handleCancelOrder = (order: Order) => {
    setOrderToCancel(order);
    setShowCancelModal(true);
  };

  const executeCancelOrder = async () => {
    if (!orderToCancel) return;

    try {
      setActionLoading(orderToCancel.id);
      await cancelOrder(orderToCancel.id);

      setSuccess(`Order #${orderToCancel.orderNumber} cancelled successfully`);
      setTimeout(() => setSuccess(null), 3000);

      getAllOrders(); // Refresh orders list
    } catch (err: any) {
      setError(err.message || "Failed to cancel order");
    } finally {
      setActionLoading(null);
      setOrderToCancel(null);
      setShowCancelModal(false);
    }
  };

  function getDisplayStatus(status: string): string {
    if (status === "rider_accepted" || status === "customer_location_set")
      return "Pending";
    return status.charAt(0).toUpperCase() + status.slice(1);
  }

  const formatTimeAgo = (dateString: string | null) => {
    if (!dateString) return "Just now";
    const date = new Date(dateString);
    const diffMins = Math.floor(
      (new Date().getTime() - date.getTime()) / 60000
    );
    if (diffMins < 1) return "Just now";
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffMins < 1440) return `${Math.floor(diffMins / 60)}h ago`;
    return `${Math.floor(diffMins / 1440)}d ago`;
  };

  return (
    <div className="min-h-screen bg-[#F9FAFB] pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        {/* Success Alert */}
        {success && (
          <div className="mb-6 bg-green-50 border border-green-100 rounded-2xl p-4 flex items-center gap-3 animate-in fade-in slide-in-from-top-2">
            <AlertCircle className="text-green-500 shrink-0" size={20} />
            <p className="text-green-800 text-sm font-medium flex-1">
              {success}
            </p>
            <button
              onClick={() => setSuccess(null)}
              className="p-1 hover:bg-green-100 rounded-lg"
            >
              <X className="w-4 h-4 text-green-500" />
            </button>
          </div>
        )}

        {/* Error Alert */}
        {error && (
          <div className="mb-6 bg-red-50 border border-red-100 rounded-2xl p-4 flex items-center gap-3 animate-in fade-in slide-in-from-top-2">
            <AlertCircle className="text-red-500 shrink-0" size={20} />
            <p className="text-red-800 text-sm font-medium flex-1">{error}</p>
            <button
              onClick={() => setError(null)}
              className="p-1 hover:bg-red-100 rounded-lg"
            >
              <X className="w-4 h-4 text-red-500" />
            </button>
          </div>
        )}

        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 tracking-tight">
              Order Management
            </h1>
            <div className="h-1 w-12 bg-[#00A082] rounded-full mt-2" />
            <p className="text-gray-500 text-sm mt-2">
              Manage and track all logistics operations in real-time.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <div className="bg-white px-4 py-2 rounded-xl border border-gray-200 shadow-sm">
              <p className="text-[10px] uppercase font-bold text-gray-400 leading-none mb-1">
                Total Orders
              </p>
              <p className="text-xl font-bold text-[#E97474] leading-none">
                {orders.length}
              </p>
            </div>
          </div>
        </div>

        {/* Search and Filters */}
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
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <div className="flex items-center gap-2 w-full md:w-auto">
            <div className="flex gap-1 overflow-x-auto pb-1 md:pb-0 no-scrollbar">
              {filterOptions.map((option) => (
                <button
                  key={option}
                  onClick={() => setActiveFilter(option)}
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

        {/* Content Area */}
        {isLoadingOrders ? (
          <div className="grid grid-cols-1 gap-4">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="h-24 w-full bg-white rounded-xl border border-gray-100 animate-pulse"
              />
            ))}
          </div>
        ) : filteredOrders.length === 0 ? (
          <div className="bg-white rounded-2xl border border-dashed border-gray-300 py-20 text-center">
            <Package className="mx-auto h-12 w-12 text-gray-300 mb-4" />
            <h3 className="text-lg font-medium text-gray-900">
              No orders found
            </h3>
            <p className="text-gray-500 max-w-xs mx-auto mt-1">
              We couldn't find any orders matching your current filters or
              search query.
            </p>
          </div>
        ) : (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="hidden md:grid grid-cols-7 gap-4 p-4 bg-gray-50 border-b border-gray-200 text-[11px] font-bold text-gray-500 uppercase tracking-wider">
              <div>Customer</div>
              <div>Rider</div>
              <div>Package</div>
              <div>Timeline</div>
              <div>Status</div>
              <div className="text-right">Actions</div>
            </div>
            <div className="divide-y divide-gray-100">
              {filteredOrders.map((order) => (
                <OrderRow
                  key={order.id}
                  order={order}
                  isExpanded={expandedRow === order.id}
                  onToggle={() =>
                    setExpandedRow(expandedRow === order.id ? null : order.id)
                  }
                  onSetLocation={() => handleSetLocation(order)}
                  onCancelOrder={() => handleCancelOrder(order)}
                  formatTimeAgo={formatTimeAgo}
                  actionLoading={actionLoading}
                />
              ))}
            </div>
          </div>
        )}

        {/* Pagination */}
        <div className="mt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-sm text-gray-500">
            Showing{" "}
            <span className="font-semibold text-gray-900">
              {filteredOrders.length}
            </span>{" "}
            results
          </p>
          <div className="flex items-center gap-1">
            <button className="p-2 border cursor-pointer border-gray-200 rounded-lg hover:bg-white transition-colors disabled:opacity-50">
              <ChevronLeft size={18} />
            </button>
            <button className="w-10 h-10 bg-[#E97474] cursor-pointer text-white rounded-lg font-bold text-sm shadow-sm">
              1
            </button>
            <button className="w-10 h-10 border cursor-pointer border-gray-200 rounded-lg font-bold text-sm text-gray-600 hover:bg-white">
              2
            </button>
            <button className="p-2 border cursor-pointer border-gray-200 rounded-lg hover:bg-white transition-colors">
              <ChevronRight size={18} />
            </button>
          </div>
        </div>
      </div>

      {/* Location Modal */}
      {showLocationModal && (
        <div className="fixed inset-0 z-100 flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-gray-900/60 backdrop-blur-sm"
            onClick={() => setShowLocationModal(false)}
          />
          <div className="relative bg-white rounded-2xl w-full max-w-md shadow-2xl overflow-hidden">
            <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
              <h3 className="text-lg font-bold text-gray-900">
                Set Delivery Point
              </h3>
              <button
                onClick={() => setShowLocationModal(false)}
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
                {customerLocations.map((loc, idx) => (
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
                      onChange={() => setSelectedLocation(loc.label)}
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
                  onClick={() => setShowLocationModal(false)}
                  className="flex-1 px-4 py-3 text-gray-600 font-bold text-sm border border-gray-200 rounded-xl hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  onClick={handleConfirmLocation}
                  disabled={!selectedLocation}
                  className="flex-1 px-4 py-3 bg-[#E97474] text-white font-bold text-sm rounded-xl shadow-lg shadow-red-100 hover:opacity-90 disabled:bg-gray-300 disabled:shadow-none transition-all"
                >
                  Set Destination
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Cancellation Confirmation Modal */}
      <ConfirmationModal
        isOpen={showCancelModal}
        onClose={() => {
          setShowCancelModal(false);
          setOrderToCancel(null);
        }}
        onConfirm={executeCancelOrder}
        title="Cancel Order"
        message={
          orderToCancel
            ? `Are you sure you want to cancel order #${orderToCancel.orderNumber}? This action cannot be undone.`
            : ""
        }
        confirmText="Cancel Order"
        variant="danger"
        isLoading={!!actionLoading}
      />
    </div>
  );
}

function OrderRow({
  order,
  isExpanded,
  onToggle,
  onSetLocation,
  onCancelOrder,
  formatTimeAgo,
  actionLoading,
}: any) {
  const statusConfig =
    statusDisplayMap[order.status as keyof typeof statusDisplayMap] ||
    statusDisplayMap.pending;
  const showLocationBtn =
    (order.status === "rider_accepted" || order.status === "pending") &&
    !order.customerLocationLabel;
  const showCancelBtn = statusConfig.canCancel && order.status !== "delivered";

  return (
    <div
      className={`transition-all ${
        isExpanded ? "bg-[#F9FAFB]" : "bg-white hover:bg-gray-50"
      }`}
    >
      <div className="grid grid-cols-1 md:grid-cols-7 gap-5 md:gap-4 p-5 md:p-4 items-center">
        {/* Customer */}
        <div className="flex flex-col">
          <span className="text-[10px] text-gray-400 font-black uppercase md:hidden mb-1.5 tracking-wider">
            Customer
          </span>
          <p className="text-sm font-semibold text-gray-700 flex items-center gap-2">
            <User size={14} className="text-[#00A082]/70" />
            {order.customer?.name || "Guest User"}
          </p>
        </div>

        {/* Rider */}
        <div className="flex flex-col">
          <span className="text-[10px] text-gray-400 font-black uppercase md:hidden mb-1.5 tracking-wider">
            Rider
          </span>
          <p className="text-sm font-medium text-gray-600 flex items-center gap-2">
            <Bike size={14} className="text-emerald-500/70" />
            {order.rider?.name || "Unassigned"}
          </p>
        </div>

        {/* Package Description */}
        <div className="hidden md:flex flex-col">
          <p
            className="text-xs text-gray-600 truncate"
            title={order.packageDescription}
          >
            {order.packageDescription || "No description"}
          </p>
        </div>

        {/* Timeline */}
        <div className="hidden md:flex items-center gap-2 text-gray-500">
          <Clock size={16} />
          <span className="text-sm font-medium">
            {formatTimeAgo(order.createdAt)}
          </span>
        </div>

        {/* Status */}
        <div className="pt-2 md:pt-0">
          <span
            className={`inline-flex items-center px-3 py-1 rounded-full text-[11px] font-bold border shadow-sm ${statusConfig.color}`}
          >
            <span className="w-1.5 h-1.5 rounded-full bg-current mr-2 opacity-60" />
            {statusConfig.label}
          </span>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-between md:justify-end gap-3 pt-4 md:pt-0 border-t border-gray-100 md:border-none mt-2 md:mt-0">
          <div className="md:hidden">
            <p className="text-[10px] text-gray-400 font-bold uppercase">
              Actions
            </p>
          </div>
          <div className="flex items-center gap-2">
            {showLocationBtn && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onSetLocation();
                }}
                className="px-3 py-1.5 bg-[#00A082] text-white text-xs font-bold rounded-lg hover:opacity-90 transition-all shadow-md shadow-[#00A082]/10"
              >
                Set Location
              </button>
            )}

            {showCancelBtn && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onCancelOrder();
                }}
                disabled={actionLoading === order.id}
                className={`px-3 py-1.5 border cursor-pointer border-red-200 text-red-600 text-xs font-bold rounded-lg hover:bg-red-50 transition-all ${
                  actionLoading === order.id
                    ? "opacity-50 cursor-not-allowed"
                    : ""
                }`}
              >
                Cancel
              </button>
            )}

            <button
              onClick={onToggle}
              className={`p-2 rounded-full cursor-pointer transition-colors ${
                isExpanded
                  ? "bg-[#E6F4F1] text-[#00A082]"
                  : "bg-gray-50 text-gray-400"
              }`}
            >
              {isExpanded ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
            </button>
          </div>
        </div>
      </div>

      {isExpanded && (
        <div className="px-4 pb-6 pt-2 animate-in fade-in slide-in-from-top-2 duration-300">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 bg-white p-6 rounded-2xl border border-gray-200 shadow-sm">
            <div className="space-y-4">
              <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-widest border-b pb-2">
                Client Details
              </h4>
              <div className="flex items-start gap-4">
                <div className="h-10 w-10 bg-[#E6F4F1] text-[#00A082] rounded-full flex items-center justify-center shrink-0">
                  <User size={20} />
                </div>
                <div>
                  <p className="font-bold text-gray-900">
                    {order.customer?.name || "John Doe"}
                  </p>
                  <p className="text-xs text-gray-500 mt-0.5">
                    {order.customer?.email}
                  </p>
                  {order.customer?.phoneNumber && (
                    <a
                      href={`tel:${order.customer.phoneNumber}`}
                      className="mt-2 inline-flex items-center gap-2 text-xs font-bold text-[#00A082] hover:underline"
                    >
                      <Phone size={14} /> {order.customer.phoneNumber}
                    </a>
                  )}
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-widest border-b pb-2">
                Logistics
              </h4>
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <MapPin size={18} className="text-gray-400 mt-0.5" />
                  <div>
                    <p className="text-xs font-bold text-gray-900">
                      Destination
                    </p>
                    <p className="text-xs text-gray-500 leading-relaxed">
                      {order.customerLocationLabel ||
                        "No destination specified yet"}
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Package size={18} className="text-gray-400 mt-0.5" />
                  <div>
                    <p className="text-xs font-bold text-gray-900">
                      Package Description
                    </p>
                    <p className="text-xs text-gray-500 italic">
                      {order.packageDescription || "No notes provided"}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-widest border-b pb-2">
                Assigned Courier
              </h4>
              {order.rider ? (
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center shrink-0">
                    <Bike size={20} />
                  </div>
                  <div>
                    <p className="font-bold text-gray-900">
                      {order.rider.name}
                    </p>
                    <p className="text-xs text-gray-500">
                      {order.rider.phoneNumber}
                    </p>
                  </div>
                </div>
              ) : (
                <p className="text-xs text-gray-400 italic">
                  No rider assigned yet
                </p>
              )}
              <div className="flex gap-2">
                <button className="flex-1 flex items-center justify-center gap-2 py-3 bg-[#E97474] cursor-pointer text-white rounded-xl text-sm transition-all shadow-lg shadow-red-50 hover:opacity-90">
                  <ExternalLink size={16} /> Track
                </button>
                {showCancelBtn && (
                  <button
                    onClick={() => onCancelOrder()}
                    disabled={actionLoading === order.id}
                    className={`px-4 py-3 border cursor-pointer border-red-200 text-red-600 text-sm font-bold rounded-xl hover:bg-red-50 transition-all flex items-center gap-2 ${
                      actionLoading === order.id
                        ? "opacity-50 cursor-not-allowed"
                        : ""
                    }`}
                  >
                    <Trash2 size={16} />
                    Cancel Order
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
