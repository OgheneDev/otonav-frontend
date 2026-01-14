"use client";

import { useState, useEffect } from "react";
import { Lock, Eye, EyeOff, KeyRound, ArrowLeft } from "lucide-react";
import AuthLayout from "@/components/AuthLayout";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/stores";
import { useToastStore } from "@/stores";

export default function PasswordReset() {
  const router = useRouter();
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    otp: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [otpError, setOtpError] = useState("");

  const { resetPassword, isResettingPassword } = useAuthStore();
  const { showToast } = useToastStore();

  // Get email from session storage on component mount
  useEffect(() => {
    if (typeof window !== "undefined") {
      const savedEmail = sessionStorage.getItem("resetEmail");
      if (savedEmail) {
        setFormData((prev) => ({ ...prev, email: savedEmail }));
      }
    }
  }, []);

  const validateForm = () => {
    // Clear previous errors
    setOtpError("");

    // Check OTP format
    const otpRegex = /^\d{6}$/;
    if (!otpRegex.test(formData.otp)) {
      setOtpError("OTP must be exactly 6 digits");
      return false;
    }

    // Check password strength
    if (formData.newPassword.length < 8) {
      showToast("Password must be at least 8 characters long", "error");
      return false;
    }

    // Check if passwords match
    if (formData.newPassword !== formData.confirmPassword) {
      showToast("Passwords do not match", "error");
      return false;
    }

    // Check for at least one uppercase, one lowercase, and one number
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;
    if (!passwordRegex.test(formData.newPassword)) {
      showToast(
        "Password must contain at least one uppercase letter, one lowercase letter, and one number",
        "error"
      );
      return false;
    }

    return true;
  };

  const handleSubmit = async () => {
    // Validate form
    if (
      !formData.email.trim() ||
      !formData.otp ||
      !formData.newPassword ||
      !formData.confirmPassword
    ) {
      showToast("Please fill in all fields", "error");
      return;
    }

    if (!validateForm()) {
      return;
    }

    setIsLoading(true);

    try {
      const response = await resetPassword({
        email: formData.email.trim(),
        otp: formData.otp,
        newPassword: formData.newPassword,
      });

      showToast(
        "Password reset successful! Redirecting to login...",
        "success"
      );

      // Clear session storage
      if (typeof window !== "undefined") {
        sessionStorage.removeItem("resetEmail");
      }

      // Redirect to login after 2 seconds
      setTimeout(() => {
        router.push("/login");
      }, 2000);
    } catch (error: any) {
      console.error("Password reset error:", error);

      // Handle specific error messages
      const errorMessage =
        error.message || "Password reset failed. Please try again.";

      if (
        errorMessage.includes("Invalid OTP") ||
        errorMessage.includes("incorrect OTP")
      ) {
        setOtpError("Invalid or expired OTP");
        showToast("Invalid or expired OTP", "error");
      } else if (errorMessage.includes("expired")) {
        setOtpError("OTP has expired");
        showToast("OTP has expired. Please request a new one.", "error");
      } else {
        showToast(errorMessage, "error");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !isLoading && !isResettingPassword) {
      handleSubmit();
    }
  };

  const handleOtpChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, "").slice(0, 6);
    setFormData({ ...formData, otp: value });
    if (otpError) setOtpError("");
  };

  const handleResendOTP = async () => {
    if (!formData.email.trim()) {
      showToast("Email is required to resend OTP", "error");
      return;
    }

    try {
      const { forgotPassword } = useAuthStore.getState();
      await forgotPassword({ email: formData.email.trim() });
      showToast("New OTP has been sent to your email", "success");
    } catch (error: any) {
      showToast(error.message || "Failed to resend OTP", "error");
    }
  };

  const isButtonDisabled =
    isLoading ||
    isResettingPassword ||
    !formData.email ||
    !formData.otp ||
    !formData.newPassword ||
    !formData.confirmPassword;

  return (
    <AuthLayout
      title="Reset Password"
      subtitle="Enter the 6-digit code sent to your email and your new password."
    >
      <div className="space-y-5">
        {/* Back to Forgot Password Link */}
        <Link
          href="/forgot-password"
          className="inline-flex items-center gap-2 text-sm text-gray-600 hover:text-[#FF6B6B] transition-colors mb-2"
        >
          <ArrowLeft className="w-4 h-4" />
          Back
        </Link>

        {/* Email Display (Read-only) */}
        <div className="space-y-2">
          <label className="text-sm font-semibold text-gray-700 pl-1">
            Email Address
          </label>
          <div className="relative">
            <div className="w-full px-4 py-3.5 bg-gray-100 border border-gray-200 rounded-xl text-gray-700">
              {formData.email || "No email found"}
            </div>
          </div>
        </div>

        {/* OTP Input */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label
              htmlFor="otp"
              className="text-sm font-semibold text-gray-700 pl-1"
            >
              Verification Code (6 digits)
            </label>
            <button
              type="button"
              onClick={handleResendOTP}
              className="text-sm text-[#FF6B6B] hover:text-[#ff5252] transition-colors disabled:opacity-50"
              disabled={isLoading || !formData.email}
            >
              Resend OTP
            </button>
          </div>
          <div className="relative group">
            <KeyRound className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5 transition-colors group-focus-within:text-[#FF6B6B]" />
            <input
              id="otp"
              type="text"
              inputMode="numeric"
              value={formData.otp}
              onChange={handleOtpChange}
              onKeyPress={handleKeyPress}
              placeholder="123456"
              className={`w-full pl-12 pr-4 py-3.5 bg-gray-50 border ${
                otpError ? "border-red-300" : "border-gray-200"
              } rounded-xl focus:ring-2 focus:ring-[#FF6B6B]/30 focus:border-[#FF6B6B] focus:bg-white transition-all outline-none text-gray-900 placeholder:text-gray-400 disabled:opacity-50 disabled:cursor-not-allowed`}
              disabled={isLoading || isResettingPassword}
              autoComplete="one-time-code"
              maxLength={6}
            />
          </div>
          {otpError && <p className="text-sm text-red-600">{otpError}</p>}
        </div>

        {/* New Password Input */}
        <div className="space-y-2">
          <label
            htmlFor="newPassword"
            className="text-sm font-semibold text-gray-700 pl-1"
          >
            New Password
          </label>
          <div className="relative group">
            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5 transition-colors group-focus-within:text-[#FF6B6B]" />
            <input
              id="newPassword"
              type={showNewPassword ? "text" : "password"}
              value={formData.newPassword}
              onChange={(e) =>
                setFormData({ ...formData, newPassword: e.target.value })
              }
              onKeyPress={handleKeyPress}
              placeholder="Enter new password"
              className="w-full pl-12 pr-12 py-3.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#FF6B6B]/30 focus:border-[#FF6B6B] focus:bg-white transition-all outline-none text-gray-900 placeholder:text-gray-400 disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={isLoading || isResettingPassword}
              autoComplete="new-password"
            />
            <button
              type="button"
              onClick={() => setShowNewPassword(!showNewPassword)}
              className="absolute right-4 cursor-pointer top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors focus:outline-none disabled:opacity-50"
              aria-label={showNewPassword ? "Hide password" : "Show password"}
              disabled={isLoading || isResettingPassword}
            >
              {showNewPassword ? (
                <EyeOff className="w-5 h-5" />
              ) : (
                <Eye className="w-5 h-5" />
              )}
            </button>
          </div>
          <p className="text-xs text-gray-500">
            Must be at least 8 characters with uppercase, lowercase, and a
            number
          </p>
        </div>

        {/* Confirm Password Input */}
        <div className="space-y-2">
          <label
            htmlFor="confirmPassword"
            className="text-sm font-semibold text-gray-700 pl-1"
          >
            Confirm New Password
          </label>
          <div className="relative group">
            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5 transition-colors group-focus-within:text-[#FF6B6B]" />
            <input
              id="confirmPassword"
              type={showConfirmPassword ? "text" : "password"}
              value={formData.confirmPassword}
              onChange={(e) =>
                setFormData({ ...formData, confirmPassword: e.target.value })
              }
              onKeyPress={handleKeyPress}
              placeholder="Confirm new password"
              className="w-full pl-12 pr-12 py-3.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#FF6B6B]/30 focus:border-[#FF6B6B] focus:bg-white transition-all outline-none text-gray-900 placeholder:text-gray-400 disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={isLoading || isResettingPassword}
              autoComplete="new-password"
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute right-4 cursor-pointer top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors focus:outline-none disabled:opacity-50"
              aria-label={
                showConfirmPassword ? "Hide password" : "Show password"
              }
              disabled={isLoading || isResettingPassword}
            >
              {showConfirmPassword ? (
                <EyeOff className="w-5 h-5" />
              ) : (
                <Eye className="w-5 h-5" />
              )}
            </button>
          </div>
        </div>

        {/* Password Match Indicator */}
        {formData.newPassword && formData.confirmPassword && (
          <div
            className={`text-sm ${
              formData.newPassword === formData.confirmPassword
                ? "text-green-600"
                : "text-red-600"
            }`}
          >
            {formData.newPassword === formData.confirmPassword
              ? "✓ Passwords match"
              : "✗ Passwords do not match"}
          </div>
        )}

        {/* Submit Button */}
        <button
          onClick={handleSubmit}
          disabled={isButtonDisabled}
          className="w-full bg-linear-to-r from-[#FF6B6B] cursor-pointer to-[#ff5252] text-white text-sm py-4 rounded-xl hover:shadow-lg hover:shadow-red-200/50 transition-all shadow-md shadow-red-100 flex items-center justify-center gap-2.5 mt-8 disabled:opacity-70 disabled:cursor-not-allowed group"
        >
          {isLoading || isResettingPassword ? (
            <>
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              <span>Resetting Password...</span>
            </>
          ) : (
            <span>Reset Password</span>
          )}
        </button>

        {/* Help Text */}
        <div className="text-center pt-4">
          <p className="text-sm text-gray-500">
            After resetting, you'll be redirected to login with your new
            password.
          </p>
        </div>
      </div>
    </AuthLayout>
  );
}
