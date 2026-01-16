import {
  Phone,
  Mail,
  Calendar,
  Clock,
  RotateCw,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";
import type { Customer } from "@/types/customer";
import { CustomerStatusBadge } from "./CustomerStatusBadge";
import {
  formatDate,
  getStatusDisplay,
  isInvitationExpired,
  isPendingCustomer,
} from "../utils/customerUtils";

interface CustomersTableRowProps {
  customer: Customer;
  actionLoading: string | null;
  onResendInvitation: (customerId: string) => Promise<void>;
}

export function CustomersTableRow({
  customer,
  actionLoading,
  onResendInvitation,
}: CustomersTableRowProps) {
  const status = getStatusDisplay(customer);
  const isActionLoading = actionLoading === customer.id;
  const isPending = isPendingCustomer(customer);
  const isExpired = isInvitationExpired(customer.createdAt);

  return (
    <tr
      className={`group flex flex-col md:table-row bg-white border border-gray-100 md:border-0 md:border-b md:border-gray-100 rounded-2xl md:rounded-none hover:bg-linear-to-r hover:from-gray-50/50 hover:to-white transition-all duration-200 ${
        isExpired && isPending ? "opacity-60" : ""
      }`}
    >
      {/* Name & Avatar */}
      <td className="px-6 py-4 md:px-8 md:py-6">
        <div className="flex items-center gap-4">
          <div className="relative">
            <div
              className={`w-12 h-12 md:w-11 md:h-11 rounded-full shrink-0 flex items-center justify-center text-lg md:text-base shadow-sm transition-all duration-200 ${
                isPending
                  ? "bg-linear-to-br from-yellow-100 to-yellow-50 text-yellow-700 ring-2 ring-yellow-200"
                  : customer.emailVerified
                  ? "bg-linear-to-br from-green-100 to-emerald-50 text-green-700 ring-2 ring-green-200"
                  : "bg-linear-to-br from-gray-100 to-gray-50 text-gray-600 ring-2 ring-gray-200"
              }`}
            >
              {customer.name?.[0] || customer.email?.[0]?.toUpperCase() || "C"}
            </div>
            {/* Status Indicator Dot */}
            {customer.emailVerified && !isPending && (
              <div className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 bg-green-500 rounded-full border-2 border-white shadow-sm"></div>
            )}
            {isPending && (
              <div className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 bg-yellow-500 rounded-full border-2 border-white shadow-sm animate-pulse"></div>
            )}
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-gray-900 text-base md:text-sm truncate mb-0.5">
              {customer.name || "No Name"}
            </p>
            <div className="flex items-center gap-1.5">
              <Mail size={12} className="text-gray-400 shrink-0" />
              <p className="text-xs text-gray-500 truncate">{customer.email}</p>
            </div>
          </div>
        </div>
      </td>

      {/* Contact Info */}
      <td className="px-6 py-2 md:px-8 md:py-6">
        <div className="flex items-center gap-2">
          <div className="p-1.5 bg-gray-50 rounded-lg">
            <Phone size={14} className="text-gray-400" />
          </div>
          <span className="text-gray-700 text-sm">
            {customer.phoneNumber || "Not provided"}
          </span>
        </div>
      </td>

      {/* Status Badge */}
      <td className="px-6 py-3 md:px-8 md:py-6">
        <CustomerStatusBadge
          status={status}
          isEmailVerified={customer.emailVerified}
        />
      </td>

      {/* Created Date */}
      <td className="px-6 py-2 md:px-8 md:py-6">
        <div className="flex items-center gap-2">
          <div className="p-1.5 bg-gray-50 rounded-lg md:hidden">
            <Calendar size={14} className="text-gray-400" />
          </div>
          <div className="flex flex-col md:flex-row md:items-center md:gap-2">
            <span className="text-gray-700 text-sm">
              {formatDate(customer.createdAt)}
            </span>
          </div>
        </div>
      </td>

      {/* Actions */}
      <td className="px-6 py-4 md:px-8 md:py-6 bg-linear-to-b from-gray-50/30 to-transparent md:bg-transparent mt-2 md:mt-0 rounded-b-2xl md:rounded-none">
        <div className="flex items-center justify-end gap-6 md:gap-4 flex-wrap">
          {isPending ? (
            <button
              onClick={() => onResendInvitation(customer.id)}
              disabled={isActionLoading || isExpired}
              className={`group/btn flex items-center gap-2 px-4 py-2 md:px-0 md:py-0 rounded-lg md:rounded-none transition-all duration-200 ${
                isActionLoading || isExpired
                  ? "opacity-40 cursor-not-allowed"
                  : "text-blue-600 hover:text-blue-700 md:hover:scale-110"
              }`}
              title={
                isExpired
                  ? "Invitation expired - contact support"
                  : "Resend invitation email"
              }
            >
              <div
                className={`p-1.5 md:p-0 rounded-lg md:rounded-none transition-all ${
                  !(isActionLoading || isExpired) && "md:hover:bg-blue-50"
                }`}
              >
                <RotateCw
                  size={18}
                  className={`${isActionLoading ? "animate-spin" : ""}`}
                />
              </div>
              <span className="md:hidden text-xs uppercase tracking-wide">
                {isActionLoading
                  ? "Sending..."
                  : isExpired
                  ? "Expired"
                  : "Resend"}
              </span>
            </button>
          ) : (
            <div className="flex items-center gap-1.5 px-3 py-1.5 bg-linear-to-r from-green-50 to-emerald-50 rounded-full md:bg-none md:p-0">
              <CheckCircle2 size={14} className="text-green-600 md:hidden" />
              <span className="text-xs text-green-700 md:text-gray-400 md:italic">
                {customer.emailVerified ? "Active" : "Inactive"}
              </span>
            </div>
          )}

          {/* Expired Warning */}
          {isPending && isExpired && (
            <div className="flex items-center gap-1.5 px-3 py-1.5 bg-red-50 rounded-full text-red-600 md:absolute md:right-2">
              <AlertCircle size={14} />
              <span className="text-xs">Expired</span>
            </div>
          )}
        </div>
      </td>
    </tr>
  );
}
