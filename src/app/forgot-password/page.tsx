"use client";

import { useState } from "react";
import { Mail, ArrowLeft, Loader2 } from "lucide-react";
import AuthLayout from "@/components/AuthLayout";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/stores";
import { useToastStore } from "@/stores";

export default function ForgotPassword() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    email: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [otpSent, setOtpSent] = useState(false);

  const { forgotPassword, isSendingResetEmail } = useAuthStore();
  const { showToast } = useToastStore();

  const handleSubmit = async () => {
    // Validate form
    if (!formData.email.trim()) {
      showToast("Please enter your email address", "error");
      return;
    }

    if (!/\S+@\S+\.\S+/.test(formData.email)) {
      showToast("Please enter a valid email address", "error");
      return;
    }

    setIsLoading(true);

    try {
      await forgotPassword({ email: formData.email.trim() });

      // Store email in session storage for password reset page
      if (typeof window !== "undefined") {
        sessionStorage.setItem("resetEmail", formData.email.trim());
      }

      setOtpSent(true);
      showToast("OTP has been sent to your email", "success");

      // Auto-redirect to reset page after 2 seconds
      setTimeout(() => {
        router.push("/password-reset");
      }, 2000);
    } catch (error: any) {
      console.error("Forgot password error:", error);

      // Handle specific error messages
      const errorMessage =
        error.message || "Failed to send OTP. Please try again.";

      if (
        errorMessage.includes("not found") ||
        errorMessage.includes("does not exist")
      ) {
        showToast("No account found with this email", "error");
      } else if (errorMessage.includes("too many attempts")) {
        showToast("Too many attempts. Please try again later.", "error");
      } else {
        showToast(errorMessage, "error");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !isLoading && !isSendingResetEmail) {
      handleSubmit();
    }
  };

  const isButtonDisabled = isLoading || isSendingResetEmail || !formData.email;

  return (
    <AuthLayout
      title="Reset Your Password"
      subtitle="Enter your email address and we'll send you a verification code."
    >
      <div className="space-y-5">
        {/* Back to Login Link */}
        <Link
          href="/login"
          className="inline-flex items-center gap-2 text-sm text-gray-600 hover:text-[#FF6B6B] transition-colors mb-2"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to login
        </Link>

        {/* Email Input */}
        <div className="space-y-2">
          <label
            htmlFor="email"
            className="text-sm font-semibold text-gray-700 pl-1"
          >
            Email Address
          </label>
          <div className="relative group">
            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5 transition-colors group-focus-within:text-[#FF6B6B]" />
            <input
              id="email"
              type="email"
              value={formData.email}
              onChange={(e) =>
                setFormData({ ...formData, email: e.target.value })
              }
              onKeyPress={handleKeyPress}
              placeholder="owner@business.com"
              className="w-full pl-12 pr-4 py-3.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#FF6B6B]/30 focus:border-[#FF6B6B] focus:bg-white transition-all outline-none text-gray-900 placeholder:text-gray-400 disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={isLoading || isSendingResetEmail || otpSent}
              autoComplete="email"
            />
          </div>
          {otpSent && (
            <p className="text-sm text-green-600 mt-2">
              ✓ OTP sent successfully. Redirecting...
            </p>
          )}
        </div>

        {/* Submit Button */}
        <button
          onClick={handleSubmit}
          disabled={isButtonDisabled || otpSent}
          className="w-full bg-linear-to-r from-[#FF6B6B] cursor-pointer to-[#ff5252] text-white text-sm py-4 rounded-xl hover:shadow-lg hover:shadow-red-200/50 transition-all shadow-md shadow-red-100 flex items-center justify-center gap-2.5 mt-8 disabled:opacity-70 disabled:cursor-not-allowed group"
        >
          {isLoading || isSendingResetEmail ? (
            <>
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              <span>Sending OTP...</span>
            </>
          ) : otpSent ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              <span>OTP Sent!</span>
            </>
          ) : (
            <span>Send Verification Code</span>
          )}
        </button>

        {/* Help Text */}
        <div className="text-center pt-4">
          <p className="text-sm text-gray-500">
            You will receive a 6-digit OTP to reset your password.
            <br />
            The code expires in 10 minutes.
          </p>
        </div>
      </div>
    </AuthLayout>
  );
}
