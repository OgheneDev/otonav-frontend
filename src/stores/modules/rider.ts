import { create } from "zustand";
import axiosInstance from "@/api/axios";
import {
  Rider,
  RiderSuspensionInput,
  RiderRemovalInput,
  RidersResponse,
  SuspensionStatusResponse,
  OperationResponse,
  RemoveRiderResponse,
} from "@/types/rider";
import { RiderStore } from "@/types/rider";

export const useRiderStore = create<RiderStore>((set, get) => ({
  // Initial state
  riders: [],
  currentRider: null,
  riderOrganizations: null,
  suspensionStatus: null,

  // Loading states
  isLoadingRiders: false,
  isLoadingRider: false,
  isLoadingRiderOrgs: false,
  isSuspendingRider: false,
  isUnsuspendingRider: false,
  isRemovingRider: false,
  isDeactivatingRider: false,
  isReactivatingRider: false,
  isCheckingSuspension: false,
  isResendingInvitation: false,
  isCancellingInvitation: false,

  // Get all riders in organization (UPDATED to include pending)
  getAllRiders: async (params = {}) => {
    try {
      set({ isLoadingRiders: true });

      const queryParams = new URLSearchParams();
      if (params.includeSuspended !== undefined) {
        queryParams.append(
          "includeSuspended",
          params.includeSuspended.toString()
        );
      }
      if (params.includeInactive !== undefined) {
        queryParams.append(
          "includeInactive",
          params.includeInactive.toString()
        );
      }
      if (params.includePending !== undefined) {
        queryParams.append("includePending", params.includePending.toString());
      }

      const url = `/riders${
        queryParams.toString() ? `?${queryParams.toString()}` : ""
      }`;
      const response = await axiosInstance.get<RidersResponse>(url);

      if (!response.data.success) {
        throw new Error("Failed to fetch riders");
      }

      set({
        riders: response.data.data || [],
        isLoadingRiders: false,
      });

      return response.data;
    } catch (error: any) {
      set({ isLoadingRiders: false });

      if (error.response?.data?.message) {
        throw new Error(error.response.data.message);
      }
      throw error;
    }
  },

  // Get single rider by ID
  getRiderById: async (riderId: string) => {
    try {
      set({ isLoadingRider: true });

      if (!riderId) {
        throw new Error("Rider ID is required");
      }

      const response = await axiosInstance.get<{
        success: boolean;
        data: Rider;
      }>(`/riders/${riderId}`);

      if (!response.data.success || !response.data.data) {
        throw new Error("Failed to fetch rider");
      }

      set({
        currentRider: response.data.data,
        isLoadingRider: false,
      });

      return response.data.data;
    } catch (error: any) {
      set({ isLoadingRider: false });

      if (error.response?.data?.message) {
        throw new Error(error.response.data.message);
      }
      throw error;
    }
  },

  // Resend invitation to rider
  resendRiderInvitation: async (riderId: string) => {
    try {
      set({ isResendingInvitation: true });

      if (!riderId) {
        throw new Error("Rider ID is required");
      }

      const response = await axiosInstance.post<OperationResponse>(
        `/auth/rider/resend-invitation`,
        { riderId }
      );

      if (!response.data.success) {
        throw new Error("Failed to resend invitation");
      }

      // Refresh the rider list
      await get().getAllRiders({
        includeSuspended: true,
        includeInactive: true,
      });

      set({ isResendingInvitation: false });

      return response.data;
    } catch (error: any) {
      set({ isResendingInvitation: false });

      if (error.response?.data?.message) {
        throw new Error(error.response.data.message);
      }
      throw error;
    }
  },

  // Cancel rider invitation
  cancelRiderInvitation: async (riderId: string) => {
    try {
      set({ isCancellingInvitation: true });

      if (!riderId) {
        throw new Error("Rider ID is required");
      }

      const response = await axiosInstance.post<OperationResponse>(
        `/auth/rider/cancel-invitation`,
        { riderId }
      );

      if (!response.data.success) {
        throw new Error("Failed to cancel invitation");
      }

      // Remove rider from local state
      const { riders } = get();
      const updatedRiders = riders.filter((rider) => rider.id !== riderId);

      set({
        riders: updatedRiders,
        currentRider:
          get().currentRider?.id === riderId ? null : get().currentRider,
        isCancellingInvitation: false,
      });

      return response.data;
    } catch (error: any) {
      set({ isCancellingInvitation: false });

      if (error.response?.data?.message) {
        throw new Error(error.response.data.message);
      }
      throw error;
    }
  },

  // Suspend rider
  suspendRider: async (riderId: string, data?: RiderSuspensionInput) => {
    try {
      set({ isSuspendingRider: true });

      if (!riderId) {
        throw new Error("Rider ID is required");
      }

      const response = await axiosInstance.post<OperationResponse>(
        `/riders/${riderId}/suspend`,
        data || {}
      );

      if (!response.data.success) {
        throw new Error("Failed to suspend rider");
      }

      // Update local state if rider exists in the list
      const { riders } = get();
      const updatedRiders = riders.map((rider) => {
        if (rider.id === riderId && rider.orgMembership) {
          return {
            ...rider,
            orgMembership: {
              ...rider.orgMembership,
              isSuspended: true,
              suspensionReason: data?.reason || null,
              suspensionExpires: data?.suspensionDurationDays
                ? new Date(
                    Date.now() +
                      data.suspensionDurationDays * 24 * 60 * 60 * 1000
                  ).toISOString()
                : null,
            },
          };
        }
        return rider;
      });

      set({
        riders: updatedRiders,
        isSuspendingRider: false,
      });

      return response.data;
    } catch (error: any) {
      set({ isSuspendingRider: false });

      if (error.response?.data?.message) {
        throw new Error(error.response.data.message);
      }
      throw error;
    }
  },

  // Unsuspend rider
  unsuspendRider: async (riderId: string) => {
    try {
      set({ isUnsuspendingRider: true });

      if (!riderId) {
        throw new Error("Rider ID is required");
      }

      const response = await axiosInstance.post<OperationResponse>(
        `/riders/${riderId}/unsuspend`
      );

      if (!response.data.success) {
        throw new Error("Failed to unsuspend rider");
      }

      // Update local state
      const { riders } = get();
      const updatedRiders = riders.map((rider) => {
        if (rider.id === riderId && rider.orgMembership) {
          return {
            ...rider,
            orgMembership: {
              ...rider.orgMembership,
              isSuspended: false,
              suspensionReason: null,
              suspensionExpires: null,
            },
          };
        }
        return rider;
      });

      set({
        riders: updatedRiders,
        isUnsuspendingRider: false,
      });

      return response.data;
    } catch (error: any) {
      set({ isUnsuspendingRider: false });

      if (error.response?.data?.message) {
        throw new Error(error.response.data.message);
      }
      throw error;
    }
  },

  // Remove rider from organization (hard delete)
  removeRider: async (riderId: string, data?: RiderRemovalInput) => {
    try {
      set({ isRemovingRider: true });

      if (!riderId) {
        throw new Error("Rider ID is required");
      }

      const response = await axiosInstance.delete<RemoveRiderResponse>(
        `/riders/${riderId}`,
        { data: data || {} }
      );

      if (!response.data.success) {
        throw new Error("Failed to remove rider");
      }

      // Remove from local state
      const { riders } = get();
      const updatedRiders = riders.filter((rider) => rider.id !== riderId);

      set({
        riders: updatedRiders,
        currentRider:
          get().currentRider?.id === riderId ? null : get().currentRider,
        isRemovingRider: false,
      });

      return response.data;
    } catch (error: any) {
      set({ isRemovingRider: false });

      if (error.response?.data?.message) {
        throw new Error(error.response.data.message);
      }
      throw error;
    }
  },

  // Check suspension status
  checkSuspensionStatus: async (riderId: string) => {
    try {
      set({ isCheckingSuspension: true });

      if (!riderId) {
        throw new Error("Rider ID is required");
      }

      const response = await axiosInstance.get<SuspensionStatusResponse>(
        `/riders/${riderId}/suspension-status`
      );

      if (!response.data.success) {
        throw new Error("Failed to check suspension status");
      }

      set({
        suspensionStatus: response.data.data,
        isCheckingSuspension: false,
      });

      return response.data;
    } catch (error: any) {
      set({ isCheckingSuspension: false });

      if (error.response?.data?.message) {
        throw new Error(error.response.data.message);
      }
      throw error;
    }
  },

  // Helper actions
  clearRiders: () => {
    set({
      riders: [],
      currentRider: null,
      riderOrganizations: null,
      suspensionStatus: null,
    });
  },

  setCurrentRider: (rider: Rider | null) => {
    set({ currentRider: rider });
  },
}));
