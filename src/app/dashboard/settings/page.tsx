"use client";

import { useState } from "react";
import { useAuthStore } from "@/stores";
import { ConfirmationModal } from "@/components/ui/ConfirmationModal";
import {
  SettingsHeader,
  MessageAlert,
  ProfileCard,
  SecurityCard,
  DangerZoneCard,
  AccountFooter,
} from "./components";
import { useSettings } from "./hooks/useSettings";

export default function SettingsPage() {
  const { authUser } = useAuthStore();
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  const {
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
  } = useSettings();

  const handleConfirmLogout = async () => {
    await handleLogout();
    window.location.href = "/login";
  };

  const handleCancelLogout = () => {
    setShowLogoutModal(false);
  };

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

      {/* Header */}
      <SettingsHeader />

      {/* Message Alert */}
      {message && (
        <MessageAlert
          type={message.type}
          text={message.text}
          onClose={() => setMessage(null)}
        />
      )}

      {/* Profile Card */}
      <ProfileCard
        authUser={authUser}
        isEditing={isEditing}
        formData={formData}
        isLoading={isLoading}
        hasChanges={
          formData.name !== authUser?.name ||
          formData.email !== authUser?.email ||
          formData.phoneNumber !== authUser?.phoneNumber
        }
        onToggleEdit={handleToggleEdit}
        onUpdateProfile={handleUpdateProfile}
        onFormDataChange={setFormData}
      />

      {/* Security Card */}
      <SecurityCard
        isChangingPassword={isChangingPassword}
        passwordData={passwordData}
        isLoading={isLoading}
        onTogglePassword={handleTogglePassword}
        onChangePassword={handleChangePassword}
        onPasswordDataChange={setPasswordData}
      />

      {/* Danger Zone */}
      <DangerZoneCard
        onLogoutClick={() => setShowLogoutModal(true)}
        isLoggingOut={isLoggingOut}
      />

      {/* Account Footer */}
      <AccountFooter authUser={authUser} />
    </div>
  );
}
