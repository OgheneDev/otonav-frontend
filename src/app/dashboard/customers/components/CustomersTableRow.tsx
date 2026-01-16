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
      className={`flex flex-col md:table-row bg-white border border-gray-100 md:border-0 md:border-b md:border-gray-100 rounded-xl md:rounded-none hover:bg-gray-50/50 transition-all duration-200 ${
        isExpired && isPending ? "opacity-60" : ""
      }`}
    >
      {/* Name & Avatar */}
      <td className="px-5 py-4 md:px-6 md:py-5">
        <div className="flex items-center gap-3.5">
          <div
            className={`w-11 h-11 md:w-10 md:h-10 rounded-xl shrink-0 flex items-center justify-center text-base md:text-sm border-2 border-white shadow-sm ${
              isPending
                ? "bg-yellow-50 text-yellow-600"
                : customer.emailVerified
                ? "bg-green-50 text-green-600"
                : "bg-gray-50 text-gray-600"
            }`}
          >
            {customer.name?.[0] || customer.email?.[0]?.toUpperCase() || "C"}
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-gray-800 text-sm md:text-sm truncate mb-0.5">
              {customer.name || customer.email || "No Name"}
            </p>
            <div className="flex items-center gap-1.5 text-xs text-gray-500 truncate">
              <Mail size={12} className="text-gray-400 shrink-0" />
              <span>{customer.email}</span>
            </div>
          </div>
        </div>
      </td>

      {/* Contact - Phone */}
      <td className="px-5 py-2.5 md:px-6 md:py-5">
        <div className="flex items-center gap-2.5 text-gray-600 text-sm">
          <div className="md:hidden p-1.5 bg-gray-50 rounded-md">
            <Phone size={13} className="text-gray-400" strokeWidth={1.5} />
          </div>
          <span className="md:text-gray-700">
            {customer.phoneNumber || "No Phone"}
          </span>
        </div>
      </td>

      {/* Status Badge */}
      <td className="px-5 py-3 md:px-6 md:py-5">
        <CustomerStatusBadge
          status={status}
          isEmailVerified={customer.emailVerified}
        />
      </td>

      {/* Created Date */}
      <td className="px-5 py-2.5 md:px-6 md:py-5">
        <div className="flex items-start gap-2.5 text-gray-600 text-sm">
          {isPending ? (
            <>
              <div className="md:hidden p-1.5 bg-gray-50 rounded-md mt-0.5">
                <Clock size={13} className="text-gray-400" strokeWidth={1.5} />
              </div>
              <div className="md:text-gray-700">
                Invited: {formatDate(customer.createdAt)}
              </div>
            </>
          ) : (
            <>
              <div className="md:hidden p-1.5 bg-gray-50 rounded-md mt-0.5">
                <Calendar
                  size={13}
                  className="text-gray-400"
                  strokeWidth={1.5}
                />
              </div>
              <span className="md:text-gray-700">
                Created: {formatDate(customer.createdAt)}
              </span>
            </>
          )}
        </div>
      </td>

      {/* Actions */}
      <td className="px-5 py-4 md:px-6 md:py-5 bg-gray-50/50 md:bg-transparent mt-2 md:mt-0 rounded-b-xl md:rounded-none">
        <div className="flex items-center justify-end gap-5 md:gap-3 flex-wrap">
          {isPending ? (
            <button
              onClick={() => onResendInvitation(customer.id)}
              disabled={isActionLoading || isExpired}
              className={`flex items-center gap-2 cursor-pointer transition-all group ${
                isActionLoading || isExpired
                  ? "opacity-30 cursor-not-allowed"
                  : "text-blue-500 hover:text-blue-600"
              }`}
              title={isExpired ? "Invitation expired" : "Resend invitation"}
            >
              <div className="md:p-2 md:bg-blue-50 md:rounded-lg md:group-hover:bg-blue-100 transition-colors">
                <RotateCw
                  size={18}
                  strokeWidth={1.5}
                  className={isActionLoading ? "animate-spin" : ""}
                />
              </div>
              <span className="md:hidden text-xs uppercase tracking-wider">
                {isActionLoading ? "Sending..." : "Resend"}
              </span>
            </button>
          ) : (
            <div className="flex items-center gap-2">
              <div className="md:hidden flex items-center gap-1.5 px-3 py-1.5 bg-green-50 rounded-full">
                <CheckCircle2 size={14} className="text-green-600" />
                <span className="text-xs text-green-700">
                  {customer.emailVerified ? "Active" : "Inactive"}
                </span>
              </div>
              <div className="hidden md:flex items-center gap-1.5">
                <CheckCircle2
                  size={16}
                  className={`${
                    customer.emailVerified ? "text-green-500" : "text-gray-300"
                  }`}
                />
                <span
                  className={`text-sm ${
                    customer.emailVerified ? "text-green-600" : "text-gray-400"
                  }`}
                >
                  {customer.emailVerified ? "Active" : "Inactive"}
                </span>
              </div>
            </div>
          )}

          {/* Expired Warning */}
          {isPending && isExpired && (
            <div className="flex items-center gap-1.5 px-3 py-1.5 bg-red-50 rounded-full text-red-600">
              <AlertCircle size={14} />
              <span className="text-xs">Expired</span>
            </div>
          )}
        </div>
      </td>
    </tr>
  );
}
