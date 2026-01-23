import { useState, useEffect } from "react";
import { useAuthStore } from "@/stores";
import {
  validateProfileForm,
  validatePasswordForm,
} from "../utils/validationUtils";
import {
  formatPhoneForDisplay,
  formatPhoneForBackend,
  formatPhoneForEditing,
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
    profileImage: authUser?.profileImage || "",
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
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  // In the useEffect initialization:
  useEffect(() => {
    if (authUser) {
      setFormData({
        name: authUser.name || "",
        email: authUser.email || "",
        // Use formatPhoneForEditing to get just the 10 digits
        phoneNumber: formatPhoneForEditing(authUser.phoneNumber || ""),
        profileImage: authUser.profileImage || "",
      });
      setOriginalPhoneNumber(authUser.phoneNumber || "");
      setImagePreview(authUser.profileImage || null);
    }
  }, [authUser]);

  // In handleToggleEdit:
  const handleToggleEdit = () => {
    setIsEditing(!isEditing);
    if (isEditing) {
      // Reset form data when canceling - use formatPhoneForEditing
      setFormData({
        name: authUser?.name || "",
        email: authUser?.email || "",
        phoneNumber: formatPhoneForEditing(authUser?.phoneNumber || ""),
        profileImage: authUser?.profileImage || "",
      });
      setImagePreview(authUser?.profileImage || null);
      setSelectedFile(null);
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

  const handleImageChange = async (file: File) => {
    try {
      const fileSizeMB = file.size / (1024 * 1024);
      console.log(
        `Selected file: ${file.name}, Size: ${fileSizeMB.toFixed(2)}MB`,
      );

      // Simple size validation (optional, backend will also validate)
      const MAX_SIZE_MB = 10; // Same as backend limit
      if (fileSizeMB > MAX_SIZE_MB) {
        setMessage({
          type: "error",
          text: `Image size (${fileSizeMB.toFixed(2)}MB) exceeds the ${MAX_SIZE_MB}MB limit.`,
        });
        return;
      }

      // Show immediate preview
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);

      setSelectedFile(file);
      setMessage({
        type: "success",
        text: `Image ready to upload (${fileSizeMB.toFixed(2)}MB)`,
      });
      setTimeout(() => setMessage(null), 2000);
    } catch (error) {
      console.error("Image selection failed:", error);
      setMessage({
        type: "error",
        text: error instanceof Error ? error.message : "Failed to select image",
      });
      setSelectedFile(null);
      setImagePreview(null);
    }
  };

  const handleRemoveImage = () => {
    setImagePreview(null);
    setSelectedFile(null);
    setFormData((prev) => ({
      ...prev,
      profileImage: "", // Empty string will trigger removal in backend
    }));
    setMessage({
      type: "success",
      text: "Profile image will be removed on save",
    });
    setTimeout(() => setMessage(null), 2000);
  };

  const convertFileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = (error) => reject(error);
    });
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
    setMessage({ type: "success", text: "Uploading profile..." });

    try {
      // Format phone number for backend
      const formattedPhoneNumber = formatPhoneForBackend(formData.phoneNumber);

      // Create update object
      const updateData: any = {
        name: formData.name,
        email: formData.email,
        phoneNumber: formattedPhoneNumber || undefined,
      };

      // Handle profile image
      if (selectedFile) {
        // Convert directly to base64 without compression
        const base64Image = await convertFileToBase64(selectedFile);
        const base64SizeMB = (base64Image.length * 3) / (4 * 1024 * 1024); // Approximate size

        console.log(`Uploading image as base64: ${base64SizeMB.toFixed(2)}MB`);

        // Optional: Show warning for large files (but still upload)
        if (base64SizeMB > 5) {
          console.warn(
            `Large image: ${base64SizeMB.toFixed(2)}MB - proceeding anyway`,
          );
        }

        updateData.profileImage = base64Image;
      } else if (formData.profileImage === "") {
        // If profileImage is empty string, send null to remove
        updateData.profileImage = null;
      }

      await updateProfile(updateData);

      setMessage({ type: "success", text: "Profile updated successfully!" });
      setIsEditing(false);
      setSelectedFile(null);

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
    imagePreview,
    selectedFile,
    handleToggleEdit,
    handleTogglePassword,
    handleImageChange,
    handleRemoveImage,
    handleUpdateProfile,
    handleChangePassword,
    handleLogout,
    setMessage,
    setFormData,
    setPasswordData,
  };
}
