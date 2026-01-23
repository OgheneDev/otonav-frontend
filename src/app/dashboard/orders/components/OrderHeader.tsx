import { Package } from "lucide-react";
import { useAuthStore } from "@/stores";

interface OrderHeaderProps {
  totalOrders: number;
}

export function OrderHeader({ totalOrders }: OrderHeaderProps) {
  const { authUser } = useAuthStore();
  return (
    <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
      <div>
        <h1 className="text-2xl md:text-3xl font-semibold text-center md:text-start text-gray-900 tracking-tight">
          Order Management
        </h1>
        <div className="h-1 w-12 hidden md:block bg-[#00A082] rounded-full mt-2 mb-3" />
        <p className="text-gray-500 text-center text-sm md:text-start mt-2">
          Manage and track all logistics operations for{" "}
          <span className="text-[#FF7B7B] font-semibold">
            {authUser?.organizations?.[0]?.name}
          </span>{" "}
          in real-time.
        </p>
      </div>
      <div className="flex items-center gap-3">
        <div className="bg-linear-to-br w-full md:w-auto from-white to-gray-50 px-5 py-4 rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow min-w-60">
          <div className="flex items-center justify-between mb-3">
            <p className="text-[10px] uppercase tracking-wider text-gray-500">
              Total Orders
            </p>
            <div className="p-1.5 bg-[#E97474]/10 rounded-lg">
              <Package size={14} className="text-[#E97474]" strokeWidth={2} />
            </div>
          </div>
          <p className="text-3xl text-gray-900 leading-none tabular-nums">
            {totalOrders}
          </p>
          <div className="mt-2 pt-2 border-t border-gray-100">
            <p className="text-[10px] text-gray-400">Last updated: Now</p>
          </div>
        </div>
      </div>
    </div>
  );
}
