// app/dashboard/riders/page.tsx - UPDATED
"use client";

import { useState, useEffect } from "react";
import {
  Lock,
  Unlock,
  Trash2,
  AlertCircle,
  X,
  UserPlus,
  Phone,
  Calendar,
  Clock,
  RotateCw,
} from "lucide-react";
import { useRiderStore } from "@/stores";
import { CreateRiderModal } from "@/components/riders/CreateRiderModal";
import { ConfirmationModal } from "@/components/ui/ConfirmationModal";

export default function RidersPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const [confirmConfig, setConfirmConfig] = useState<{
    isOpen: boolean;
    title: string;
    message: string;
    confirmText: string;
    variant: "danger" | "warning" | "info";
    onConfirm: () => void;
  }>({
    isOpen: false,
    title: "",
    message: "",
    confirmText: "",
    variant: "warning",
    onConfirm: () => {},
  });

  const {
    riders,
    isLoadingRiders,
    getAllRiders,
    suspendRider,
    unsuspendRider,
    removeRider,
    resendRiderInvitation,
    cancelRiderInvitation,
  } = useRiderStore();

  useEffect(() => {
    loadRiders();
  }, []);

  const loadRiders = async () => {
    try {
      setError(null);
      // Include pending riders in the fetch
      await getAllRiders({
        includeSuspended: true,
        includeInactive: true,
        includePending: true,
      });
    } catch (err: any) {
      setError(err.message || "Failed to load riders");
    }
  };

  const handleResendInvitation = async (riderId: string) => {
    try {
      setActionLoading(`resend-${riderId}`);

      await resendRiderInvitation(riderId);

      setSuccess("Invitation resent successfully");
      setTimeout(() => setSuccess(null), 3000);
    } catch (err: any) {
      setError(err.message || "Failed to resend invitation");
    } finally {
      setActionLoading(null);
    }
  };

  const handleCancelInvitation = (riderId: string) => {
    setConfirmConfig({
      isOpen: true,
      title: "Cancel Invitation",
      message:
        "Are you sure you want to cancel this invitation? The rider will not be able to complete registration.",
      confirmText: "Cancel Invitation",
      variant: "warning",
      onConfirm: () => executeCancelInvitation(riderId),
    });
  };

  const executeCancelInvitation = async (riderId: string) => {
    setConfirmConfig((prev) => ({ ...prev, isOpen: false }));
    try {
      setActionLoading(riderId);

      await cancelRiderInvitation(riderId);

      setSuccess("Invitation cancelled successfully");
      setTimeout(() => setSuccess(null), 3000);
    } catch (err: any) {
      setError(err.message || "Failed to cancel invitation");
    } finally {
      setActionLoading(null);
    }
  };

  const handleSuspendToggle = async (riderId: string, isSuspended: boolean) => {
    if (isSuspended) {
      executeSuspendAction(riderId, true);
    } else {
      setConfirmConfig({
        isOpen: true,
        title: "Suspend Rider",
        message:
          "Are you sure you want to suspend this rider? They will not be able to accept new deliveries during this period.",
        confirmText: "Suspend Rider",
        variant: "warning",
        onConfirm: () => executeSuspendAction(riderId, false),
      });
    }
  };

  const executeSuspendAction = async (
    riderId: string,
    isCurrentlySuspended: boolean
  ) => {
    setConfirmConfig((prev) => ({ ...prev, isOpen: false }));
    try {
      setActionLoading(riderId);
      if (isCurrentlySuspended) {
        await unsuspendRider(riderId);
      } else {
        await suspendRider(riderId, {
          reason: "Suspended by admin",
          suspensionDurationDays: 30,
        });
      }
    } catch (err: any) {
      setError(err.message || "Failed to update rider status");
    } finally {
      setActionLoading(null);
    }
  };

  const handleRemoveRider = (riderId: string, isPending: boolean = false) => {
    setConfirmConfig({
      isOpen: true,
      title: isPending ? "Cancel Invitation" : "Remove Rider",
      message: isPending
        ? "This will cancel the invitation. The rider will not be able to complete registration."
        : "This action is permanent. All data associated with this rider will be archived and they will lose access immediately.",
      confirmText: isPending ? "Cancel" : "Remove",
      variant: isPending ? "warning" : "danger",
      onConfirm: () =>
        isPending
          ? executeCancelInvitation(riderId)
          : executeRemoveAction(riderId),
    });
  };

  const executeRemoveAction = async (riderId: string) => {
    setConfirmConfig((prev) => ({ ...prev, isOpen: false }));
    try {
      setActionLoading(riderId);
      await removeRider(riderId, { reason: "Removed by admin" });
    } catch (err: any) {
      setError(err.message || "Failed to remove rider");
    } finally {
      setActionLoading(null);
    }
  };

  const formatDate = (dateString: string | null) => {
    if (!dateString) return "Not joined yet";
    return new Date(dateString).toLocaleDateString("en-US", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  const formatDateTime = (dateString: string | null) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString("en-US", {
      day: "numeric",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getStatusDisplay = (rider: any) => {
    const registrationStatus = rider.orgMembership?.registrationStatus;

    if (registrationStatus === "pending") {
      return {
        text: "Pending",
        color: "bg-yellow-50 text-yellow-600 border-yellow-100",
        icon: "🕒",
      };
    }

    if (rider.orgMembership?.isSuspended) {
      return {
        text: "Suspended",
        color: "bg-orange-50 text-orange-600 border-orange-100",
        icon: "⚠️",
      };
    }

    if (rider.orgMembership?.isActive === false) {
      return {
        text: "Deactivated",
        color: "bg-red-50 text-red-600 border-red-100",
        icon: "❌",
      };
    }

    return {
      text: "Active",
      color: "bg-green-50 text-green-600 border-green-100",
      icon: "✅",
    };
  };

  const isInvitationExpired = (invitedAt: string | null) => {
    if (!invitedAt) return false;
    const invitedDate = new Date(invitedAt);
    const expiryDate = new Date(
      invitedDate.getTime() + 7 * 24 * 60 * 60 * 1000
    ); // 7 days
    return new Date() > expiryDate;
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-6 md:px-0">
      {/* Title & Action Header */}
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8">
        <section className="text-center md:text-left">
          <h2 className="text-2xl font-semibold text-[#2D3748]">Riders</h2>
          <p className="text-gray-400 text-sm mt-1">
            Create account and manage riders for your business
          </p>
        </section>

        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center justify-center cursor-pointer gap-2 px-6 py-3.5 bg-[#FF7B7B] hover:bg-[#ff6a6a] text-white text-sm rounded-xl transition-all shadow-lg shadow-red-100 active:scale-95 w-full md:w-auto"
        >
          <UserPlus size={18} />
          <span>Create a new Rider</span>
        </button>
      </header>

      {/* Success Alert */}
      {success && (
        <div className="mb-6 bg-green-50 border border-green-100 rounded-2xl p-4 flex items-center gap-3 animate-in fade-in slide-in-from-top-2">
          <AlertCircle className="text-green-500 shrink-0" size={20} />
          <p className="text-green-800 text-sm font-medium flex-1">{success}</p>
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

      {/* Stats Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm font-medium">Total Riders</p>
              <p className="text-2xl font-bold text-gray-800 mt-1">
                {riders.length}
              </p>
            </div>
            <div className="bg-blue-50 p-3 rounded-xl">
              <UserPlus className="text-blue-500" size={24} />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm font-medium">Active Riders</p>
              <p className="text-2xl font-bold text-green-600 mt-1">
                {
                  riders.filter(
                    (r) =>
                      // Consider a rider active if:
                      // 1. They are not suspended
                      // 2. They are not deactivated (isActive is not false)
                      // 3. They are not pending registration
                      !r.orgMembership?.isSuspended &&
                      r.orgMembership?.isActive !== false &&
                      r.orgMembership?.registrationStatus !== "pending"
                  ).length
                }
              </p>
            </div>
            <div className="bg-green-50 p-3 rounded-xl">
              <div className="text-green-500">✅</div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm font-medium">
                Pending Invitations
              </p>
              <p className="text-2xl font-bold text-yellow-600 mt-1">
                {
                  riders.filter(
                    (r) => r.orgMembership?.registrationStatus === "pending"
                  ).length
                }
              </p>
            </div>
            <div className="bg-yellow-50 p-3 rounded-xl">
              <Clock className="text-yellow-500" size={24} />
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="bg-white md:rounded-4xl md:border border-gray-100 md:shadow-sm overflow-hidden">
        {isLoadingRiders ? (
          <div className="p-8 space-y-4">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="h-20 bg-gray-50 rounded-2xl animate-pulse"
              />
            ))}
          </div>
        ) : riders.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 px-6 text-center">
            <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mb-4 text-gray-300">
              <UserPlus size={32} />
            </div>
            <p className="text-gray-500 text-lg font-semibold">
              No riders found
            </p>
            <p className="text-gray-400 text-sm max-w-xs mt-1">
              Add your team members to start managing deliveries.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="hidden md:table-header-group bg-gray-50/50">
                <tr className="border-b border-gray-100">
                  <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-gray-400">
                    Name
                  </th>
                  <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-gray-400">
                    Phone Number
                  </th>
                  <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-gray-400">
                    Status
                  </th>
                  <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-gray-400">
                    Joined/Invited
                  </th>
                  <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-gray-400 text-right">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="flex flex-col md:table-row-group gap-4 md:gap-0 p-1 md:p-0">
                {riders.map((rider) => {
                  const status = getStatusDisplay(rider);
                  const isActionLoading = actionLoading === rider.id;
                  const isPending =
                    rider.orgMembership?.registrationStatus === "pending";
                  const isSuspended = rider.orgMembership?.isSuspended || false;
                  const isExpired = isInvitationExpired(
                    rider.orgMembership?.invitedAt ?? null
                  );

                  return (
                    <tr
                      key={rider.id}
                      className={`flex flex-col md:table-row bg-white border border-gray-100 md:border-0 md:border-b md:border-gray-50 rounded-2xl md:rounded-none hover:bg-gray-50/30 transition-colors ${
                        isExpired && isPending ? "opacity-75" : ""
                      }`}
                    >
                      {/* Name & Avatar */}
                      <td className="px-6 py-4 md:px-8 md:py-6">
                        <div className="flex items-center gap-4">
                          <div
                            className={`w-12 h-12 md:w-10 md:h-10 rounded-full shrink-0 flex items-center justify-center font-bold text-lg md:text-base border-2 border-white shadow-sm ${
                              isPending
                                ? "bg-yellow-100 text-yellow-600"
                                : "bg-blue-100 text-blue-600"
                            }`}
                          >
                            {rider.name?.[0] || rider.email?.[0]?.toUpperCase()}
                          </div>
                          <div className="min-w-0">
                            <p className="font-semibold text-gray-800 text-base md:text-sm truncate">
                              {rider.name || rider.email}
                            </p>
                            <p className="text-xs text-gray-400 truncate">
                              {rider.email}
                            </p>
                          </div>
                        </div>
                      </td>

                      {/* Contact - Phone */}
                      <td className="px-6 py-2 md:px-8 md:py-6">
                        <div className="flex items-center gap-2 text-gray-600 md:text-gray-700 font-medium text-sm">
                          <Phone
                            size={14}
                            className="md:hidden text-gray-400"
                          />
                          {rider.phoneNumber || "No Phone"}
                        </div>
                      </td>

                      {/* Status Badge */}
                      <td className="px-6 py-3 md:px-8 md:py-6">
                        <div className="flex flex-col gap-2">
                          <span
                            className={`inline-flex px-3 py-1 rounded-full text-[11px] font-bold border uppercase tracking-wider ${status.color}`}
                          >
                            {status.text}
                          </span>
                        </div>
                      </td>

                      {/* Joined/Invited Date */}
                      <td className="px-6 py-2 md:px-8 md:py-6">
                        <div className="flex items-center gap-2 text-gray-500 md:text-gray-700 font-medium text-xs md:text-sm">
                          {isPending ? (
                            <>
                              <Clock
                                size={14}
                                className="md:hidden text-gray-400"
                              />
                              <div>
                                <div>
                                  Invited:{" "}
                                  {formatDate(
                                    rider.orgMembership?.invitedAt ?? null
                                  )}
                                </div>
                                {rider.orgMembership?.joinedAt && (
                                  <div className="text-xs text-gray-400">
                                    Joined:{" "}
                                    {formatDate(rider.orgMembership.joinedAt)}
                                  </div>
                                )}
                              </div>
                            </>
                          ) : (
                            <>
                              <Calendar
                                size={14}
                                className="md:hidden text-gray-400"
                              />
                              {rider.orgMembership?.joinedAt
                                ? `Joined: ${formatDate(
                                    rider.orgMembership.joinedAt
                                  )}`
                                : "Not joined yet"}
                            </>
                          )}
                        </div>
                      </td>

                      {/* Actions */}
                      <td className="px-6 py-4 md:px-8 md:py-6 bg-gray-50/50 md:bg-transparent mt-2 md:mt-0 rounded-b-2xl md:rounded-none">
                        <div className="flex items-center justify-end gap-6 md:gap-4 flex-wrap">
                          {isPending ? (
                            <>
                              <button
                                onClick={() => handleResendInvitation(rider.id)}
                                disabled={isActionLoading || isExpired}
                                className={`flex items-center gap-2 cursor-pointer md:block transition-all ${
                                  isActionLoading || isExpired
                                    ? "opacity-30 cursor-not-allowed"
                                    : "text-blue-500 hover:text-blue-600 hover:scale-110"
                                }`}
                                title={
                                  isExpired
                                    ? "Invitation expired"
                                    : "Resend invitation"
                                }
                              >
                                <RotateCw size={20} />
                                <span className="md:hidden text-xs font-bold uppercase">
                                  Resend
                                </span>
                              </button>

                              <button
                                onClick={() => handleCancelInvitation(rider.id)}
                                disabled={isActionLoading}
                                className={`flex items-center gap-2 cursor-pointer md:block transition-all ${
                                  isActionLoading
                                    ? "opacity-30 cursor-not-allowed"
                                    : "text-red-500 hover:text-red-600 hover:scale-110"
                                }`}
                                title="Cancel invitation"
                              >
                                <X size={20} />
                              </button>
                            </>
                          ) : (
                            <>
                              <button
                                onClick={() =>
                                  handleSuspendToggle(rider.id, isSuspended)
                                }
                                disabled={isActionLoading}
                                className={`flex items-center cursor-pointer gap-2 md:block transition-all ${
                                  isActionLoading
                                    ? "opacity-30 cursor-not-allowed"
                                    : isSuspended
                                    ? "text-orange-500 hover:scale-110"
                                    : "text-gray-400 hover:text-gray-600 hover:scale-110"
                                }`}
                                title={
                                  isSuspended
                                    ? "Unsuspend rider"
                                    : "Suspend rider"
                                }
                              >
                                {isSuspended ? (
                                  <Unlock size={20} />
                                ) : (
                                  <Lock size={20} />
                                )}
                                <span className="md:hidden text-xs font-bold uppercase">
                                  Suspend
                                </span>
                              </button>

                              <button
                                onClick={() =>
                                  handleRemoveRider(rider.id, false)
                                }
                                disabled={isActionLoading}
                                className={`flex items-center gap-2 cursor-pointer md:block transition-all ${
                                  isActionLoading
                                    ? "opacity-30 cursor-not-allowed"
                                    : "text-gray-400 hover:text-red-500 hover:scale-110"
                                }`}
                                title="Remove rider"
                              >
                                <Trash2 size={20} />
                                <span className="md:hidden text-xs font-bold uppercase">
                                  Remove
                                </span>
                              </button>
                            </>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Reusable Confirmation Modal */}
      <ConfirmationModal
        isOpen={confirmConfig.isOpen}
        title={confirmConfig.title}
        message={confirmConfig.message}
        confirmText={confirmConfig.confirmText}
        variant={confirmConfig.variant}
        onClose={() => setConfirmConfig((prev) => ({ ...prev, isOpen: false }))}
        onConfirm={confirmConfig.onConfirm}
        isLoading={!!actionLoading}
      />

      {/* Create Rider Modal */}
      {isModalOpen && (
        <CreateRiderModal
          onClose={() => {
            setIsModalOpen(false);
            loadRiders(); // Refresh the list after creating
          }}
        />
      )}
    </div>
  );
}
