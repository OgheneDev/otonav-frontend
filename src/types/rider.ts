export interface Rider {
  id: string;
  email: string;
  name?: string | null;
  globalRole: string;
  phoneNumber?: string | null;
  profileImage?: string | null;
  emailVerified: boolean;
  lastLoginAt?: string | null;
  createdAt: string;
  registrationCompleted?: boolean | null;
  registrationStatus?: "pending" | "completed" | "cancelled" | "expired";
  orgMembership?: {
    orgId: string;
    orgName: string;
    role: string;
    isActive: boolean;
    isSuspended: boolean;
    registrationStatus: "pending" | "completed" | "cancelled" | "expired";
    invitedAt?: string | null;
    invitationSentAt?: string | null;
    joinedAt?: string | null;
    suspensionReason?: string | null;
    suspensionExpires?: string | null;
  };
}

export interface RiderSuspensionInput {
  reason?: string | null;
  notes?: string | null;
  suspensionDurationDays?: number;
}

export interface RiderRemovalInput {
  reason?: string | null;
  notes?: string | null;
}

export interface RiderDeactivationInput {
  reason?: string | null;
}

export interface RiderOrganizationsResponse {
  success: boolean;
  data: Array<{
    orgId: string;
    orgName: string;
    role: string;
    isActive: boolean;
    isSuspended: boolean;
    registrationStatus: "pending" | "completed" | "cancelled" | "expired";
    invitedAt?: string | null;
    invitationSentAt?: string | null;
    joinedAt?: string | null;
  }>;
  count: number;
}

export interface RidersResponse {
  success: boolean;
  data: Rider[];
  count: number;
  total: number;
}

export interface SuspensionStatusResponse {
  success: boolean;
  data: {
    riderId: string;
    orgId: string;
    isSuspended: boolean;
  };
}

export interface OperationResponse {
  success: boolean;
  message: string;
  data?: any;
}

export interface RemoveRiderResponse {
  success: boolean;
  message: string;
  removedFromOrg: boolean;
}

export interface RiderCreationData {
  riderEmail: string;
  riderName: string;
  // No need for organizationId - it comes from JWT context
}

export interface ErrorResponse {
  success: boolean;
  message: string;
  error?: string;
}

export interface RiderStore {
  // State
  riders: Rider[];
  currentRider: Rider | null;
  riderOrganizations: RiderOrganizationsResponse["data"] | null;
  suspensionStatus: SuspensionStatusResponse["data"] | null;

  // Loading states
  isLoadingRiders: boolean;
  isLoadingRider: boolean;
  isLoadingRiderOrgs: boolean;
  isSuspendingRider: boolean;
  isUnsuspendingRider: boolean;
  isRemovingRider: boolean;
  isDeactivatingRider: boolean;
  isReactivatingRider: boolean;
  isCheckingSuspension: boolean;
  isResendingInvitation: boolean; // NEW
  isCancellingInvitation: boolean; // NEW

  // Actions
  getAllRiders: (params?: {
    includeSuspended?: boolean;
    includeInactive?: boolean;
    includePending?: boolean; // NEW
  }) => Promise<RidersResponse>;

  getRiderById: (riderId: string) => Promise<Rider>;

  suspendRider: (
    riderId: string,
    data?: RiderSuspensionInput,
  ) => Promise<OperationResponse>;

  unsuspendRider: (riderId: string) => Promise<OperationResponse>;

  removeRider: (
    riderId: string,
    data?: RiderRemovalInput,
  ) => Promise<RemoveRiderResponse>;

  checkSuspensionStatus: (riderId: string) => Promise<SuspensionStatusResponse>;

  // NEW Actions for pending riders
  resendRiderInvitation: (riderId: string) => Promise<OperationResponse>;
  cancelRiderInvitation: (riderId: string) => Promise<OperationResponse>;

  // Helper actions
  clearRiders: () => void;
  setCurrentRider: (rider: Rider | null) => void;
}
