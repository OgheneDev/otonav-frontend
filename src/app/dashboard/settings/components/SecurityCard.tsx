import {
  Lock,
  Save,
  X,
  Eye,
  EyeOff,
  ShieldCheck,
  AlertCircle,
} from "lucide-react";
import { useState } from "react";

interface SecurityCardProps {
  isChangingPassword: boolean;
  passwordData: {
    currentPassword: string;
    newPassword: string;
    confirmPassword: string;
  };
  isLoading: boolean;
  onTogglePassword: () => void;
  onChangePassword: () => Promise<void>;
  onPasswordDataChange: (data: any) => void;
}

// Password strength calculation
const calculatePasswordStrength = (
  password: string
): {
  score: number;
  label: string;
  color: string;
  bgColor: string;
} => {
  if (!password)
    return {
      score: 0,
      label: "None",
      color: "text-gray-400",
      bgColor: "bg-gray-200",
    };

  let score = 0;

  // Length check
  if (password.length >= 8) score += 1;
  if (password.length >= 12) score += 1;

  // Character variety checks
  if (/[a-z]/.test(password)) score += 1;
  if (/[A-Z]/.test(password)) score += 1;
  if (/[0-9]/.test(password)) score += 1;
  if (/[^a-zA-Z0-9]/.test(password)) score += 1;

  if (score <= 2)
    return {
      score: 25,
      label: "Weak",
      color: "text-red-600",
      bgColor: "bg-red-500",
    };
  if (score <= 4)
    return {
      score: 50,
      label: "Fair",
      color: "text-orange-600",
      bgColor: "bg-orange-500",
    };
  if (score <= 5)
    return {
      score: 75,
      label: "Good",
      color: "text-yellow-600",
      bgColor: "bg-yellow-500",
    };
  return {
    score: 100,
    label: "Strong",
    color: "text-green-600",
    bgColor: "bg-green-500",
  };
};

