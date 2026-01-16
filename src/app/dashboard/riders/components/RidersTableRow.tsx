import {
  Phone,
  Calendar,
  Clock,
  RotateCw,
  Lock,
  Unlock,
  Trash2,
  X,
} from "lucide-react";
import type { Rider } from "@/types/rider";
import { RiderStatusBadge } from "./RiderStatusBadge";
import {
  formatDate,
  getStatusDisplay,
  isInvitationExpired,
  isPendingRider,
  isSuspendedRider,
} from "@/utils/riderUtils";

interface RidersTableRowProps {
  rider: Rider;
  actionLoading: string | null;
  onResendInvitation: (riderId: string) => Promise<void>;
  onCancelInvitation: (riderId: string) => void;
  onSuspendToggle: (riderId: string, isSuspended: boolean) => void;
  onRemoveRider: (riderId: string, isPending?: boolean) => void;
}

export function RidersTableRow({
  rider,
  actionLoading,
  onResendInvitation,
  onCancelInvitation,
  onSuspendToggle,
  onRemoveRider,
}: RidersTableRowProps) {
  const status = getStatusDisplay(rider);
  const isActionLoading = actionLoading === rider.id;
  const isPending = isPendingRider(rider);
  const isSuspended = isSuspendedRider(rider);
  const isExpired = isInvitationExpired(rider.orgMembership?.invitedAt ?? null);

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
                : "bg-blue-50 text-blue-600"
            }`}
          >
            {rider.name?.[0] || rider.email?.[0]?.toUpperCase()}
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-gray-800 text-sm md:text-sm truncate mb-0.5">
              {rider.name || rider.email}
            </p>
            <p className="text-xs text-gray-500 truncate">{rider.email}</p>
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
            {rider.phoneNumber || "No Phone"}
          </span>
        </div>
      </td>

      {/* Status Badge */}
      <td className="px-5 py-3 md:px-6 md:py-5">
        <RiderStatusBadge status={status} />
      </td>

      {/* Joined/Invited Date */}
      <td className="px-5 py-2.5 md:px-6 md:py-5">
        <div className="flex items-start gap-2.5 text-gray-600 text-sm">
          {isPending ? (
            <>
              <div className="md:hidden p-1.5 bg-gray-50 rounded-md mt-0.5">
                <Clock size={13} className="text-gray-400" strokeWidth={1.5} />
              </div>
              <div>
                <div className="md:text-gray-700">
                  Invited: {formatDate(rider.orgMembership?.invitedAt ?? null)}
                </div>
                {rider.orgMembership?.joinedAt && (
                  <div className="text-xs text-gray-400 mt-0.5">
                    Joined: {formatDate(rider.orgMembership.joinedAt)}
                  </div>
                )}
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
                {rider.orgMembership?.joinedAt
                  ? `Joined: ${formatDate(rider.orgMembership.joinedAt)}`
                  : "Not joined yet"}
              </span>
            </>
          )}
        </div>
      </td>

      {/* Actions */}
      <td className="px-5 py-4 md:px-6 md:py-5 bg-gray-50/50 md:bg-transparent mt-2 md:mt-0 rounded-b-xl md:rounded-none">
        <div className="flex items-center justify-end gap-5 md:gap-3 flex-wrap">
          {isPending ? (
            <>
              <button
                onClick={() => onResendInvitation(rider.id)}
                disabled={isActionLoading || isExpired}
                className={`flex items-center gap-2 cursor-pointer transition-all group ${
                  isActionLoading || isExpired
                    ? "opacity-30 cursor-not-allowed"
                    : "text-blue-500 hover:text-blue-600"
                }`}
                title={isExpired ? "Invitation expired" : "Resend invitation"}
              >
                <div className="md:p-2 md:bg-blue-50 md:rounded-lg md:group-hover:bg-blue-100 transition-colors">
                  <RotateCw size={18} strokeWidth={1.5} />
                </div>
                <span className="md:hidden text-xs uppercase tracking-wider">
                  Resend
                </span>
              </button>

              <button
                onClick={() => onCancelInvitation(rider.id)}
                disabled={isActionLoading}
                className={`flex items-center gap-2 cursor-pointer transition-all group ${
                  isActionLoading
                    ? "opacity-30 cursor-not-allowed"
                    : "text-red-500 hover:text-red-600"
                }`}
                title="Cancel invitation"
              >
                <div className="md:p-2 md:bg-red-50 md:rounded-lg md:group-hover:bg-red-100 transition-colors">
                  <X size={18} strokeWidth={1.5} />
                </div>
                <span className="md:hidden text-xs uppercase tracking-wider">
                  Cancel
                </span>
              </button>
            </>
          ) : (
            <>
              <button
                onClick={() => onSuspendToggle(rider.id, isSuspended)}
                disabled={isActionLoading}
                className={`flex items-center cursor-pointer gap-2 transition-all group ${
                  isActionLoading
                    ? "opacity-30 cursor-not-allowed"
                    : isSuspended
                    ? "text-orange-500 hover:text-orange-600"
                    : "text-gray-400 hover:text-gray-600"
                }`}
                title={isSuspended ? "Unsuspend rider" : "Suspend rider"}
              >
                <div
                  className={`md:p-2 md:rounded-lg transition-colors ${
                    isSuspended
                      ? "md:bg-orange-50 md:group-hover:bg-orange-100"
                      : "md:bg-gray-100 md:group-hover:bg-gray-200"
                  }`}
                >
                  {isSuspended ? (
                    <Unlock size={18} strokeWidth={1.5} />
                  ) : (
                    <Lock size={18} strokeWidth={1.5} />
                  )}
                </div>
                <span className="md:hidden text-xs uppercase tracking-wider">
                  {isSuspended ? "Unsuspend" : "Suspend"}
                </span>
              </button>

              <button
                onClick={() => onRemoveRider(rider.id, false)}
                disabled={isActionLoading}
                className={`flex items-center gap-2 cursor-pointer transition-all group ${
                  isActionLoading
                    ? "opacity-30 cursor-not-allowed"
                    : "text-gray-400 hover:text-red-500"
                }`}
                title="Remove rider"
              >
                <div className="md:p-2 md:bg-gray-100 md:rounded-lg md:group-hover:bg-red-50 transition-colors">
                  <Trash2 size={18} strokeWidth={1.5} />
                </div>
                <span className="md:hidden text-xs uppercase tracking-wider">
                  Remove
                </span>
              </button>
            </>
          )}
        </div>
      </td>
    </tr>
  );
}
