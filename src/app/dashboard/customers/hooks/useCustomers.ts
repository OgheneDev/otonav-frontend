import { useState, useCallback } from "react";
import { useCustomerStore, useAuthStore } from "@/stores";
import type { ConfirmationConfig } from "../utils/types";

export function useCustomers() {
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [confirmConfig, setConfirmConfig] = useState<ConfirmationConfig>({
    isOpen: false,
    title: "",
    message: "",
    confirmText: "",
    variant: "warning",
    onConfirm: () => {},
  });

  const { getAllCustomers } = useCustomerStore();
  const {
    resendCustomerInvitation,
    resendCustomerRegistrationLink,
    cancelCustomerInvitation,
  } = useAuthStore();

  const loadCustomers = useCallback(async () => {
    try {
      setError(null);
      await getAllCustomers();
    } catch (err: any) {
      setError(err.message || "Failed to load customers");
    }
  }, [getAllCustomers]);

  const handleResendInvitation = useCallback(
    async (customerId: string) => {
      try {
        setActionLoading(`resend-invite-${customerId}`);
        await resendCustomerInvitation(customerId);
        setSuccess("Invitation resent successfully");
        setTimeout(() => setSuccess(null), 3000);
      } catch (err: any) {
        setError(err.message || "Failed to resend invitation");
      } finally {
        setActionLoading(null);
      }
    },
    [resendCustomerInvitation],
  );

  const handleResendRegistration = useCallback(
    async (customerId: string) => {
      try {
        setActionLoading(`resend-reg-${customerId}`);
        await resendCustomerRegistrationLink(customerId);
        setSuccess("Registration link resent successfully");
        setTimeout(() => setSuccess(null), 3000);
      } catch (err: any) {
        setError(err.message || "Failed to resend registration link");
      } finally {
        setActionLoading(null);
      }
    },
    [resendCustomerRegistrationLink],
  );

  const handleCancelInvitation = useCallback(
    async (customerId: string) => {
      try {
        setActionLoading(`cancel-${customerId}`);
        await cancelCustomerInvitation(customerId);
        setSuccess("Invitation cancelled successfully");
        setTimeout(() => setSuccess(null), 3000);
        // Reload customers after cancellation
        await getAllCustomers();
      } catch (err: any) {
        setError(err.message || "Failed to cancel invitation");
      } finally {
        setActionLoading(null);
      }
    },
    [cancelCustomerInvitation, getAllCustomers],
  );

  const showCancelConfirmation = useCallback(
    (customerId: string, customerName: string) => {
      setConfirmConfig({
        isOpen: true,
        title: "Cancel Invitation",
        message: `Are you sure you want to cancel the invitation for ${customerName}? This action cannot be undone.`,
        confirmText: "Cancel Invitation",
        variant: "danger",
        onConfirm: () => handleCancelInvitation(customerId),
      });
    },
    [handleCancelInvitation],
  );

  return {
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
    setActionLoading,
  };
}