export function SecurityCard({
  isChangingPassword,
  passwordData,
  isLoading,
  onTogglePassword,
  onChangePassword,
  onPasswordDataChange,
}: SecurityCardProps) {
  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false,
  });

  const passwordStrength = calculatePasswordStrength(passwordData.newPassword);
  const passwordsMatch =
    passwordData.newPassword &&
    passwordData.confirmPassword &&
    passwordData.newPassword === passwordData.confirmPassword;
  const passwordsDontMatch =
    passwordData.confirmPassword &&
    passwordData.newPassword !== passwordData.confirmPassword;

  const handleCancel = () => {
    onTogglePassword();
    onPasswordDataChange({
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    });
    setShowPasswords({ current: false, new: false, confirm: false });
  };

  const passwordFields = [
    {
      label: "Current Password",
      key: "currentPassword" as const,
      showKey: "current" as const,
      placeholder: "Enter your current password",
    },
    {
      label: "New Password",
      key: "newPassword" as const,
      showKey: "new" as const,
      placeholder: "Create a strong password",
    },
    {
      label: "Confirm New Password",
      key: "confirmPassword" as const,
      showKey: "confirm" as const,
      placeholder: "Re-enter your new password",
    },
  ];

  return (
    <div className="bg-white rounded-3xl shadow-sm border border-gray-100 mb-6 overflow-hidden hover:shadow-md transition-shadow duration-300">
      <div className="p-4 md:p-6 border-b border-gray-100 flex flex-col md:flex-row md:items-center justify-between gap-4 bg-linear-to-r from-orange-50/30 to-white">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-linear-to-br from-[#FFF7ED] to-[#FFEDD5] rounded-2xl flex items-center justify-center shrink-0 ring-2 ring-orange-100 shadow-sm">
            <Lock className="text-[#F97316]" size={24} />
          </div>
          <div>
            <h3 className="text-gray-900 text-lg">Security</h3>
            <p className="text-xs md:text-sm text-gray-500 mt-0.5">
              Manage your password and security settings
            </p>
          </div>
        </div>

        <div className="flex gap-2">
          {!isChangingPassword ? (
            <button
              onClick={onTogglePassword}
              className="w-full md:w-auto px-5 py-2.5 bg-linear-to-r from-[#F97316] to-[#ea580c] hover:from-[#ea580c] hover:to-[#dc2626] text-white text-sm cursor-pointer rounded-xl transition-all flex items-center justify-center gap-2 shadow-sm hover:shadow-md hover:-translate-y-0.5 duration-200"
            >
              <Lock size={16} />
              <span>Change Password</span>
            </button>
          ) : (
            <>
              <button
                onClick={handleCancel}
                className="flex-1 md:flex-none px-4 py-2.5 cursor-pointer bg-gray-100 hover:bg-gray-200 text-gray-700 text-sm rounded-xl transition-all flex items-center justify-center gap-2 hover:shadow-sm"
              >
                <X size={16} />
                <span>Cancel</span>
              </button>
              <button
                onClick={onChangePassword}
                disabled={isLoading}
                className="flex-1 md:flex-none px-5 py-2.5 cursor-pointer bg-linear-to-r from-[#F97316] to-[#ea580c] hover:from-[#ea580c] hover:to-[#dc2626] text-white text-sm rounded-xl transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed shadow-sm hover:shadow-md disabled:hover:shadow-sm"
              >
                {isLoading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    <span>Updating...</span>
                  </>
                ) : (
                  <>
                    <Save size={16} />
                    <span>Update Password</span>
                  </>
                )}
              </button>
            </>
          )}
        </div>
      </div>

      {isChangingPassword && (
        <div className="p-4 md:p-6 space-y-6 bg-linear-to-b from-gray-50/50 to-white">
          {passwordFields.map((field) => (
            <div key={field.key} className="space-y-2">
              <div className="flex flex-col md:flex-row md:items-start gap-3 md:gap-4">
                <div className="md:w-44 shrink-0 pt-3">
                  <p className="text-[10px] text-gray-400 uppercase tracking-widest flex items-center gap-2">
                    {field.label}
                    {field.key === "newPassword" && (
                      <ShieldCheck size={12} className="text-gray-400" />
                    )}
                  </p>
                </div>
                <div className="flex-1 space-y-2">
                  <div className="relative">
                    <input
                      type={showPasswords[field.showKey] ? "text" : "password"}
                      value={passwordData[field.key]}
                      onChange={(e) =>
                        onPasswordDataChange({
                          ...passwordData,
                          [field.key]: e.target.value,
                        })
                      }
                      className="w-full text-gray-800 text-sm bg-white border border-gray-200 rounded-xl px-4 py-3 pr-12 focus:outline-none focus:ring-2 focus:ring-[#F97316]/20 focus:border-[#F97316] transition-all hover:border-gray-300"
                      placeholder={field.placeholder}
                    />
                    <button
                      type="button"
                      onClick={() =>
                        setShowPasswords({
                          ...showPasswords,
                          [field.showKey]: !showPasswords[field.showKey],
                        })
                      }
                      className="absolute right-3 top-1/2 -translate-y-1/2 p-1.5 hover:bg-gray-100 rounded-lg transition-colors"
                    >
                      {showPasswords[field.showKey] ? (
                        <EyeOff size={16} className="text-gray-400" />
                      ) : (
                        <Eye size={16} className="text-gray-400" />
                      )}
                    </button>
                  </div>

                  {/* Password Strength Meter */}
                  {field.key === "newPassword" && passwordData.newPassword && (
                    <div className="space-y-2 px-1">
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-gray-500">Password strength</span>
                        <span
                          className={`${passwordStrength.color} font-medium`}
                        >
                          {passwordStrength.label}
                        </span>
                      </div>
                      <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                        <div
                          className={`h-full ${passwordStrength.bgColor} transition-all duration-300 rounded-full`}
                          style={{ width: `${passwordStrength.score}%` }}
                        />
                      </div>
                      <div className="flex flex-wrap gap-2 text-[10px] text-gray-500">
                        <span
                          className={
                            passwordData.newPassword.length >= 8
                              ? "text-green-600"
                              : ""
                          }
                        >
                          • 8+ characters
                        </span>
                        <span
                          className={
                            /[A-Z]/.test(passwordData.newPassword)
                              ? "text-green-600"
                              : ""
                          }
                        >
                          • Uppercase
                        </span>
                        <span
                          className={
                            /[a-z]/.test(passwordData.newPassword)
                              ? "text-green-600"
                              : ""
                          }
                        >
                          • Lowercase
                        </span>
                        <span
                          className={
                            /[0-9]/.test(passwordData.newPassword)
                              ? "text-green-600"
                              : ""
                          }
                        >
                          • Number
                        </span>
                        <span
                          className={
                            /[^a-zA-Z0-9]/.test(passwordData.newPassword)
                              ? "text-green-600"
                              : ""
                          }
                        >
                          • Special char
                        </span>
                      </div>
                    </div>
                  )}

                  {/* Password Match Indicator */}
                  {field.key === "confirmPassword" &&
                    passwordData.confirmPassword && (
                      <div className="px-1">
                        {passwordsMatch ? (
                          <div className="flex items-center gap-1.5 text-xs text-green-600">
                            <ShieldCheck size={14} />
                            <span>Passwords match</span>
                          </div>
                        ) : passwordsDontMatch ? (
                          <div className="flex items-center gap-1.5 text-xs text-red-600">
                            <AlertCircle size={14} />
                            <span>Passwords don't match</span>
                          </div>
                        ) : null}
                      </div>
                    )}
                </div>
              </div>
            </div>
          ))}

          {/* Security Tips */}
          <div className="mt-6 p-4 bg-blue-50 border border-blue-100 rounded-xl">
            <div className="flex gap-3">
              <ShieldCheck
                className="text-blue-600 shrink-0 mt-0.5"
                size={18}
              />
              <div className="space-y-1">
                <p className="text-sm text-blue-900">Security Tips</p>
                <ul className="text-xs text-blue-700 space-y-1 list-disc list-inside">
                  <li>Use a unique password you don't use elsewhere</li>
                  <li>Consider using a password manager</li>
                  <li>Avoid common words or personal information</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
