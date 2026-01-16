import { useState, useEffect } from "react";
import { useAuthStore } from "@/stores";
import {
  validateProfileForm,
  validatePasswordForm,
} from "../utils/validationUtils";
import {
  formatPhoneForDisplay,
  formatPhoneForBackend,
} from "../utils/phoneUtils";

export function useSettings() {
  const { authUser, updateProfile, changePassword, logout } = useAuthStore();

  const [isEditing, setIsEditing] = useState(false);
  const [isChangingPassword, setIsChangingPassword] = useState(false);
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
        phoneNumber: formatPhoneForDisplay(authUser.phoneNumber || ""),
      });
      setOriginalPhoneNumber(authUser.phoneNumber || "");
    }
  }, [authUser]);

  const handleToggleEdit = () => {
    setIsEditing(!isEditing);
    if (isEditing) {
      // Reset form data when canceling
      setFormData({
        name: authUser?.name || "",
        email: authUser?.email || "",
        phoneNumber: formatPhoneForDisplay(authUser?.phoneNumber || ""),
      });
    }
  };

  const handleTogglePassword = () => {
    setIsChangingPassword(!isChangingPassword);
    if (isChangingPassword) {
      setPasswordData({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
    }
  };

  const handleUpdateProfile = async () => {
    const validation = validateProfileForm(formData);
    if (!validation.isValid) {
      setMessage({
        type: "error",
        text: validation.error || "Invalid form data",
      });
      return;
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
    const validation = validatePasswordForm(passwordData);
    if (!validation.isValid) {
      setMessage({
        type: "error",
        text: validation.error || "Invalid password data",
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

  const handleLogout = async () => {
    setIsLoggingOut(true);
    try {
      await logout();
    } catch (error) {
      console.error("Logout failed:", error);
      setIsLoggingOut(false);
      throw error;
    }
  };

  return {
    isEditing,
    isChangingPassword,
    formData,
    passwordData,
    message,
    isLoading,
    isLoggingOut,
    handleToggleEdit,
    handleTogglePassword,
    handleUpdateProfile,
    handleChangePassword,
    handleLogout,
    setMessage,
    setFormData,
    setPasswordData,
  };
}
