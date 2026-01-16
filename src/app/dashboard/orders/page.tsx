"use client";

import React, { useState, useEffect } from "react";
import { useOrderStore, useToastStore } from "@/stores";
import type { Order } from "@/types/order";
import { ConfirmationModal } from "@/components/ui/ConfirmationModal";
import { OrderHeader } from "./components/OrderHeader";
import { OrderFilters } from "./components/OrderFilters";
import { OrderRow } from "./components/OrderRow";
import { LocationModal } from "./components/LocationModal";
import { Alert } from "@/components/ui/Alert";
import {
  formatTimeAgo,
  getDisplayStatus,
  statusDisplayMap,
} from "@/utils/orderUtils";
import { filterOptions } from "@/constants/filters";
import { ChevronRight, Package, ChevronLeft } from "lucide-react";

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

      getAllOrders();
    } catch (err: any) {
      setError(err.message || "Failed to cancel order");
    } finally {
      setActionLoading(null);
      setOrderToCancel(null);
      setShowCancelModal(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F9FAFB] pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        {/* Alerts */}
        {success && (
          <Alert
            type="success"
            message={success}
            onClose={() => setSuccess(null)}
            className="mb-6"
          />
        )}

        {error && (
          <Alert
            type="error"
            message={error}
            onClose={() => setError(null)}
            className="mb-6"
          />
        )}

        {/* Header */}
        <OrderHeader totalOrders={orders.length} />

        {/* Search and Filters */}
        <OrderFilters
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          activeFilter={activeFilter}
          onFilterChange={setActiveFilter}
        />

        {/* Orders List */}
        {isLoadingOrders ? (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            {/* Skeleton Header */}
            <div className="hidden md:grid grid-cols-7 gap-4 p-4 bg-gray-50 border-b border-gray-200">
              {[1, 2, 3, 4, 5, 6, 7].map((i) => (
                <div
                  key={i}
                  className="h-4 bg-gray-200 rounded animate-pulse"
                />
              ))}
            </div>

            {/* Skeleton Rows */}
            <div className="divide-y divide-gray-100">
              {[1, 2, 3, 4, 5].map((rowIndex) => (
                <div key={rowIndex} className="p-5 md:p-4">
                  <div className="grid grid-cols-1 md:grid-cols-7 gap-5 md:gap-4">
                    {/* Customer Skeleton */}
                    <div className="flex flex-col gap-2">
                      <div className="h-3 w-16 bg-gray-200 rounded animate-pulse" />
                      <div className="flex items-center gap-2">
                        <div className="h-8 w-8 rounded-full bg-gray-200 animate-pulse" />
                        <div className="flex-1">
                          <div className="h-4 w-24 bg-gray-200 rounded animate-pulse mb-1" />
                          <div className="h-3 w-32 bg-gray-100 rounded animate-pulse" />
                        </div>
                      </div>
                    </div>

                    {/* Rider Skeleton */}
                    <div className="flex flex-col gap-2">
                      <div className="h-3 w-16 bg-gray-200 rounded animate-pulse" />
                      <div className="flex items-center gap-2">
                        <div className="h-6 w-6 rounded-full bg-gray-200 animate-pulse" />
                        <div className="h-4 w-20 bg-gray-200 rounded animate-pulse" />
                      </div>
                    </div>

                    {/* Package Skeleton */}
                    <div className="hidden md:flex flex-col gap-2">
                      <div className="h-3 w-16 bg-gray-200 rounded animate-pulse" />
                      <div className="h-4 w-full bg-gray-200 rounded animate-pulse" />
                    </div>

                    {/* Timeline Skeleton */}
                    <div className="hidden md:flex flex-col gap-2">
                      <div className="h-3 w-16 bg-gray-200 rounded animate-pulse" />
                      <div className="flex items-center gap-2">
                        <div className="h-4 w-4 bg-gray-200 rounded-full animate-pulse" />
                        <div className="h-4 w-16 bg-gray-200 rounded animate-pulse" />
                      </div>
                    </div>

                    {/* Status Skeleton */}
                    <div className="flex flex-col gap-2">
                      <div className="h-3 w-16 bg-gray-200 rounded animate-pulse" />
                      <div className="h-6 w-20 bg-gray-200 rounded-full animate-pulse" />
                    </div>

                    {/* Actions Skeleton */}
                    <div className="flex flex-col gap-2 md:items-end">
                      <div className="h-3 w-16 bg-gray-200 rounded animate-pulse md:hidden" />
                      <div className="flex items-center gap-2 justify-end">
                        <div className="h-8 w-20 bg-gray-200 rounded-lg animate-pulse" />
                        <div className="h-8 w-20 bg-gray-200 rounded-lg animate-pulse" />
                        <div className="h-8 w-8 bg-gray-200 rounded-full animate-pulse" />
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
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
                  statusDisplayMap={statusDisplayMap}
                />
              ))}
            </div>
          </div>
        )}

        {/* Pagination */}
        <Pagination totalItems={filteredOrders.length} />
      </div>

      {/* Location Modal */}
      {showLocationModal && (
        <LocationModal
          isOpen={showLocationModal}
          onClose={() => setShowLocationModal(false)}
          locations={customerLocations}
          selectedLocation={selectedLocation}
          onLocationSelect={setSelectedLocation}
          onConfirm={handleConfirmLocation}
        />
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

// Small internal Pagination component
function Pagination({ totalItems }: { totalItems: number }) {
  return (
    <div className="mt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
      <p className="text-sm text-gray-500">
        Showing{" "}
        <span className="font-semibold text-gray-900">{totalItems}</span>{" "}
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
  );
}
