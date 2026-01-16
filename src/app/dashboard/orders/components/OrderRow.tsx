import React from "react";
import {
  User,
  Bike,
  ChevronDown,
  ChevronUp,
  Clock,
  Package,
  MapPin,
} from "lucide-react";
import type { Order } from "@/types/order";
import { StatusBadge } from "./StatusBadge";
import { ExpandedOrderDetails } from "./ExpandedOrderDetails";

interface OrderRowProps {
  order: Order;
  isExpanded: boolean;
  onToggle: () => void;
  onSetLocation: () => void;
  onCancelOrder: () => void;
  formatTimeAgo: (dateString: string | null) => string;
  actionLoading: string | null;
  statusDisplayMap: any;
}

export function OrderRow({
  order,
  isExpanded,
  onToggle,
  onSetLocation,
  onCancelOrder,
  formatTimeAgo,
  actionLoading,
  statusDisplayMap,
}: OrderRowProps) {
  const statusConfig =
    statusDisplayMap[order.status as keyof typeof statusDisplayMap] ||
    statusDisplayMap.pending;

  const showLocationBtn =
    (order.status === "rider_accepted" || order.status === "pending") &&
    !order.customerLocationLabel;

  const showCancelBtn = statusConfig.canCancel && order.status !== "delivered";

  return (
    <div
      className={`transition-all duration-200 border-b border-gray-100 ${
        isExpanded ? "bg-[#F9FAFB]" : "bg-white hover:bg-gray-50/50"
      }`}
    >
      {/* Desktop Layout */}
      <div className="hidden md:grid md:grid-cols-7 gap-6 p-5 items-center">
        {/* Customer */}
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-2 text-gray-700">
            <span className="text-sm">
              {order.customer?.name || "Guest User"}
            </span>
          </div>
        </div>

        {/* Rider */}
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-2 text-gray-600">
            <span className="text-sm">{order.rider?.name || "Unassigned"}</span>
          </div>
        </div>

        {/* Package Description */}
        <div className="flex flex-col">
          <p
            className="text-sm text-gray-600 truncate leading-relaxed"
            title={order.packageDescription}
          >
            {order.packageDescription || "No description"}
          </p>
        </div>

        {/* Timeline */}
        <div className="flex items-center gap-2.5 text-gray-500">
          <Clock size={15} strokeWidth={1.5} />
          <span className="text-sm">{formatTimeAgo(order.createdAt)}</span>
        </div>

        {/* Status */}
        <div>
          <StatusBadge status={order.status} />
        </div>

        {/* Actions - Desktop */}
        <div className="col-span-2 flex items-center justify-end gap-2.5">
          {/*{showLocationBtn && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onSetLocation();
              }}
              className="px-4 py-2 bg-[#00A082] text-white text-sm cursor-pointer rounded-lg hover:bg-[#00A082]/90 transition-all shadow-sm hover:shadow-md whitespace-nowrap"
            >
              Set Location
            </button>
          )}*/}

          {showCancelBtn && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onCancelOrder();
              }}
              disabled={actionLoading === order.id}
              className={`px-4 py-2 border cursor-pointer border-red-200 text-red-600 text-sm rounded-lg hover:bg-red-50 hover:border-red-300 transition-all whitespace-nowrap ${
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
            className={`p-2 rounded-lg cursor-pointer transition-all ${
              isExpanded
                ? "bg-[#E6F4F1] text-[#00A082] shadow-sm"
                : "bg-gray-100 text-gray-500 hover:bg-gray-200"
            }`}
          >
            {isExpanded ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
          </button>
        </div>
      </div>

      {/* Mobile Layout */}
      <div className="md:hidden p-5 space-y-5">
        {/* Row 1: Customer, Rider, Time & Status */}
        <div className="flex justify-between items-start gap-4">
          <div className="space-y-3.5 flex-1">
            <div>
              <p className="text-[10px] text-gray-400 uppercase tracking-wider mb-1.5">
                Customer
              </p>
              <div className="flex items-center gap-2 text-gray-700">
                <div className="p-1.5 bg-[#00A082]/8 rounded-md">
                  <User size={13} className="text-[#00A082]" />
                </div>
                <span className="text-sm">
                  {order.customer?.name || "Guest User"}
                </span>
              </div>
            </div>

            <div>
              <p className="text-[10px] text-gray-400 uppercase tracking-wider mb-1.5">
                Rider
              </p>
              <div className="flex items-center gap-2 text-gray-600">
                <div className="p-1.5 bg-emerald-50 rounded-md">
                  <Bike size={13} className="text-emerald-600" />
                </div>
                <span className="text-sm">
                  {order.rider?.name || "Unassigned"}
                </span>
              </div>
            </div>
          </div>

          <div className="flex flex-col items-end gap-3">
            <StatusBadge status={order.status} />
            <div className="flex items-center gap-2 text-gray-500 text-xs">
              <Clock size={13} strokeWidth={1.5} />
              <span>{formatTimeAgo(order.createdAt)}</span>
            </div>
          </div>
        </div>

        {/* Row 2: Package Info */}
        <div className="space-y-2">
          <p className="text-[10px] text-gray-400 uppercase tracking-wider">
            Package Description
          </p>
          <div className="flex items-start gap-2.5 bg-gray-50 p-3.5 rounded-lg border border-gray-100">
            <Package size={14} className="text-gray-400 mt-0.5 shrink-0" />
            <p className="text-sm text-gray-600 leading-relaxed">
              {order.packageDescription || "No description"}
            </p>
          </div>
        </div>

        {/* Row 3: Location Status */}
        <div className="space-y-2">
          <p className="text-[10px] text-gray-400 uppercase tracking-wider">
            Destination
          </p>
          <div className="flex items-start gap-2.5 bg-gray-50 p-3.5 rounded-lg border border-gray-100">
            <MapPin size={14} className="text-gray-400 mt-0.5 shrink-0" />
            <p className="text-sm text-gray-600 leading-relaxed">
              {order.customerLocationLabel || "No destination specified"}
            </p>
          </div>
        </div>

        {/* Row 4: Actions */}
        <div className="pt-4 border-t border-gray-200">
          <p className="text-[10px] text-gray-400 uppercase tracking-wider mb-3">
            Actions
          </p>
          <div className="flex flex-col gap-2.5">
            {/*{showLocationBtn && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onSetLocation();
                }}
                className="px-4 py-3 cursor-pointer bg-[#00A082] text-white text-sm rounded-lg hover:bg-[#00A082]/90 transition-all shadow-sm hover:shadow-md flex items-center justify-center gap-2"
              >
                <MapPin size={16} />
                Set Location
              </button>
            )}*/}

            {showCancelBtn && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onCancelOrder();
                }}
                disabled={actionLoading === order.id}
                className={`px-4 py-3 border cursor-pointer border-red-200 text-red-600 text-sm rounded-lg hover:bg-red-50 hover:border-red-300 transition-all flex items-center justify-center gap-2 ${
                  actionLoading === order.id
                    ? "opacity-50 cursor-not-allowed"
                    : ""
                }`}
              >
                Cancel Order
              </button>
            )}

            <button
              onClick={onToggle}
              className={`px-4 py-3 rounded-lg cursor-pointer transition-all flex items-center text-sm justify-center gap-2 ${
                isExpanded
                  ? "bg-[#E6F4F1] text-[#00A082] border border-[#00A082]/20 shadow-sm"
                  : "bg-gray-100 text-gray-600 border border-gray-200 hover:bg-gray-200"
              }`}
            >
              {isExpanded ? (
                <>
                  <ChevronUp size={16} />
                  Less Details
                </>
              ) : (
                <>
                  <ChevronDown size={16} />
                  More Details
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {isExpanded && (
        <ExpandedOrderDetails
          order={order}
          onCancelOrder={onCancelOrder}
          actionLoading={actionLoading}
          showCancelBtn={showCancelBtn}
        />
      )}
    </div>
  );
}
