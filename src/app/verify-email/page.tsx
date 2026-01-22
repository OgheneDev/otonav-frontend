"use client";

import { useState, useEffect, useRef } from "react";
import {
  Mail,
  CheckCircle,
  ArrowRight,
  RefreshCw,
  Smartphone,
  ExternalLink,
} from "lucide-react";
import AuthLayout from "@/components/AuthLayout";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/stores";
import { useToastStore } from "@/stores";

export default function VerifyEmail() {
  const router = useRouter();
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [email, setEmail] = useState("");
  const [isResending, setIsResending] = useState(false);
  const [countdown, setCountdown] = useState(0);
  const [verificationSuccess, setVerificationSuccess] = useState(false);
  const [userType, setUserType] = useState<"business" | "rider" | "customer">(
    "business",
  ); // Default to business
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  const { verifyEmail, resendOTP, isVerifyingEmail } = useAuthStore();
  const { showToast } = useToastStore();

  // Get email from localStorage on component mount and start countdown
  useEffect(() => {
    const storedEmail = localStorage.getItem("pendingVerificationEmail");
    const storedUserType =
      (localStorage.getItem("pendingUserType") as
        | "business"
        | "rider"
        | "customer") || "business";

    if (storedEmail) {
      setEmail(storedEmail);
      setUserType(storedUserType);

      // Start countdown every time component mounts
      setCountdown(60);
    } else {
      // If no email found, redirect to home
      showToast("No pending verification found", "error");
      router.push("/");
    }
  }, [router, showToast]); // This effect runs on every mount

  // Countdown timer for resend OTP
  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [countdown]);

  // Handle redirect after successful verification for business users
  useEffect(() => {
    if (verificationSuccess && userType === "business") {
      // Show success message for a moment before redirecting
      const timer = setTimeout(() => {
        router.push("/login");
      }, 2000); // 2 seconds delay to show success message

      return () => clearTimeout(timer);
    }
  }, [verificationSuccess, userType, router]);

  const handleOtpChange = (index: number, value: string) => {
    // Only allow numbers
    if (!/^\d*$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // Auto-focus next input
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }

    // FIXED: Auto-submit using the newOtp array, not the state
    if (newOtp.every((digit) => digit !== "") && index === 5) {
      // Use newOtp to create the OTP code, not the state
      const otpCode = newOtp.join("");
      handleVerifyWithCode(otpCode);
    }
  };

  const handleVerifyWithCode = async (otpCode: string) => {
    if (!email) {
      showToast("Email not found. Please register again.", "error");
      router.push("/");
      return;
    }

    try {
      await verifyEmail({
        email,
        otp: otpCode,
      });

      setVerificationSuccess(true);
      showToast("Verification successful! You can now login.", "success");

      // Clear stored email
      localStorage.removeItem("pendingVerificationEmail");
      localStorage.removeItem("pendingUserType");
    } catch (error: any) {
      console.error("Verification error:", error);
      showToast(
        error.message ||
          "Verification failed. Please check the OTP and try again.",
        "error",
      );
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      // Move to previous input on backspace
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pasteData = e.clipboardData.getData("text").slice(0, 6);
    if (/^\d+$/.test(pasteData)) {
      const newOtp = pasteData.split("").slice(0, 6);
      const updatedOtp = [...otp];
      newOtp.forEach((digit, index) => {
        updatedOtp[index] = digit;
      });
      setOtp(updatedOtp);

      // Focus the last filled input or the last one
      const lastFilledIndex = newOtp.length - 1;
      inputRefs.current[Math.min(lastFilledIndex, 5)]?.focus();

      // FIXED: Auto-submit if we pasted 6 digits
      if (newOtp.length === 6) {
        const otpCode = updatedOtp.join("");
        handleVerifyWithCode(otpCode);
      }
    }
  };

  const handleVerify = async () => {
    const otpCode = otp.join("");
    await handleVerifyWithCode(otpCode);
  };

  const handleResendOTP = async () => {
    if (countdown > 0 || !email) return;

    setIsResending(true);
    try {
      await resendOTP({ email });
      showToast("New OTP sent to your email", "success");
      setCountdown(60); // Reset to 60 seconds countdown
    } catch (error: any) {
      showToast(
        error.message || "Failed to resend OTP. Please try again.",
        "error",
      );
    } finally {
      setIsResending(false);
    }
  };

  const handleClearAll = () => {
    setOtp(["", "", "", "", "", ""]);
    inputRefs.current[0]?.focus();
  };

  // Format email for display (mask part of it)
  const getMaskedEmail = () => {
    if (!email) return "";
    const [name, domain] = email.split("@");
    // Show only first 2 and last 1 char of the name
    const maskedName =
      name.length > 3 ? `${name.substring(0, 2)}...${name.slice(-1)}` : name;
    return `${maskedName}@${domain}`;
  };

  // Show mobile app message for riders and customers after verification
  if (
    verificationSuccess &&
    (userType === "rider" || userType === "customer")
  ) {
    return (
      <AuthLayout
        title="Email Verified Successfully!"
        subtitle={`Your ${userType} account is now ready to use.`}
      >
        <div className="space-y-6">
          {/* Success Message */}
          <div className="bg-green-50 border border-green-200 rounded-xl p-6 text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="w-8 h-8 text-green-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Account Activated!
            </h3>
            <p className="text-gray-600 mb-4">
              Your email has been verified successfully. Your {userType} account
              is now active.
            </p>

            {email && (
              <div className="bg-white rounded-lg p-3 mb-4">
                <p className="text-sm text-gray-500">Registered email:</p>
                <p className="text-gray-900 font-medium">{email}</p>
              </div>
            )}
          </div>

          {/* Mobile App Instructions */}
          <div className="bg-blue-50 border border-blue-100 rounded-xl p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                <Smartphone className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <h3 className="font-bold text-gray-900">Download Mobile App</h3>
                <p className="text-sm text-gray-600">
                  Login to the {userType === "rider" ? "rider" : "customer"} app
                  to get started
                </p>
              </div>
            </div>

            <div className="space-y-3">
              <a
                href="https://play.google.com/store/apps/details?id=com.yourapp"
                target="_blank"
                rel="noopener noreferrer"
                className="w-full text-center px-4 py-3 bg-gray-900 hover:bg-gray-800 text-white font-semibold rounded-xl transition-all flex items-center justify-center gap-2"
              >
                <span>Download Android App</span>
                <ExternalLink className="w-4 h-4" />
              </a>

              <a
                href="https://apps.apple.com/app/id"
                target="_blank"
                rel="noopener noreferrer"
                className="w-full text-center px-4 py-3 bg-gray-900 hover:bg-gray-800 text-white font-semibold rounded-xl transition-all flex items-center justify-center gap-2"
              >
                <span>Download iOS App</span>
                <ExternalLink className="w-4 h-4" />
              </a>
            </div>

            <div className="mt-4 pt-4 border-t border-blue-200">
              <p className="text-sm text-gray-600 text-center">
                Already have the app?{" "}
                <span className="font-semibold text-blue-600">
                  Open the app and login with your email
                </span>
              </p>
            </div>
          </div>
        </div>
      </AuthLayout>
    );
  }

  // Show success message for business users before redirecting
  if (verificationSuccess && userType === "business") {
    return (
      <AuthLayout
        title="Verification Successful!"
        subtitle="Your business account has been verified successfully."
      >
        <div className="space-y-6">
          {/* Success Message */}
          <div className="bg-green-50 border border-green-200 rounded-xl p-6 text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="w-8 h-8 text-green-600 animate-pulse" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Business Account Verified!
            </h3>
            <p className="text-gray-600 mb-2">
              Verification successful! You can now login.
            </p>
            <p className="text-sm text-gray-500 mb-4">
              Redirecting to login page...
            </p>

            {email && (
              <div className="bg-white rounded-lg p-3 mb-4">
                <p className="text-sm text-gray-500">Registered email:</p>
                <p className="text-gray-900 font-medium">{email}</p>
              </div>
            )}
          </div>

          {/* Manual redirect button in case auto-redirect fails */}
          <div className="text-center">
            <button
              onClick={() => router.push("/login")}
              className="text-sm text-[#FF6B6B] hover:text-[#ff5252] font-semibold cursor-pointer transition-colors"
            >
              Click here if not redirected automatically
            </button>
          </div>
        </div>
      </AuthLayout>
    );
  }

  // Show regular verification UI for business users or before verification
  return (
    <AuthLayout
      title="Verify Your Email"
      subtitle="We've sent a 6-digit verification code to your email address."
    >
      <div className="space-y-6">
        {/* Email Display */}
        <div className="bg-gray-50 border border-gray-200 rounded-xl p-5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-red-50 rounded-full flex items-center justify-center">
                <Mail className="w-5 h-5 text-[#FF6B6B]" />
              </div>
              <div>
                <p className="text-sm text-gray-600">
                  Verification code sent to
                </p>
                <p className="font-semibold text-gray-900 truncate">
                  {getMaskedEmail()}
                </p>
              </div>
            </div>
            <CheckCircle className="w-6 h-6 text-green-500" />
          </div>
        </div>

        {/* OTP Inputs */}
        <div className="space-y-4">
          <div className="flex justify-between items-center px-1">
            <label className="text-sm font-semibold text-gray-700">
              Enter 6-digit code
            </label>
            {/* Moved Clear All here to save vertical space on mobile */}
            <button
              onClick={handleClearAll}
              className="text-xs text-gray-400 cursor-pointer hover:text-[#FF6B6B] transition-colors font-bold uppercase tracking-wider"
              disabled={isVerifyingEmail}
            >
              Clear all
            </button>
          </div>

          <div className="grid grid-cols-6 gap-2 sm:gap-3">
            {otp.map((digit, index) => (
              <div key={index} className="relative group aspect-square">
                <input
                  ref={(el) => {
                    inputRefs.current[index] = el;
                  }}
                  type="text"
                  inputMode="numeric"
                  autoComplete="one-time-code"
                  pattern="\d*"
                  maxLength={1}
                  value={digit}
                  onChange={(e) => handleOtpChange(index, e.target.value)}
                  onKeyDown={(e) => handleKeyDown(index, e)}
                  onPaste={handlePaste}
                  className="w-full h-full text-center text-xl sm:text-2xl font-black bg-gray-50 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-[#FF6B6B]/10 focus:border-[#FF6B6B] focus:bg-white transition-all outline-none text-gray-900 disabled:opacity-50"
                  disabled={isVerifyingEmail}
                  autoFocus={index === 0}
                />
                {/* Active indicator bar */}
                <div className="absolute -bottom-1 left-2 right-2 h-1 bg-transparent group-focus-within:bg-[#FF6B6B] rounded-full transition-colors" />
              </div>
            ))}
          </div>
        </div>

        {/* Resend OTP */}
        <div className="flex items-center justify-center gap-2">
          <p className="text-sm text-gray-600">Didn't receive the code?</p>
          <button
            onClick={handleResendOTP}
            disabled={isResending || countdown > 0 || isVerifyingEmail}
            className="text-sm font-semibold text-[#FF6B6B] cursor-pointer hover:text-[#ff5252] transition-colors flex items-center gap-1 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isResending ? (
              <>
                <RefreshCw className="w-3 h-3 animate-spin" />
                Sending...
              </>
            ) : countdown > 0 ? (
              `Resend in ${countdown}s`
            ) : (
              "Resend OTP"
            )}
          </button>
        </div>

        {/* Verify Button */}
        <button
          onClick={handleVerify}
          disabled={isVerifyingEmail || otp.some((digit) => digit === "")}
          className="w-full bg-linear-to-r from-[#FF6B6B] cursor-pointer to-[#ff5252] text-white font-bold py-4 rounded-xl hover:shadow-lg hover:shadow-red-200/50 transition-all shadow-md shadow-red-100 flex items-center justify-center gap-2.5 mt-4 disabled:opacity-50 disabled:cursor-not-allowed group"
        >
          {isVerifyingEmail ? (
            <>
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              <span>Verifying...</span>
            </>
          ) : (
            <>
              <span>Verify Email</span>
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </>
          )}
        </button>

        {/* Divider */}
        <div className="relative py-4">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-200"></div>
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-4 bg-white text-gray-500">Need help?</span>
          </div>
        </div>

        {/* Support Links */}
        <div className="space-y-3">
          <Link
            href="mailto:support@otonav.com"
            className="block text-center text-sm text-gray-600 hover:text-[#FF6B6B] transition-colors font-medium"
          >
            Contact Support
          </Link>
          <Link
            href="/register"
            className="block text-center text-sm text-gray-600 hover:text-[#FF6B6B] transition-colors font-medium"
          >
            Wrong email? Register again
          </Link>
        </div>
      </div>
    </AuthLayout>
  );
}
