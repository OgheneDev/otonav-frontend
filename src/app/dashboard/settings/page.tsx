"use client";

import React, { useState, useEffect } from "react";
import {
  User,
  Mail,
  Lock,
  LogOut,
  Phone,
  Shield,
  CheckCircle,
  AlertCircle,
  Edit2,
  Save,
  X,
} from "lucide-react";
import { useAuthStore } from "@/stores";
import { ConfirmationModal } from "@/components/ui/ConfirmationModal";

export default function SettingsPage() {
  const { authUser, logout, updateProfile, changePassword } = useAuthStore();
  const [isEditing, setIsEditing] = useState(false);
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [originalPhoneNumber, setOriginalPhoneNumber] = useState("");
  const [formData, setFormData] = useState({
    name: authUser?.name || "",
    email: authUser?.email || "",
    phoneNumber: authUser?.phoneNumber || "",
  });
  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [message, setMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  // Initialize form data when authUser changes
  useEffect(() => {
    if (authUser) {
      setFormData({
        name: authUser.name || "",
        email: authUser.email || "",
        phoneNumber: authUser.phoneNumber || "",
      });
      // Store original phone number for comparison
      setOriginalPhoneNumber(authUser.phoneNumber || "");
    }
  }, [authUser]);

  // Format phone number for display - remove +234 prefix if present
  const formatPhoneForDisplay = (phone: string) => {
    if (!phone) return "";

    // Remove +234 prefix
    if (phone.startsWith("+234")) {
      return "0" + phone.substring(4);
    }

    // Remove any non-digit characters
    const digits = phone.replace(/\D/g, "");

    // If it's 13 digits and starts with 234, convert to 0 format
    if (digits.length === 13 && digits.startsWith("234")) {
      return "0" + digits.substring(3);
    }

    // Otherwise return digits (max 10)
    return digits.slice(0, 10);
  };

  // Format phone number for backend - add +234 prefix
  const formatPhoneForBackend = (phone: string) => {
    if (!phone) return "";

    // Remove all non-digit characters
    const digits = phone.replace(/\D/g, "");

    // If empty after cleaning, return empty
    if (digits.length === 0) return "";

    // If it starts with 0, convert to +234
    if (digits.startsWith("0") && digits.length >= 10) {
      return `+234${digits.substring(1, 11)}`;
    }

    // If it's already in +234 format or 234 format, ensure proper format
    if (digits.startsWith("234") && digits.length >= 13) {
      return `+${digits.substring(0, 13)}`;
    }

    // Otherwise, assume it's a 10-digit number and add +234
    if (digits.length === 10) {
      return `+234${digits}`;
    }

    // Return as is (backend should handle validation)
    return phone;
  };

  // Format phone number as user types - only allow 10 digits
  const formatPhoneInput = (value: string) => {
    // Remove all non-digit characters
    const digits = value.replace(/\D/g, "");
    // Limit to 10 digits
    return digits.slice(0, 10);
  };

  const handleUpdateProfile = async () => {
    if (!formData.name.trim() || !formData.email.trim()) {
      setMessage({ type: "error", text: "Name and email are required" });
      return;
    }

    // Validate phone number if provided
    if (formData.phoneNumber) {
      const phoneDigits = formData.phoneNumber.replace(/\D/g, "");

      if (phoneDigits.length !== 10) {
        setMessage({
          type: "error",
          text: "Phone number must be exactly 10 digits",
        });
        return;
      }
    }

    setIsLoading(true);
    try {
      // Format phone number for backend
      const formattedPhoneNumber = formatPhoneForBackend(formData.phoneNumber);

      await updateProfile({
        name: formData.name,
        email: formData.email,
        phoneNumber: formattedPhoneNumber || undefined,
      });
      setMessage({ type: "success", text: "Profile updated successfully!" });
      setIsEditing(false);

      // Update original phone number
      if (authUser) {
        setOriginalPhoneNumber(formattedPhoneNumber || "");
      }
    } catch (error: any) {
      setMessage({
        type: "error",
        text: error.message || "Failed to update profile",
      });
    } finally {
      setIsLoading(false);
      setTimeout(() => setMessage(null), 3000);
    }
  };

  const handleChangePassword = async () => {
    if (!passwordData.currentPassword || !passwordData.newPassword) {
      setMessage({ type: "error", text: "All password fields are required" });
      return;
    }

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setMessage({ type: "error", text: "New passwords do not match" });
      return;
    }

    if (passwordData.newPassword.length < 6) {
      setMessage({
        type: "error",
        text: "Password must be at least 6 characters",
      });
      return;
    }

    setIsLoading(true);
    try {
      await changePassword({
        currentPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword,
      });
      setMessage({ type: "success", text: "Password changed successfully!" });
      setPasswordData({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
      setIsChangingPassword(false);
    } catch (error: any) {
      setMessage({
        type: "error",
        text: error.message || "Failed to change password",
      });
    } finally {
      setIsLoading(false);
      setTimeout(() => setMessage(null), 3000);
    }
  };

  const handleLogoutClick = () => {
    setShowLogoutModal(true);
  };

  const handleConfirmLogout = async () => {
    setIsLoggingOut(true);
    try {
      await logout();
      window.location.href = "/login";
    } catch (error) {
      console.error("Logout failed:", error);
      setIsLoggingOut(false);
      setShowLogoutModal(false);
      setMessage({
        type: "error",
        text: "Failed to logout. Please try again.",
      });
    }
  };

  const handleCancelLogout = () => {
    setShowLogoutModal(false);
  };

  // Handle phone input change
  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formattedPhone = formatPhoneInput(e.target.value);
    setFormData({ ...formData, phoneNumber: formattedPhone });
  };

  // Check if phone number has changed
  const hasPhoneChanged = () => {
    const currentFormatted = formatPhoneForBackend(formData.phoneNumber);
    return currentFormatted !== originalPhoneNumber;
  };

  // Check if any field has changed
  const hasChanges = () => {
    return (
      formData.name !== authUser?.name ||
      formData.email !== authUser?.email ||
      hasPhoneChanged()
    );
  };

  // Format phone number for display in view mode
  const displayPhoneNumber = authUser?.phoneNumber
    ? formatPhoneForDisplay(authUser.phoneNumber)
    : "Not provided";

  return (
    <div className="max-w-4xl mx-auto px-4 py-6 md:px-0">
      {/* Confirmation Modal */}
      <ConfirmationModal
        isOpen={showLogoutModal}
        onClose={handleCancelLogout}
        onConfirm={handleConfirmLogout}
        title="Confirm Logout"
        message="Are you sure you want to logout? You will need to log in again to access your account."
        confirmText={isLoggingOut ? "Logging out..." : "Logout"}
        variant="danger"
        isLoading={isLoggingOut}
      />

      {/* Title Section */}
      <section className="mb-8 text-center md:text-left">
        <h2 className="text-2xl font-semibold text-gray-800">
          Account Settings
        </h2>
        <p className="text-gray-500 text-sm mt-1">
          Manage your account details and security settings
        </p>
      </section>

      {/* Message Alert */}
      {message && (
        <div
          className={`mb-6 p-4 rounded-2xl flex items-center gap-3 animate-in fade-in slide-in-from-top-2 ${
            message.type === "success"
              ? "bg-[#E6F4F1] text-[#00A082]"
              : "bg-[#FFEBEB] text-[#FF7B7B]"
          }`}
        >
          {message.type === "success" ? (
            <CheckCircle size={20} className="shrink-0" />
          ) : (
            <AlertCircle size={20} className="shrink-0" />
          )}
          <span className="text-sm font-medium">{message.text}</span>
        </div>
      )}

      {/* Profile Details Card */}
      <div className="bg-white rounded-3xl shadow-sm border border-gray-100 mb-6 overflow-hidden">
        <div className="p-4 md:p-6 border-b border-gray-50 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-[#E6F4F1] rounded-2xl flex items-center justify-center shrink-0">
              <User className="text-[#00A082]" size={24} />
            </div>
            <div>
              <h3 className=" text-gray-800 text-lg font-semibold leading-tight">
                Profile Information
              </h3>
              <p className="text-xs md:text-sm text-gray-400">
                Update your personal details
              </p>
            </div>
          </div>

          <div className="flex gap-2">
            {!isEditing ? (
              <button
                onClick={() => setIsEditing(true)}
                className="w-full md:w-auto px-4 py-2.5 cursor-pointer bg-[#00A082] hover:bg-[#008c72] text-white text-sm rounded-xl transition-all flex items-center justify-center gap-2"
              >
                <Edit2 size={16} />
                Edit Profile
              </button>
            ) : (
              <>
                <button
                  onClick={() => {
                    setIsEditing(false);
                    setFormData({
                      name: authUser?.name || "",
                      email: authUser?.email || "",
                      phoneNumber: formatPhoneForDisplay(
                        authUser?.phoneNumber || ""
                      ),
                    });
                  }}
                  className="flex-1 md:flex-none cursor-pointer px-4 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 text-sm rounded-xl transition-all flex items-center justify-center gap-2"
                >
                  <X size={16} />
                  Cancel
                </button>
                <button
                  onClick={handleUpdateProfile}
                  disabled={isLoading || !hasChanges()}
                  className="flex-1 md:flex-none cursor-pointer px-4 py-2.5 bg-[#00A082] hover:bg-[#008c72] text-white text-sm rounded-xl transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  <Save size={16} />
                  {isLoading ? "Saving..." : "Save"}
                </button>
              </>
            )}
          </div>
        </div>

        <div className="p-4 md:p-6 space-y-6">
          {/* Name Field */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-2 md:gap-4">
            <div className="flex items-start md:items-center gap-4">
              <div className="w-10 h-10 bg-gray-50 rounded-xl flex items-center justify-center shrink-0 mt-1 md:mt-0">
                <User className="text-gray-400" size={18} />
              </div>
              <div className="w-full">
                <p className="text-[10px] text-gray-400 uppercase font-black tracking-widest mb-1">
                  Full Name
                </p>
                {isEditing ? (
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                    className="w-full md:w-64 text-gray-800 text-sm border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#00A082]/20 focus:border-[#00A082]"
                  />
                ) : (
                  <p className="text-gray-800 text-sm">{authUser?.name}</p>
                )}
              </div>
            </div>
            {!isEditing && (
              <span className="hidden md:block text-[10px] text-gray-300 font-medium">
                Public display name
              </span>
            )}
          </div>

          {/* Email Field */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-2 md:gap-4">
            <div className="flex items-start md:items-center gap-4">
              <div className="w-10 h-10 bg-gray-50 rounded-xl flex items-center justify-center shrink-0 mt-1 md:mt-0">
                <Mail className="text-gray-400" size={18} />
              </div>
              <div className="w-full">
                <p className="text-[10px] text-gray-400 uppercase font-black tracking-widest mb-1">
                  Email Address
                </p>
                {isEditing ? (
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) =>
                      setFormData({ ...formData, email: e.target.value })
                    }
                    className="w-full md:w-64 text-gray-800 text-sm border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#00A082]/20 focus:border-[#00A082]"
                  />
                ) : (
                  <div className="flex items-center gap-2 flex-wrap">
                    <p className="text-gray-800 text-sm">{authUser?.email}</p>
                    {authUser?.emailVerified && (
                      <span className="px-2 py-0.5 bg-green-50 text-[#00A082] text-[9px] font-black uppercase rounded-md border border-green-100">
                        Verified
                      </span>
                    )}
                  </div>
                )}
              </div>
            </div>
            {!isEditing && (
              <span className="hidden md:block text-[10px] text-gray-300 font-medium">
                Primary login
              </span>
            )}
          </div>

          {/* Phone Field */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-2 md:gap-4">
            <div className="flex items-start md:items-center gap-4">
              <div className="w-10 h-10 bg-gray-50 rounded-xl flex items-center justify-center shrink-0 mt-1 md:mt-0">
                <Phone className="text-gray-400" size={18} />
              </div>
              <div className="w-full">
                <p className="text-[10px] text-gray-400 uppercase font-black tracking-widest mb-1">
                  Phone Number
                </p>
                {isEditing ? (
                  <div className="space-y-2">
                    <div className="relative">
                      <input
                        type="tel"
                        value={formData.phoneNumber}
                        onChange={handlePhoneChange}
                        className="w-full md:w-64 text-gray-800 text-sm border border-gray-200 rounded-xl pl-4 pr-16 py-3 focus:outline-none focus:ring-2 focus:ring-[#00A082]/20 focus:border-[#00A082]"
                        placeholder="08012345678"
                        maxLength={11}
                      />
                      <div className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 font-medium text-sm">
                        (+234)
                      </div>
                    </div>
                    <div className="flex justify-between">
                      <p className="text-xs text-gray-500">
                        Enter 10 digits starting with 0
                      </p>
                      <p className="text-xs text-gray-500 font-medium">
                        {formData.phoneNumber.replace(/\D/g, "").length}/10
                        digits
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-1">
                    <p className="text-gray-800 text-sm">
                      {displayPhoneNumber}
                    </p>
                    {authUser?.phoneNumber && (
                      <p className="text-xs text-gray-500">
                        Stored as: {authUser.phoneNumber}
                      </p>
                    )}
                  </div>
                )}
              </div>
            </div>
            {!isEditing && (
              <span className="hidden md:block text-[10px] text-gray-300 font-medium">
                Compulsory
              </span>
            )}
          </div>

          {/* Role Field */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-2 md:gap-4">
            <div className="flex items-start md:items-center gap-4">
              <div className="w-10 h-10 bg-gray-50 rounded-xl flex items-center justify-center shrink-0">
                <Shield className="text-gray-400" size={18} />
              </div>
              <div>
                <p className="text-[10px] text-gray-400 uppercase font-black tracking-widest mb-1">
                  Account Role
                </p>
                <p className="text-gray-800 text-sm capitalize">
                  {authUser?.role || "User"}
                </p>
              </div>
            </div>
            <span className="hidden md:block text-[10px] text-gray-300 font-medium italic">
              Fixed
            </span>
          </div>
        </div>
      </div>

      {/* Change Password Card */}
      <div className="bg-white rounded-3xl shadow-sm border border-gray-100 mb-6 overflow-hidden">
        <div className="p-4 md:p-6 border-b border-gray-50 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-[#FFF7ED] rounded-2xl flex items-center justify-center shrink-0">
              <Lock className="text-[#F97316]" size={24} />
            </div>
            <div>
              <h3 className="text-gray-800 font-semibold text-lg">Security</h3>
              <p className="text-xs md:text-sm text-gray-400">
                Manage your password
              </p>
            </div>
          </div>

          <div className="flex gap-2">
            {!isChangingPassword ? (
              <button
                onClick={() => setIsChangingPassword(true)}
                className="w-full md:w-auto px-4 py-2.5 bg-[#F97316] hover:bg-[#ea580c] text-white text-sm cursor-pointer rounded-xl transition-all flex items-center justify-center gap-2"
              >
                <Lock size={16} />
                Change Password
              </button>
            ) : (
              <>
                <button
                  onClick={() => {
                    setIsChangingPassword(false);
                    setPasswordData({
                      currentPassword: "",
                      newPassword: "",
                      confirmPassword: "",
                    });
                  }}
                  className="flex-1 md:flex-none px-4 py-2.5 cursor-pointer bg-gray-100 hover:bg-gray-200 text-gray-700 text-sm rounded-xl transition-all flex items-center justify-center gap-2"
                >
                  <X size={16} />
                  Cancel
                </button>
                <button
                  onClick={handleChangePassword}
                  disabled={isLoading}
                  className="flex-1 md:flex-none px-4 py-2.5 cursor-pointer bg-[#F97316] hover:bg-[#ea580c] text-white text-sm rounded-xl transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  <Save size={16} />
                  {isLoading ? "Updating..." : "Update"}
                </button>
              </>
            )}
          </div>
        </div>

        {isChangingPassword && (
          <div className="p-4 md:p-6 space-y-6 bg-gray-50/30">
            {[
              { label: "Current Password", key: "currentPassword" },
              { label: "New Password", key: "newPassword" },
              { label: "Confirm New Password", key: "confirmPassword" },
            ].map((field) => (
              <div
                key={field.key}
                className="flex flex-col md:flex-row md:items-center gap-2 md:gap-4"
              >
                <div className="md:w-40 shrink-0">
                  <p className="text-[10px] text-gray-400 uppercase font-black tracking-widest">
                    {field.label}
                  </p>
                </div>
                <input
                  type="password"
                  value={(passwordData as any)[field.key]}
                  onChange={(e) =>
                    setPasswordData({
                      ...passwordData,
                      [field.key]: e.target.value,
                    })
                  }
                  className="w-full md:w-72 text-gray-800 text-sm border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#F97316]/20 focus:border-[#F97316]"
                  placeholder={`••••••••`}
                />
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Danger Zone Card */}
      <div className="bg-white rounded-3xl shadow-sm border border-red-100 overflow-hidden">
        <div className="p-4 md:p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 bg-[#FFEBEB] rounded-2xl flex items-center justify-center shrink-0">
              <LogOut className="text-[#FF7B7B]" size={24} />
            </div>
            <div>
              <h3 className="text-gray-800 font-semibold text-lg">
                Danger Zone
              </h3>
              <p className="text-xs md:text-sm text-gray-400">
                Irreversible actions
              </p>
            </div>
          </div>

          <button
            onClick={handleLogoutClick}
            disabled={isLoggingOut}
            className="w-full py-4 bg-[#FF7B7B] text-sm hover:bg-[#ff6a6a] text-white cursor-pointer rounded-2xl transition-all shadow-lg shadow-red-100 active:scale-[0.98] flex items-center justify-center gap-3 disabled:opacity-70"
          >
            {isLoggingOut ? (
              <>
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Logging out...
              </>
            ) : (
              <>
                <LogOut size={20} />
                LOGOUT FROM PANEL
              </>
            )}
          </button>

          <p className="text-[10px] text-gray-400 mt-4 text-center font-medium">
            This will end your current session and require re-authentication.
          </p>
        </div>
      </div>

      {/* Account Info Footer */}
      <div className="mt-8 mb-4 text-center">
        <p className="text-[10px] text-gray-300 uppercase tracking-widest">
          Account created on{" "}
          <span className="text-gray-400">
            {authUser?.createdAt
              ? new Date(authUser.createdAt).toLocaleDateString()
              : "Unknown"}
          </span>
          {authUser?.lastLoginAt && (
            <>
              <span className="mx-2">•</span>
              Last login{" "}
              <span className="text-gray-400">
                {new Date(authUser.lastLoginAt).toLocaleDateString()}
              </span>
            </>
          )}
        </p>
      </div>
    </div>
  );
}
