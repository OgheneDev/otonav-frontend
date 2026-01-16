import {
  User,
  Phone,
  MapPin,
  Package,
  Bike,
  ExternalLink,
  Trash2,
} from "lucide-react";
import type { Order } from "@/types/order";

interface ExpandedOrderDetailsProps {
  order: Order;
  onCancelOrder: () => void;
  actionLoading: string | null;
  showCancelBtn: boolean;
}

export function ExpandedOrderDetails({
  order,
  onCancelOrder,
  actionLoading,
  showCancelBtn,
}: ExpandedOrderDetailsProps) {
  return (
    <div className="px-4 pb-6 pt-2 animate-in fade-in slide-in-from-top-2 duration-300">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
        {/* Client Details */}
        <div className="space-y-4">
          <h4 className="text-[10px] text-gray-400 uppercase tracking-wider pb-3 border-b border-gray-100">
            Client Details
          </h4>
          <div className="flex items-start gap-3.5">
            <div className="h-11 w-11 bg-[#E6F4F1] text-[#00A082] rounded-xl flex items-center justify-center shrink-0">
              <User size={20} strokeWidth={1.5} />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm text-gray-900 mb-1">
                {order.customer?.name || "John Doe"}
              </p>
              <p className="text-xs text-gray-500 wrap-break-word leading-relaxed">
                {order.customer?.email}
              </p>
              {order.customer?.phoneNumber && (
                <a
                  href={`tel:${order.customer.phoneNumber}`}
                  className="mt-2.5 inline-flex items-center gap-2 text-xs text-[#00A082] hover:text-[#00A082]/80 transition-colors"
                >
                  <div className="p-1 bg-[#00A082]/8 rounded">
                    <Phone size={12} />
                  </div>
                  {order.customer.phoneNumber}
                </a>
              )}
            </div>
          </div>
        </div>

        {/* Logistics */}
        <div className="space-y-4">
          <h4 className="text-[10px] text-gray-400 uppercase tracking-wider pb-3 border-b border-gray-100">
            Logistics
          </h4>
          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <div className="p-2 bg-gray-50 rounded-lg shrink-0">
                <MapPin size={16} className="text-gray-500" strokeWidth={1.5} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs text-gray-500 mb-1">Destination</p>
                <p className="text-sm text-gray-900 leading-relaxed">
                  {order.customerLocationLabel ||
                    "No destination specified yet"}
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="p-2 bg-gray-50 rounded-lg shrink-0">
                <Package
                  size={16}
                  className="text-gray-500"
                  strokeWidth={1.5}
                />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs text-gray-500 mb-1">
                  Package Description
                </p>
                <p className="text-sm text-gray-700 italic leading-relaxed">
                  {order.packageDescription || "No notes provided"}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Assigned Courier */}
        <div className="space-y-4">
          <h4 className="text-[10px] text-gray-400 uppercase tracking-wider pb-3 border-b border-gray-100">
            Assigned Courier
          </h4>
          {order.rider ? (
            <div className="flex items-center gap-3.5 mb-4">
              <div className="h-11 w-11 bg-emerald-50 text-emerald-600 rounded-xl flex items-center justify-center shrink-0">
                <Bike size={20} strokeWidth={1.5} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm text-gray-900 mb-1">{order.rider.name}</p>
                <p className="text-xs text-gray-500">
                  {order.rider.phoneNumber}
                </p>
              </div>
            </div>
          ) : (
            <p className="text-sm text-gray-400 italic mb-4">
              No rider assigned yet
            </p>
          )}
          <div className="flex flex-col gap-2.5 pt-2">
            <button className="flex-1 flex items-center justify-center gap-2 py-3 bg-[#E97474] cursor-pointer text-white rounded-lg text-sm transition-all shadow-sm hover:shadow-md hover:bg-[#E97474]/90">
              <ExternalLink size={16} strokeWidth={1.5} /> Track Order
            </button>
            {showCancelBtn && (
              <button
                onClick={onCancelOrder}
                disabled={actionLoading === order.id}
                className={`px-4 py-3 border cursor-pointer border-red-200 text-red-600 text-sm rounded-lg hover:bg-red-50 hover:border-red-300 transition-all flex justify-center items-center gap-2 ${
                  actionLoading === order.id
                    ? "opacity-50 cursor-not-allowed"
                    : ""
                }`}
              >
                <Trash2 size={16} strokeWidth={1.5} />
                Cancel Order
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
