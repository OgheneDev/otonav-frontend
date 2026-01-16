import { useState, useCallback } from "react";
import { useRiderStore } from "@/stores";
import type { ConfirmationConfig } from "../../../../utils/types";

export function useRiders() {
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

  const {
    getAllRiders,
    suspendRider,
    unsuspendRider,
    removeRider,
    resendRiderInvitation,
    cancelRiderInvitation,
  } = useRiderStore();

  const loadRiders = useCallback(async () => {
    try {
      setError(null);
      await getAllRiders({
        includeSuspended: true,
        includeInactive: true,
        includePending: true,
      });
    } catch (err: any) {
      setError(err.message || "Failed to load riders");
    }
  }, [getAllRiders]);

  const handleResendInvitation = useCallback(
    async (riderId: string) => {
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
    },
    [resendRiderInvitation]
  );

  const handleCancelInvitation = useCallback(
    (riderId: string) => {
      const executeCancelInvitation = async () => {
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

      setConfirmConfig({
        isOpen: true,
        title: "Cancel Invitation",
        message:
          "Are you sure you want to cancel this invitation? The rider will not be able to complete registration.",
        confirmText: "Cancel Invitation",
        variant: "warning",
        onConfirm: executeCancelInvitation,
      });
    },
    [cancelRiderInvitation]
  );

  const handleSuspendToggle = useCallback(
    (riderId: string, isSuspended: boolean) => {
      const executeSuspendAction = async (isCurrentlySuspended: boolean) => {
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

      if (isSuspended) {
        // Unsuspend immediately without confirmation
        executeSuspendAction(true);
      } else {
        // Suspend requires confirmation
        setConfirmConfig({
          isOpen: true,
          title: "Suspend Rider",
          message:
            "Are you sure you want to suspend this rider? They will not be able to accept new deliveries during this period.",
          confirmText: "Suspend Rider",
          variant: "warning",
          onConfirm: () => executeSuspendAction(false),
        });
      }
    },
    [suspendRider, unsuspendRider]
  );

  const handleRemoveRider = useCallback(
    (riderId: string, isPending: boolean = false) => {
      const executeRemoveAction = async () => {
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

      setConfirmConfig({
        isOpen: true,
        title: isPending ? "Cancel Invitation" : "Remove Rider",
        message: isPending
          ? "This will cancel the invitation. The rider will not be able to complete registration."
          : "This action is permanent. All data associated with this rider will be archived and they will lose access immediately.",
        confirmText: isPending ? "Cancel" : "Remove",
        variant: isPending ? "warning" : "danger",
        onConfirm: executeRemoveAction,
      });
    },
    [removeRider]
  );

  return {
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
    setActionLoading,
  };
}
