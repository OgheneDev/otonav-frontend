import { create } from "zustand";
import axiosInstance, { tokenStorage } from "@/api/axios";
import {
  AuthStore,
  BusinessRegistrationData,
  LoginData,
  UpdateProfileData,
  ChangePasswordData,
  ForgotPasswordData,
  ResetPasswordData,
  VerifyEmailData,
  ResendOTPData,
  RiderCreationData,
  CustomerCreationData,
  CompleteRiderRegistrationData,
  CompleteCustomerRegistrationData,
  AcceptInvitationData,
  AuthUser,
  OrganizationMembership,
  Organization,
} from "@/types/auth";

export const useAuthStore = create<AuthStore>((set, get) => ({
  // Initial state
  authUser: null,
  organizations: null,
  currentOrganization: null,
  isCheckingAuth: true,
  isSigningUp: false,
  isLoggingIn: false,
  isUpdating: false,
  isChangingPassword: false,
  isSendingResetEmail: false,
  isResettingPassword: false,
  isVerifyingEmail: false,
  isCreatingRider: false,
  isCreatingCustomer: false,
  isCompletingRegistration: false,

  // Check authentication status
  checkAuth: async (): Promise<boolean> => {
    try {
      set({ isCheckingAuth: true });

      const accessToken = tokenStorage.getAccessToken();
      if (!accessToken) {
        set({ isCheckingAuth: false });
        return false;
      }

      const response = await axiosInstance.get("/auth/profile");
      console.log("Profile:", response);

      if (response.data.success && response.data.data) {
        const user: AuthUser = response.data.data;

        set({
          authUser: user,
          isCheckingAuth: false,
        });

        // TODO: Fetch organizations separately if needed
        // const orgsResponse = await axiosInstance.get("/organizations");

        return true;
      }

      set({ isCheckingAuth: false });
      return false;
    } catch (error) {
      console.error("Auth check failed:", error);
      get().clearAuth();
      set({ isCheckingAuth: false });
      return false;
    }
  },

  // Business registration
  registerBusiness: async (data: BusinessRegistrationData) => {
    try {
      set({ isSigningUp: true });

      const response = await axiosInstance.post(
        "/auth/register/business",
        data
      );

      console.log("Register business response:", response);

      if (!response.data.success) {
        throw new Error(response.data.message || "Registration failed");
      }

      // DO NOT set authUser here - user is not fully authenticated yet
      // Instead, just return the response data
      set({ isSigningUp: false });

      return response.data;
    } catch (error: any) {
      set({ isSigningUp: false });

      if (error.response?.data?.message) {
        throw new Error(error.response.data.message);
      }
      throw error;
    }
  },

  // Login
  login: async (data: LoginData) => {
    try {
      set({ isLoggingIn: true });

      const response = await axiosInstance.post("/auth/login", data);

      if (!response.data.success || !response.data.data) {
        throw new Error(response.data.message || "Login failed");
      }

      const userData = response.data.data.user;
      const user: AuthUser = {
        id: userData.id,
        email: userData.email,
        name: userData.name,
        role: userData.role,
        emailVerified: userData.emailVerified,
        registrationCompleted: userData.registrationCompleted,
        phoneNumber: userData.phoneNumber,
        defaultOrgId: userData.defaultOrgId,
        defaultOrgRole: userData.defaultOrgRole,
        createdAt: userData.createdAt,
        lastLoginAt: userData.lastLoginAt,
      };

      const organizations: OrganizationMembership[] =
        userData.organizations || [];

      // Set current organization if user has exactly one
      if (user.defaultOrgId) {
        set({
          currentOrganization: {
            id: user.defaultOrgId,
            name: "Organization", // TODO: Fetch org name
          },
        });
      }

      set({
        authUser: user,
        organizations,
        isLoggingIn: false,
      });

      return {
        user,
        accessToken: response.data.data.accessToken,
        expiresIn: response.data.data.expiresIn,
      };
    } catch (error: any) {
      set({ isLoggingIn: false });

      if (error.response?.data?.message) {
        throw new Error(error.response.data.message);
      }
      throw error;
    }
  },

  // Logout
  logout: async () => {
    try {
      await axiosInstance.post("/auth/logout");
    } catch (error) {
      console.error("Logout API call failed:", error);
    } finally {
      get().clearAuth();
    }
  },

  // Update profile
  updateProfile: async (data: UpdateProfileData) => {
    try {
      set({ isUpdating: true });

      const response = await axiosInstance.put("/auth/profile", data);

      if (!response.data.success || !response.data.data) {
        throw new Error(response.data.message || "Profile update failed");
      }

      const userData = response.data.data;
      const user: AuthUser = {
        id: userData.id,
        email: userData.email,
        name: userData.name,
        role: userData.role,
        emailVerified: userData.emailVerified,
        phoneNumber: userData.phoneNumber,
      };

      set({
        authUser: user,
        isUpdating: false,
      });

      return user;
    } catch (error: any) {
      set({ isUpdating: false });

      if (error.response?.data?.message) {
        throw new Error(error.response.data.message);
      }
      throw error;
    }
  },

  // Change password
  changePassword: async (data: ChangePasswordData) => {
    try {
      set({ isChangingPassword: true });

      const response = await axiosInstance.put("/auth/change-password", data);

      if (!response.data.success) {
        throw new Error(response.data.message || "Password change failed");
      }

      set({ isChangingPassword: false });
    } catch (error: any) {
      set({ isChangingPassword: false });

      if (error.response?.data?.message) {
        throw new Error(error.response.data.message);
      }
      throw error;
    }
  },

  // Forgot password
  forgotPassword: async (data: ForgotPasswordData) => {
    try {
      set({ isSendingResetEmail: true });

      const response = await axiosInstance.post("/auth/forgot-password", data);

      if (!response.data.success) {
        throw new Error(response.data.message || "Failed to send reset email");
      }

      set({ isSendingResetEmail: false });
    } catch (error: any) {
      set({ isSendingResetEmail: false });

      if (error.response?.data?.message) {
        throw new Error(error.response.data.message);
      }
      throw error;
    }
  },

  // Reset password
  resetPassword: async (data: ResetPasswordData) => {
    try {
      set({ isResettingPassword: true });

      const response = await axiosInstance.post("/auth/reset-password", data);

      if (!response.data.success || !response.data.data) {
        throw new Error(response.data.message || "Password reset failed");
      }

      const userData = response.data.data;
      const user: AuthUser = {
        id: userData.id,
        email: userData.email,
        name: userData.name,
        role: userData.role,
        emailVerified: true, // Assuming reset verifies email
      };

      set({
        isResettingPassword: false,
      });

      return user;
    } catch (error: any) {
      set({ isResettingPassword: false });

      if (error.response?.data?.message) {
        throw new Error(error.response.data.message);
      }
      throw error;
    }
  },

  // Verify email
  verifyEmail: async (data: VerifyEmailData) => {
    try {
      set({ isVerifyingEmail: true });

      const response = await axiosInstance.post("/auth/verify-email", data);

      if (!response.data.success) {
        throw new Error(response.data.message || "Email verification failed");
      }

      // Update user email verification status
      const currentUser = get().authUser;
      if (currentUser) {
        set({
          authUser: { ...currentUser, emailVerified: true },
          isVerifyingEmail: false,
        });
      } else {
        set({ isVerifyingEmail: false });
      }
    } catch (error: any) {
      set({ isVerifyingEmail: false });

      if (error.response?.data?.message) {
        throw new Error(error.response.data.message);
      }
      throw error;
    }
  },

  // Resend OTP
  resendOTP: async (data: ResendOTPData) => {
    try {
      const response = await axiosInstance.post("/auth/resend-otp", data);

      if (!response.data.success) {
        throw new Error(response.data.message || "Failed to resend OTP");
      }
    } catch (error: any) {
      if (error.response?.data?.message) {
        throw new Error(error.response.data.message);
      }
      throw error;
    }
  },

  // Refresh token
  refreshToken: async () => {
    try {
      const response = await axiosInstance.post("/auth/refresh-token");

      if (!response.data.success || !response.data.data) {
        throw new Error(response.data.message || "Token refresh failed");
      }

      return {
        accessToken: response.data.data.accessToken,
        expiresIn: response.data.data.expiresIn,
      };
    } catch (error: any) {
      if (error.response?.data?.message) {
        throw new Error(error.response.data.message);
      }
      throw error;
    }
  },

  // Create rider (owner only)
  createRider: async (data: { riderEmail: string; riderName: string }) => {
    try {
      set({ isCreatingRider: true });

      console.log("Sending create rider request:", data);

      const response = await axiosInstance.post("/auth/rider/create", {
        riderEmail: data.riderEmail,
        riderName: data.riderName,
        // orgId is automatically included from the user's JWT token context
      });

      console.log("Create rider response:", response.data);

      if (!response.data.success) {
        throw new Error(response.data.message || "Failed to create rider");
      }

      set({ isCreatingRider: false });

      // Return the response data which includes emailType
      return response.data.data;
    } catch (error: any) {
      set({ isCreatingRider: false });

      console.error("Create rider error details:", error);

      // Handle specific error cases
      if (error.response?.data) {
        const { message, errors } = error.response.data;

        if (errors) {
          // Handle validation errors
          const errorMessages = Object.values(errors).flat();
          throw new Error(errorMessages.join(", "));
        }

        if (message) {
          throw new Error(message);
        }
      }

      if (error.message) {
        throw error;
      }

      throw new Error("Failed to create rider. Please try again.");
    }
  },

  // Create customer (owner only)
  createCustomer: async (data: CustomerCreationData) => {
    try {
      set({ isCreatingCustomer: true });

      const response = await axiosInstance.post("/auth/customer/create", data);

      if (!response.data.success) {
        throw new Error(response.data.message || "Failed to create customer");
      }

      set({ isCreatingCustomer: false });
      return response.data.data;
    } catch (error: any) {
      set({ isCreatingCustomer: false });

      if (error.response?.data?.message) {
        throw new Error(error.response.data.message);
      }
      throw error;
    }
  },

  // Complete rider registration
  completeRiderRegistration: async (data: CompleteRiderRegistrationData) => {
    try {
      set({ isCompletingRegistration: true });

      const response = await axiosInstance.post(
        "/auth/rider/complete-registration",
        data
      );

      if (!response.data.success || !response.data.data) {
        throw new Error(
          response.data.message || "Registration completion failed"
        );
      }

      const userData = response.data.data;
      const user: AuthUser = {
        id: userData.id,
        email: userData.email,
        name: userData.name,
        role: "rider",
        emailVerified: userData.emailVerified,
        registrationCompleted: userData.registrationCompleted,
        phoneNumber: userData.phoneNumber,
      };

      set({
        authUser: user,
        isCompletingRegistration: false,
      });

      return user;
    } catch (error: any) {
      set({ isCompletingRegistration: false });

      if (error.response?.data?.message) {
        throw new Error(error.response.data.message);
      }
      throw error;
    }
  },

  resendRiderInvitation: async (riderId: string) => {
    try {
      const response = await axiosInstance.post(
        "/auth/rider/resend-invitation",
        {
          riderId,
        }
      );

      if (!response.data.success) {
        throw new Error(response.data.message || "Failed to resend invitation");
      }

      return response.data;
    } catch (error: any) {
      if (error.response?.data?.message) {
        throw new Error(error.response.data.message);
      }
      throw error;
    }
  },

  // Cancel rider invitation
  cancelRiderInvitation: async (riderId: string) => {
    try {
      const response = await axiosInstance.post(
        "/auth/rider/cancel-invitation",
        {
          riderId,
        }
      );

      if (!response.data.success) {
        throw new Error(response.data.message || "Failed to cancel invitation");
      }

      return response.data;
    } catch (error: any) {
      if (error.response?.data?.message) {
        throw new Error(error.response.data.message);
      }
      throw error;
    }
  },

  // Complete customer registration
  completeCustomerRegistration: async (
    data: CompleteCustomerRegistrationData
  ) => {
    try {
      set({ isCompletingRegistration: true });

      const response = await axiosInstance.post(
        "/auth/customer/complete-registration",
        data
      );

      if (!response.data.success || !response.data.data) {
        throw new Error(
          response.data.message || "Registration completion failed"
        );
      }

      const userData = response.data.data;
      const user: AuthUser = {
        id: userData.id,
        email: userData.email,
        name: userData.name,
        role: "customer",
        emailVerified: userData.emailVerified,
        registrationCompleted: userData.registrationCompleted,
        phoneNumber: userData.phoneNumber, // Add phone number
      };

      set({
        authUser: user,
        isCompletingRegistration: false,
      });

      return user;
    } catch (error: any) {
      set({ isCompletingRegistration: false });

      if (error.response?.data?.message) {
        throw new Error(error.response.data.message);
      }
      throw error;
    }
  },

  // Accept invitation
  acceptInvitation: async (data: AcceptInvitationData) => {
    try {
      set({ isCompletingRegistration: true });

      const response = await axiosInstance.post(
        "/auth/invitation/accept",
        data
      );

      if (!response.data.success || !response.data.data) {
        throw new Error(response.data.message || "Failed to accept invitation");
      }

      const userData = response.data.data;
      const user: AuthUser = {
        id: userData.id,
        email: userData.email,
        name: userData.name,
        role: "rider",
        emailVerified: true, // Assuming rider is already verified
      };

      set({
        authUser: user,
        isCompletingRegistration: false,
      });

      return user;
    } catch (error: any) {
      set({ isCompletingRegistration: false });

      if (error.response?.data?.message) {
        throw new Error(error.response.data.message);
      }
      throw error;
    }
  },

  // Helper actions
  clearAuth: () => {
    tokenStorage.clearTokens();
    set({
      authUser: null,
      organizations: null,
      currentOrganization: null,
    });
  },

  setCurrentOrganization: (orgId: string) => {
    // This would update the token with new org context
    // For now, just update the current organization
    set({
      currentOrganization: {
        id: orgId,
        name: "Organization", // TODO: Fetch from organizations list
      },
    });
  },
}));
