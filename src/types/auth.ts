export interface OrganizationDetail {
  id: string;
  name: string;
  slug?: string | null;
  address: string;
  createdAt?: string | Date | null;
  updatedAt?: string | Date | null;
  role: string;
  isActive: boolean;
  isSuspended: boolean;
  joinedAt?: string | Date | null;
  invitationStatus?: "pending" | "completed" | "cancelled" | "expired";
}

export interface AuthUser {
  id: string;
  email: string;
  name: string;
  role: "owner" | "rider" | "customer";
  emailVerified: boolean;
  registrationCompleted?: boolean;
  phoneNumber?: string;
  defaultOrgId?: string;
  defaultOrgRole?: string;
  createdAt?: string;
  lastLoginAt?: string;

  // Organization details for owners/riders
  organizations?: OrganizationDetail[];
  // For backward compatibility - keep these as aliases to the first org
  orgId?: string;
  orgRole?: string;
}

export interface OrganizationMembership {
  orgId: string;
  role: "owner" | "rider" | "customer";
  isActive: boolean;
  joinedAt: string;
}

export interface Organization {
  id: string;
  name: string;
  createdAt?: string;
}

export interface LoginResponse {
  user: AuthUser;
  accessToken: string;
  expiresIn: number;
}

export interface BusinessRegistrationData {
  email: string;
  password: string;
  name: string;
  businessName: string;
  businessAddress: string;
  phoneNumber: string;
}

export interface CustomerRegistrationData {
  email: string;
  password: string;
  name: string;
  phoneNumber: string;
}

export interface LoginData {
  email: string;
  password: string;
}

export interface UpdateProfileData {
  name?: string;
  email?: string;
  phoneNumber?: string;
}

export interface ChangePasswordData {
  currentPassword: string;
  newPassword: string;
}

export interface ForgotPasswordData {
  email: string;
}

export interface ResetPasswordData {
  email: string;
  otp: string;
  newPassword: string;
}

export interface VerifyEmailData {
  email: string;
  otp: string;
}

export interface ResendOTPData {
  email: string;
}

export interface RiderCreationData {
  riderEmail: string;
  riderName: string;
}

export interface CustomerCreationData {
  customerEmail: string;
  customerName?: string;
}

export interface CompleteRiderRegistrationData {
  token: string;
  password: string;
  phoneNumber: string;
}

export interface CompleteCustomerRegistrationData {
  token: string;
  password: string;
  phoneNumber?: string; // Add this
}

export interface AcceptInvitationData {
  token: string;
}

export interface AcceptCustomerInvitationData {
  token: string;
}

export interface CustomerInvitationActions {
  acceptCustomerInvitation: (
    data: AcceptCustomerInvitationData,
  ) => Promise<AuthUser>;
  resendCustomerInvitation: (customerId: string) => Promise<any>;
  cancelCustomerInvitation: (customerId: string) => Promise<any>;
  isAcceptingCustomerInvitation?: boolean; // NEW state
  isCancelingCustomerInvitation?: boolean; // NEW state
}

export interface AuthStore {
  // State
  authUser: AuthUser | null;
  organizations: OrganizationMembership[] | null;
  currentOrganization: Organization | null;
  isCheckingAuth: boolean;
  isSigningUp: boolean;
  isLoggingIn: boolean;
  isUpdating: boolean;
  isChangingPassword: boolean;
  isSendingResetEmail: boolean;
  isResettingPassword: boolean;
  isVerifyingEmail: boolean;
  isCreatingRider: boolean;
  isCreatingCustomer: boolean;
  isCompletingRegistration: boolean;
  isResendingCustomerInvitation: boolean; // NEW
  isAcceptingCustomerInvitation: boolean; // NEW
  isCancelingCustomerInvitation: boolean; // NEW

  // Actions
  checkAuth: () => Promise<boolean>;
  registerBusiness: (
    data: BusinessRegistrationData,
  ) => Promise<{ user: AuthUser; organization: Organization }>;
  login: (data: LoginData) => Promise<LoginResponse>;
  logout: () => Promise<void>;
  updateProfile: (data: UpdateProfileData) => Promise<AuthUser>;
  changePassword: (data: ChangePasswordData) => Promise<void>;
  forgotPassword: (data: ForgotPasswordData) => Promise<void>;
  resetPassword: (data: ResetPasswordData) => Promise<AuthUser>;
  verifyEmail: (data: VerifyEmailData) => Promise<void>;
  resendOTP: (data: ResendOTPData) => Promise<void>;
  refreshToken: () => Promise<{ accessToken: string; expiresIn: number }>;

  // Organization-specific actions
  createRider: (data: RiderCreationData) => Promise<any>;
  createCustomer: (data: CustomerCreationData) => Promise<any>;
  resendRiderInvitation: (riderId: string) => Promise<any>;
  resendCustomerInvitation: (customerId: string) => Promise<any>; // NEW
  resendCustomerRegistrationLink: (customerId: string) => Promise<any>; // NEW
  cancelRiderInvitation: (riderId: string) => Promise<any>;
  cancelCustomerInvitation: (customerId: string) => Promise<any>; // NEW
  completeRiderRegistration: (
    data: CompleteRiderRegistrationData,
  ) => Promise<AuthUser>;
  completeCustomerRegistration: (
    data: CompleteCustomerRegistrationData,
  ) => Promise<AuthUser>;
  acceptInvitation: (data: AcceptInvitationData) => Promise<AuthUser>;
  acceptCustomerInvitation: (
    data: AcceptCustomerInvitationData,
  ) => Promise<AuthUser>; // NEW

  // Helper actions
  clearAuth: () => void;
  setCurrentOrganization: (orgId: string) => void;
}
