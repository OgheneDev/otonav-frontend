"use client";

import { useState, useEffect } from "react";
import { useRiderStore } from "@/stores";
import { ConfirmationModal } from "@/components/ui/ConfirmationModal";
import { Alert } from "@/components/ui/Alert";
import {
  RidersHeader,
  RidersStats,
  LoadingSkeleton,
  EmptyState,
  RidersTable,
  CreateRiderModal,
} from "./components";
import { useRiders } from "@/app/dashboard/riders/hooks/useRiders";

export default function RidersPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { riders, isLoadingRiders } = useRiderStore();

  const {
    actionLoading,
    error,
    success,
    confirmConfig,
    loadRiders,
    handleResendInvitation,
    handleCancelInvitation,
    handleSuspendToggle,
    handleRemoveRider,
    setError,
    setSuccess,
    setConfirmConfig,
  } = useRiders();

  useEffect(() => {
    loadRiders();
  }, [loadRiders]);

  const handleModalClose = () => {
    setIsModalOpen(false);
    loadRiders(); // Refresh the list after creating
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-6 md:px-0">
      {/* Header */}
      <RidersHeader onCreateRider={() => setIsModalOpen(true)} />

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
      <RidersStats riders={riders} />

      {/* Main Content */}
      {isLoadingRiders ? (
        <LoadingSkeleton />
      ) : riders.length === 0 ? (
        <EmptyState onCreateRider={() => setIsModalOpen(true)} />
      ) : (
        <RidersTable
          riders={riders}
          actionLoading={actionLoading}
          onResendInvitation={handleResendInvitation}
          onCancelInvitation={handleCancelInvitation}
          onSuspendToggle={handleSuspendToggle}
          onRemoveRider={handleRemoveRider}
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

      {/* Create Rider Modal */}
      {isModalOpen && <CreateRiderModal onClose={handleModalClose} />}
    </div>
  );
}
