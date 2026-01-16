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
  const { resendCustomerInvitation } = useAuthStore();

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
        setActionLoading(`resend-${customerId}`);
        await resendCustomerInvitation(customerId);
        setSuccess("Invitation resent successfully");
        setTimeout(() => setSuccess(null), 3000);
      } catch (err: any) {
        setError(err.message || "Failed to resend invitation");
      } finally {
        setActionLoading(null);
      }
    },
    [resendCustomerInvitation]
  );

  return {
    actionLoading,
    error,
    success,
    confirmConfig,
    loadCustomers,
    handleResendInvitation,
    setError,
    setSuccess,
    setConfirmConfig,
    setActionLoading,
  };
}
