"use client";

import { useState, useEffect } from "react";
import {
  Mail,
  Phone,
  Calendar,
  Clock,
  UserPlus,
  CheckCircle,
  XCircle,
  AlertCircle,
  X,
  Users,
  RotateCw,
  Trash2,
  Lock,
  Unlock,
} from "lucide-react";
import { useCustomerStore, useAuthStore } from "@/stores";
import { CreateCustomerModal } from "@/components/customers/CreateCustomerModal";
import { ConfirmationModal } from "@/components/ui/ConfirmationModal";

export default function CustomersPage() {
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
    customers,
    isLoadingCustomers,
    customerStats,
    getAllCustomers,
    getCustomerStats,
  } = useCustomerStore();

  const { resendCustomerInvitation } = useAuthStore();

  useEffect(() => {
    loadCustomers();
    loadStats();
  }, []);

  const loadCustomers = async () => {
    try {
      setError(null);
      await getAllCustomers();
    } catch (err: any) {
      setError(err.message || "Failed to load customers");
    }
  };

  const loadStats = async () => {
    try {
      await getCustomerStats();
    } catch (err: any) {
      console.error("Failed to load stats:", err);
    }
  };

  const handleResendInvitation = async (customerId: string) => {
    try {
      setActionLoading(`resend-${customerId}`);

      await resendCustomerInvitation(customerId);

      setSuccess("Invitation resent successfully");
      setTimeout(() => setSuccess(null), 3000);
    } catch (err: any) {
      setError(err.message || "Failed to resend invitation");
    } finally {
      setActionLoading(null);
    }
  };

  const formatDate = (dateString: string | null) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString("en-US", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  const getStatusDisplay = (customer: any) => {
    const registrationStatus = customer.registrationStatus;

    if (registrationStatus === "pending") {
      return {
        text: "Pending",
        color: "bg-yellow-50 text-yellow-600 border-yellow-100",
        icon: <Clock size={12} />,
      };
    }

    if (
      registrationStatus === "cancelled" ||
      registrationStatus === "expired"
    ) {
      return {
        text: "Cancelled",
        color: "bg-red-50 text-red-600 border-red-100",
        icon: <XCircle size={12} />,
      };
    }

    if (customer.emailVerified && customer.registrationCompleted) {
      return {
        text: "Active",
        color: "bg-green-50 text-green-600 border-green-100",
        icon: <CheckCircle size={12} />,
      };
    }

    return {
      text: "Inactive",
      color: "bg-gray-50 text-gray-600 border-gray-100",
      icon: <XCircle size={12} />,
    };
  };

  // Calculate stats from customers if not available from API
  const calculatedStats = {
    total: customers.length,
    active: customers.filter(
      (c) =>
        c.emailVerified &&
        c.registrationCompleted &&
        c.registrationStatus === "completed"
    ).length,
    pending: customers.filter((c) => c.registrationStatus === "pending").length,
    verified: customers.filter((c) => c.emailVerified).length,
  };

  const stats = customerStats || calculatedStats;

  const isInvitationExpired = (createdAt: string | null) => {
    if (!createdAt) return false;
    const createdDate = new Date(createdAt);
    const expiryDate = new Date(createdDate.getTime() + 24 * 60 * 60 * 1000); // 24 hours for customer registration links
    return new Date() > expiryDate;
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-6 md:px-0">
      {/* Title Header */}
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8">
        <section className="text-center md:text-left">
          <h2 className="text-2xl font-semibold text-[#2D3748]">Customers</h2>
          <p className="text-gray-400 text-sm mt-1">
            View all customers on the platform
          </p>
        </section>

        {/* Create Customer Button */}
        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center justify-center cursor-pointer gap-2 px-6 py-3.5 bg-[#FF7B7B] hover:bg-[#ff6a6a] text-white text-sm rounded-xl transition-all shadow-lg shadow-red-100 active:scale-95 w-full md:w-auto"
        >
          <UserPlus size={18} />
          <span>Create a new Customer</span>
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
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm font-medium">
                Total Customers
              </p>
              <p className="text-2xl font-bold text-gray-800 mt-1">
                {stats.total}
              </p>
            </div>
            <div className="bg-blue-50 p-3 rounded-xl">
              <Users className="text-blue-500" size={24} />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm font-medium">Active</p>
              <p className="text-2xl font-bold text-green-600 mt-1">
                {stats.active}
              </p>
            </div>
            <div className="bg-green-50 p-3 rounded-xl">
              <CheckCircle className="text-green-500" size={24} />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm font-medium">
                Email Verified
              </p>
              <p className="text-2xl font-bold text-blue-600 mt-1">
                {stats.verified}
              </p>
            </div>
            <div className="bg-blue-50 p-3 rounded-xl">
              <Mail className="text-blue-500" size={24} />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm font-medium">Pending</p>
              <p className="text-2xl font-bold text-yellow-600 mt-1">
                {stats.pending}
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
        {isLoadingCustomers ? (
          <div className="p-8 space-y-4">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="h-20 bg-gray-50 rounded-2xl animate-pulse"
              />
            ))}
          </div>
        ) : customers.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 px-6 text-center">
            <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mb-4 text-gray-300">
              <Users size={32} />
            </div>
            <p className="text-gray-500 text-lg font-semibold">
              No customers found
            </p>
            <p className="text-gray-400 text-sm max-w-xs mt-1">
              Customers will appear here when they register.
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
                    Contact
                  </th>
                  <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-gray-400">
                    Status
                  </th>
                  <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-gray-400">
                    Created
                  </th>
                  <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-gray-400 text-right">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="flex flex-col md:table-row-group gap-4 md:gap-0 p-1 md:p-0">
                {customers.map((customer) => {
                  const status = getStatusDisplay(customer);
                  const isActionLoading = actionLoading === customer.id;
                  const isPending = customer.registrationStatus === "pending";
                  const isExpired = isInvitationExpired(customer.createdAt);

                  return (
                    <tr
                      key={customer.id}
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
                                : customer.emailVerified
                                ? "bg-green-100 text-green-600"
                                : "bg-gray-100 text-gray-600"
                            }`}
                          >
                            {customer.name?.[0] ||
                              customer.email?.[0]?.toUpperCase() ||
                              "C"}
                          </div>
                          <div className="min-w-0">
                            <p className="font-semibold text-gray-800 text-base md:text-sm truncate">
                              {customer.name || "No Name"}
                            </p>
                            <p className="text-xs text-gray-400 truncate">
                              {customer.email}
                            </p>
                          </div>
                        </div>
                      </td>

                      {/* Contact Info */}
                      <td className="px-6 py-2 md:px-8 md:py-6">
                        <div className="flex flex-col gap-2">
                          <div className="flex items-center gap-2 text-gray-600 md:text-gray-700 text-sm">
                            <Phone
                              size={14}
                              className="md:hidden text-gray-400"
                            />
                            {customer.phoneNumber || "No Phone"}
                          </div>
                          {customer.email && (
                            <div className="flex items-center gap-2 text-gray-500 text-xs">
                              <Mail size={12} className="md:hidden" />
                              <span className="truncate">{customer.email}</span>
                            </div>
                          )}
                        </div>
                      </td>

                      {/* Status Badge */}
                      <td className="px-6 py-3 md:px-8 md:py-6">
                        <div className="flex flex-col gap-1">
                          <div className="flex items-center gap-2">
                            <span
                              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[11px] font-bold border uppercase tracking-wider ${status.color}`}
                            >
                              {status.icon}
                              {status.text}
                            </span>
                          </div>
                          {customer.emailVerified && (
                            <span className="text-xs text-green-600 font-medium">
                              Email Verified
                            </span>
                          )}
                        </div>
                      </td>

                      {/* Created Date */}
                      <td className="px-6 py-2 md:px-8 md:py-6">
                        <div className="flex items-center gap-2 text-gray-500 md:text-gray-700 font-medium text-xs md:text-sm">
                          <Calendar
                            size={14}
                            className="md:hidden text-gray-400"
                          />
                          {formatDate(customer.createdAt)}
                        </div>
                      </td>

                      {/* Actions */}
                      <td className="px-6 py-4 md:px-8 md:py-6 bg-gray-50/50 md:bg-transparent mt-2 md:mt-0 rounded-b-2xl md:rounded-none">
                        <div className="flex items-center justify-end gap-6 md:gap-4 flex-wrap">
                          {isPending ? (
                            <button
                              onClick={() =>
                                handleResendInvitation(customer.id)
                              }
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
                          ) : (
                            // Placeholder for future actions (like suspend, remove, etc.)
                            <div className="text-xs text-gray-400 italic">
                              {customer.emailVerified ? "Active" : "Inactive"}
                            </div>
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

      {/* Create Customer Modal */}
      {isModalOpen && (
        <CreateCustomerModal
          onClose={() => {
            setIsModalOpen(false);
            loadStats();
            loadCustomers();
          }}
        />
      )}
    </div>
  );
}
