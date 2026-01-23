import {
  User,
  Mail,
  Phone,
  Shield,
  Edit2,
  Save,
  X,
  CheckCircle2,
} from "lucide-react";
import type { AuthUser } from "@/types/auth";
import { ProfileField } from "./ProfileField";
import { ProfileImageUpload } from "./ProfileImageUpload";
import {
  formatPhoneForDisplay,
  formatPhoneForEditing,
} from "../utils/phoneUtils";

interface ProfileCardProps {
  authUser: AuthUser | null;
  isEditing: boolean;
  formData: {
    name: string;
    email: string;
    phoneNumber: string;
    profileImage: string;
  };
  isLoading: boolean;
  hasChanges: boolean;
  onToggleEdit: () => void;
  onUpdateProfile: () => Promise<void>;
  onFormDataChange: (data: any) => void;
  onImageChange: (file: File) => void;
  onRemoveImage: () => void;
  imagePreview: string | null;
  selectedFile: File | null;
}

export function ProfileCard({
  authUser,
  isEditing,
  formData,
  isLoading,
  hasChanges,
  onToggleEdit,
  onUpdateProfile,
  onFormDataChange,
  onImageChange,
  onRemoveImage,
  imagePreview,
  selectedFile,
}: ProfileCardProps) {
  const displayPhoneNumber = authUser?.phoneNumber
    ? formatPhoneForDisplay(authUser.phoneNumber)
    : "Not provided";

  const handleCancel = () => {
    onToggleEdit();
    onFormDataChange({
      name: authUser?.name || "",
      email: authUser?.email || "",
      // Reset to the edited version (10 digits)
      phoneNumber: formatPhoneForEditing(authUser?.phoneNumber || ""),
      profileImage: authUser?.profileImage || "",
    });
  };

  const hasImageChanges = selectedFile !== null || formData.profileImage === "";

  return (
    <div className="bg-white rounded-3xl shadow-sm border border-gray-100 mb-6 overflow-hidden hover:shadow-md transition-shadow duration-300">
      {/* Card Header */}
      <div className="p-4 md:p-6 border-b border-gray-100 flex flex-col md:flex-row md:items-center justify-between gap-4 bg-linear-to-r from-gray-50/50 to-white">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-linear-to-br from-[#E6F4F1] to-[#D0EDE6] rounded-2xl flex items-center justify-center shrink-0 ring-2 ring-[#00A082]/10 shadow-sm">
            <User className="text-[#00A082]" size={24} />
          </div>
          <div>
            <h3 className="text-gray-900 text-lg leading-tight">
              Profile Information
            </h3>
            <p className="text-xs md:text-sm text-gray-500 mt-0.5">
              Update your personal details and profile photo
            </p>
          </div>
        </div>

        <div className="flex gap-2">
          {!isEditing ? (
            <button
              onClick={onToggleEdit}
              className="w-full md:w-auto px-5 py-2.5 cursor-pointer bg-linear-to-r from-[#00A082] to-[#008c72] hover:from-[#008c72] hover:to-[#007a64] text-white text-sm rounded-xl transition-all flex items-center justify-center gap-2 shadow-sm hover:shadow-md hover:-translate-y-0.5 duration-200"
            >
              <Edit2 size={16} />
              <span>Edit Profile</span>
            </button>
          ) : (
            <>
              <button
                onClick={handleCancel}
                className="flex-1 md:flex-none cursor-pointer px-4 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 text-sm rounded-xl transition-all flex items-center justify-center gap-2 hover:shadow-sm"
              >
                <X size={16} />
                <span>Cancel</span>
              </button>
              <button
                onClick={onUpdateProfile}
                disabled={isLoading || (!hasChanges && !hasImageChanges)}
                className="flex-1 md:flex-none cursor-pointer px-5 py-2.5 bg-linear-to-r from-[#00A082] to-[#008c72] hover:from-[#008c72] hover:to-[#007a64] text-white text-sm rounded-xl transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed shadow-sm hover:shadow-md disabled:hover:shadow-sm"
              >
                {isLoading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    <span>Saving...</span>
                  </>
                ) : (
                  <>
                    <Save size={16} />
                    <span>Save </span>
                  </>
                )}
              </button>
            </>
          )}
        </div>
      </div>

      {/* Profile Content */}
      <div className="p-4 md:p-6">
        {/* Profile Image Upload Section - Only in Edit Mode */}
        {isEditing && (
          <div className="mb-8 p-6 bg-gray-50/50 rounded-2xl border border-gray-200">
            <h4 className="text-sm font-medium text-gray-700 mb-4">
              Profile Photo
            </h4>
            <ProfileImageUpload
              imagePreview={imagePreview}
              selectedFile={selectedFile}
              onImageChange={onImageChange}
              onRemoveImage={onRemoveImage}
              isLoading={isLoading}
            />
          </div>
        )}

        {/* Profile Fields */}
        <div className="space-y-6">
          {/* Name Field */}
          <ProfileField
            icon={User}
            label="Full Name"
            value={isEditing ? formData.name : authUser?.name || ""}
            editing={isEditing}
            onChange={(value) => onFormDataChange({ ...formData, name: value })}
            helperText={!isEditing ? "Public display name" : undefined}
            inputType="text"
          />

          {/* Email Field */}
          <ProfileField
            icon={Mail}
            label="Email Address"
            value={isEditing ? formData.email : authUser?.email || ""}
            editing={isEditing}
            onChange={(value) =>
              onFormDataChange({ ...formData, email: value })
            }
            helperText={!isEditing ? "Primary login" : undefined}
            inputType="email"
            verified={!isEditing && authUser?.emailVerified}
          />

          {/* Phone Field */}
          <ProfileField
            icon={Phone}
            label="Phone Number"
            value={isEditing ? formData.phoneNumber : displayPhoneNumber}
            editing={isEditing}
            onChange={(value) =>
              onFormDataChange({ ...formData, phoneNumber: value })
            }
            helperText={!isEditing ? "Compulsory" : undefined}
            inputType="tel"
            isPhoneField={true}
            maxLength={10}
          />

          {/* Role Field */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 md:gap-4 p-4 rounded-2xl bg-linear-to-r from-gray-50 to-transparent border border-gray-100">
            <div className="flex items-start md:items-center gap-4">
              <div className="w-10 h-10 bg-linear-to-br from-gray-100 to-gray-50 rounded-xl flex items-center justify-center shrink-0 ring-1 ring-gray-200">
                <Shield className="text-gray-500" size={18} />
              </div>
              <div>
                <p className="text-[10px] text-gray-400 uppercase tracking-widest mb-1">
                  Account Role
                </p>
                <div className="flex items-center gap-2">
                  <p className="text-gray-800 text-sm capitalize">
                    {authUser?.role || "User"}
                  </p>
                  <span className="px-2 py-0.5 bg-gray-100 text-gray-600 text-[9px] uppercase rounded-md border border-gray-200">
                    Fixed
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
