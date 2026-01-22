"use client";

import { useState, useEffect } from "react";
import { useCustomerStore } from "@/stores";
import { CreateCustomerModal } from "@/components/customers/CreateCustomerModal";
import { ConfirmationModal } from "@/components/ui/ConfirmationModal";
import { Alert } from "@/components/ui/Alert";
import {
  CustomersHeader,
  CustomersStats,
  LoadingSkeleton,
  CustomersTable,
} from "./components";
import { EmptyState } from "./components/EmptyState";
import { useCustomers } from "./hooks/useCustomers";

export default function CustomersPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { customers, isLoadingCustomers } = useCustomerStore();
  const {
    actionLoading,
    error,
    success,
    confirmConfig,
    loadCustomers,
    handleResendInvitation,
    handleResendRegistration,
    showCancelConfirmation,
    setError,
    setSuccess,
    setConfirmConfig,
  } = useCustomers();

  useEffect(() => {
    loadCustomers();
  }, []);

  const handleModalClose = () => {
    setIsModalOpen(false);
    loadCustomers();
  };

  // Calculate stats from customers if not available from API
  const calculatedStats = {
    total: customers.length,
    active: customers.filter(
      (c) => c.emailVerified && c.registrationStatus === "completed",
    ).length,
    pending: customers.filter((c) => c.registrationStatus === "pending").length,
    verified: customers.filter((c) => c.emailVerified).length,
  };

  const stats = calculatedStats;

  return (
    <div className="max-w-7xl mx-auto px-4 py-6 md:px-0">
      {/* Header */}
      <CustomersHeader onCreateCustomer={() => setIsModalOpen(true)} />

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

      {/* Stats */}
      <CustomersStats stats={stats} />

      {/* Main Content */}
      {isLoadingCustomers ? (
        <LoadingSkeleton />
      ) : customers.length === 0 ? (
        <EmptyState onCreateCustomer={() => setIsModalOpen(true)} />
      ) : (
        <CustomersTable
          customers={customers}
          actionLoading={actionLoading}
          onResendInvitation={handleResendInvitation}
          onResendRegistration={handleResendRegistration}
          onCancelInvitation={(customerId: string) =>
            Promise.resolve(showCancelConfirmation(customerId, ""))
          }
        />
      )}

      {/* Confirmation Modal */}
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
      {isModalOpen && <CreateCustomerModal onClose={handleModalClose} />}
    </div>
  );
}
