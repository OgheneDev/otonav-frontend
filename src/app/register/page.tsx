"use client";

import { useState, useMemo } from "react";
import {
  User,
  Mail,
  Lock,
  Building2,
  Phone,
  MapPin,
  ArrowRight,
  Eye,
  EyeOff,
  Check,
  X,
} from "lucide-react";
import AuthLayout from "@/components/AuthLayout";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/stores";
import { useToastStore } from "@/stores";

export default function Register() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    businessName: "",
    businessAddress: "",
    email: "",
    password: "",
    phoneNumber: "",
  });
  const [passwordFocused, setPasswordFocused] = useState(false);

  const { registerBusiness, isSigningUp } = useAuthStore();
  const { showToast } = useToastStore();

  // Password strength calculation
  const passwordStrength = useMemo(() => {
    const password = formData.password;
    const checks = {
      length: password.length >= 8,
      uppercase: /[A-Z]/.test(password),
      lowercase: /[a-z]/.test(password),
      number: /[0-9]/.test(password),
      special: /[!@#$%^&*(),.?":{}|<>]/.test(password),
    };

    const passedChecks = Object.values(checks).filter(Boolean).length;

    let strength = 0;
    let label = "Weak";
    let color = "bg-red-500";

    if (passedChecks >= 5) {
      strength = 100;
      label = "Strong";
      color = "bg-green-500";
    } else if (passedChecks >= 3) {
      strength = 60;
      label = "Medium";
      color = "bg-yellow-500";
    } else if (passedChecks >= 1) {
      strength = 30;
      label = "Weak";
      color = "bg-red-500";
    }

    return { checks, strength, label, color, passedChecks };
  }, [formData.password]);

  // Format phone number for display - only allow digits
  const formatPhoneNumber = (value: string) => {
    // Remove all non-digit characters
    const digits = value.replace(/\D/g, "");
    // Limit to 10 digits
    return digits.slice(0, 10);
  };

  // Format phone number with +234 for backend
  const formatPhoneForBackend = (phoneNumber: string) => {
    const digits = phoneNumber.replace(/\D/g, "");
    if (digits.length === 10) {
      return `+234${digits}`;
    }
    return phoneNumber;
  };

  const validateForm = () => {
    // Validate name
    if (!formData.name.trim()) {
      showToast("Please enter your full name", "error");
      return false;
    }

    // Validate business name
    if (!formData.businessName.trim()) {
      showToast("Please enter your business name", "error");
      return false;
    }

    // Validate business address
    if (!formData.businessAddress.trim()) {
      showToast("Please enter your business address", "error");
      return false;
    }

    // Validate email
    if (!formData.email.trim()) {
      showToast("Please enter your email address", "error");
      return false;
    }

    if (!/\S+@\S+\.\S+/.test(formData.email)) {
      showToast("Please enter a valid email address", "error");
      return false;
    }

    // Validate phone number (COMPULSORY)
    if (!formData.phoneNumber.trim()) {
      showToast("Please enter your phone number", "error");
      return false;
    }

    // Ensure exactly 10 digits
    const phoneDigits = formData.phoneNumber.replace(/\D/g, "");
    if (phoneDigits.length !== 10) {
      showToast("Phone number must be exactly 10 digits", "error");
      return false;
    }

    // Validate password
    if (!formData.password) {
      showToast("Please create a password", "error");
      return false;
    }

    if (passwordStrength.passedChecks < 5) {
      showToast("Please meet all password requirements", "error");
      return false;
    }

    return true;
  };

  const handleSubmit = async () => {
    if (!validateForm()) {
      return;
    }

    try {
      // Format phone number for backend with +234 prefix
      const formattedPhoneNumber = formatPhoneForBackend(formData.phoneNumber);

      const response = await registerBusiness({
        email: formData.email.trim(),
        password: formData.password,
        name: formData.name.trim(),
        businessName: formData.businessName.trim(),
        businessAddress: formData.businessAddress.trim(),
        phoneNumber: formattedPhoneNumber, // Now in +234 format
      });

      showToast(
        "Registration successful! Please check your email for verification OTP.",
        "success",
      );

      // Store email and user type in localStorage for verification page
      localStorage.setItem("pendingVerificationEmail", formData.email.trim());
      localStorage.setItem("pendingUserType", "business");

      router.push("/verify-email");
    } catch (error: any) {
      console.error("Registration error:", error);

      // Handle specific error messages
      const errorMessage =
        error.message || "Registration failed. Please try again.";

      if (
        errorMessage.includes("already exists") ||
        errorMessage.includes("already registered")
      ) {
        showToast("An account with this email already exists", "error");
      } else if (
        errorMessage.includes("phone") &&
        errorMessage.includes("already")
      ) {
        showToast("This phone number is already registered", "error");
      } else if (
        errorMessage.includes("password") &&
        errorMessage.includes("weak")
      ) {
        showToast("Please choose a stronger password", "error");
      } else {
        showToast(errorMessage, "error");
      }
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !isSigningUp) {
      handleSubmit();
    }
  };

  // Handle phone input change
  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;

    // Format phone number for display
    const formattedPhone = formatPhoneNumber(value);
    setFormData({ ...formData, phoneNumber: formattedPhone });
  };

  const isButtonDisabled = isSigningUp || passwordStrength.passedChecks < 5;

  return (
    <AuthLayout
      title="Start Your Business Journey"
      subtitle="Create your business account to manage deliveries and grow your operations."
    >
      <div className="space-y-5">
        {/* Name & Business - Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-2">
            <label
              htmlFor="fullName"
              className="text-sm font-semibold text-gray-700 pl-1"
            >
              Full Name *
            </label>
            <div className="relative group">
              <User className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5 transition-colors group-focus-within:text-[#FF6B6B]" />
              <input
                id="fullName"
                type="text"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                onKeyPress={handleKeyPress}
                placeholder="John Doe"
                className="w-full pl-12 pr-4 py-3.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#FF6B6B]/30 focus:border-[#FF6B6B] focus:bg-white transition-all outline-none text-gray-900 placeholder:text-gray-400 disabled:opacity-50"
                disabled={isSigningUp}
                autoComplete="name"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label
              htmlFor="business"
              className="text-sm font-semibold text-gray-700 pl-1"
            >
              Business Name *
            </label>
            <div className="relative group">
              <Building2 className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5 transition-colors group-focus-within:text-[#FF6B6B]" />
              <input
                id="business"
                type="text"
                value={formData.businessName}
                onChange={(e) =>
                  setFormData({ ...formData, businessName: e.target.value })
                }
                onKeyPress={handleKeyPress}
                placeholder="Acme Logistics"
                className="w-full pl-12 pr-4 py-3.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#FF6B6B]/30 focus:border-[#FF6B6B] focus:bg-white transition-all outline-none text-gray-900 placeholder:text-gray-400 disabled:opacity-50"
                disabled={isSigningUp}
                autoComplete="organization"
              />
            </div>
          </div>
        </div>

        {/* Business Address */}
        <div className="space-y-2">
          <label
            htmlFor="businessAddress"
            className="text-sm font-semibold text-gray-700 pl-1"
          >
            Business Address *
            <span className="text-xs text-gray-500 ml-1 font-normal">
              (Physical location of your business)
            </span>
          </label>
          <div className="relative group">
            <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5 transition-colors group-focus-within:text-[#FF6B6B]" />
            <input
              id="businessAddress"
              type="text"
              value={formData.businessAddress}
              onChange={(e) =>
                setFormData({ ...formData, businessAddress: e.target.value })
              }
              onKeyPress={handleKeyPress}
              placeholder="123 Business St, City, State"
              className="w-full pl-12 pr-4 py-3.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#FF6B6B]/30 focus:border-[#FF6B6B] focus:bg-white transition-all outline-none text-gray-900 placeholder:text-gray-400 disabled:opacity-50"
              disabled={isSigningUp}
              autoComplete="street-address"
            />
          </div>
        </div>

        {/* Email Input */}
        <div className="space-y-2">
          <label
            htmlFor="email"
            className="text-sm font-semibold text-gray-700 pl-1"
          >
            Email Address *
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
              placeholder="owner@company.com"
              className="w-full pl-12 pr-4 py-3.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#FF6B6B]/30 focus:border-[#FF6B6B] focus:bg-white transition-all outline-none text-gray-900 placeholder:text-gray-400 disabled:opacity-50"
              disabled={isSigningUp}
              autoComplete="email"
            />
          </div>
        </div>

        {/* Phone Number Input - NOW COMPULSORY */}
        <div className="space-y-2">
          <label
            htmlFor="phoneNumber"
            className="text-sm font-semibold text-gray-700 pl-1"
          >
            Phone Number *
            <span className="text-xs text-gray-500 ml-1 font-normal">
              (Required for account verification)
            </span>
          </label>
          <div className="relative group">
            <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5 transition-colors group-focus-within:text-[#FF6B6B]" />
            <input
              id="phoneNumber"
              type="tel"
              value={formData.phoneNumber}
              onChange={handlePhoneChange}
              onKeyPress={handleKeyPress}
              placeholder="08012345678"
              className="w-full pl-12 pr-16 py-3.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#FF6B6B]/30 focus:border-[#FF6B6B] focus:bg-white transition-all outline-none text-gray-900 placeholder:text-gray-400 disabled:opacity-50"
              disabled={isSigningUp}
              autoComplete="tel"
              required
              maxLength={11} // 10 digits + visual buffer
            />
            <div className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 font-medium text-sm">
              (+234)
            </div>
            {formData.phoneNumber && (
              <div className="absolute right-12 top-1/2 -translate-y-1/2">
                {(() => {
                  const phoneDigits = formData.phoneNumber.replace(/\D/g, "");
                  if (phoneDigits.length === 10) {
                    return <Check className="w-5 h-5 text-green-500" />;
                  }
                  return <X className="w-5 h-5 text-gray-300" />;
                })()}
              </div>
            )}
          </div>
          <div className="flex justify-between px-1">
            <p className="text-xs text-gray-500 font-medium">
              {formData.phoneNumber.replace(/\D/g, "").length}/10 digits
            </p>
          </div>
        </div>

        {/* Password Input with Strength Meter */}
        <div className="space-y-2">
          <label
            htmlFor="password"
            className="text-sm font-semibold text-gray-700 pl-1"
          >
            Password *
          </label>
          <div className="relative group">
            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5 transition-colors group-focus-within:text-[#FF6B6B]" />
            <input
              id="password"
              type={showPassword ? "text" : "password"}
              value={formData.password}
              onChange={(e) =>
                setFormData({ ...formData, password: e.target.value })
              }
              onFocus={() => setPasswordFocused(true)}
              onKeyPress={handleKeyPress}
              placeholder="Create a strong password"
              className="w-full pl-12 pr-12 py-3.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#FF6B6B]/30 focus:border-[#FF6B6B] focus:bg-white transition-all outline-none text-gray-900 placeholder:text-gray-400 disabled:opacity-50"
              disabled={isSigningUp}
              autoComplete="new-password"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors focus:outline-none disabled:opacity-50"
              aria-label={showPassword ? "Hide password" : "Show password"}
              disabled={isSigningUp}
            >
              {showPassword ? (
                <EyeOff className="w-5 h-5" />
              ) : (
                <Eye className="w-5 h-5" />
              )}
            </button>
          </div>

          {/* Password Strength Meter */}
          {formData.password && (
            <div className="space-y-2 mt-3">
              <div className="flex items-center justify-between px-1">
                <span className="text-xs font-semibold text-gray-600">
                  Password Strength
                </span>
                <span
                  className={`text-xs font-bold ${
                    passwordStrength.label === "Strong"
                      ? "text-green-600"
                      : passwordStrength.label === "Medium"
                        ? "text-yellow-600"
                        : "text-red-600"
                  }`}
                >
                  {passwordStrength.label}
                </span>
              </div>
              <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                <div
                  className={`h-full ${passwordStrength.color} transition-all duration-300 ease-out`}
                  style={{ width: `${passwordStrength.strength}%` }}
                />
              </div>
            </div>
          )}

          {/* Password Requirements */}
          {(passwordFocused || formData.password) && (
            <div className="bg-gray-50 border border-gray-200 rounded-xl p-4 space-y-2 mt-3">
              <p className="text-xs font-semibold text-gray-700 mb-2">
                Password must contain:
              </p>
              <div className="space-y-1.5">
                <RequirementItem
                  met={passwordStrength.checks.length}
                  text="At least 8 characters"
                />
                <RequirementItem
                  met={passwordStrength.checks.uppercase}
                  text="One uppercase letter (A-Z)"
                />
                <RequirementItem
                  met={passwordStrength.checks.lowercase}
                  text="One lowercase letter (a-z)"
                />
                <RequirementItem
                  met={passwordStrength.checks.number}
                  text="One number (0-9)"
                />
                <RequirementItem
                  met={passwordStrength.checks.special}
                  text="One special character (!@#$%...)"
                />
              </div>
            </div>
          )}
        </div>

        {/* Terms and Conditions */}
        <div className="flex items-start gap-2.5 pt-2">
          <input
            type="checkbox"
            id="terms"
            className="w-4 h-4 mt-1 rounded border-2 border-gray-300 text-[#FF6B6B] focus:ring-2 focus:ring-[#FF6B6B]/30 focus:ring-offset-0 cursor-pointer transition-all disabled:opacity-50"
            disabled={isSigningUp}
          />
          <label htmlFor="terms" className="text-sm text-gray-600">
            I agree to the{" "}
            <Link
              href="/terms"
              className="text-[#FF6B6B] hover:text-[#ff5252] underline text-[12px]"
            >
              Terms of Service
            </Link>{" "}
            and{" "}
            <Link
              href="/privacy"
              className="text-[#FF6B6B] hover:text-[#ff5252] underline text-[12px]"
            >
              Privacy Policy
            </Link>
          </label>
        </div>

        {/* Submit Button */}
        <button
          onClick={handleSubmit}
          disabled={isButtonDisabled}
          className="group w-full bg-linear-to-r cursor-pointer from-[#FF6B6B] to-[#ff5252] text-white text-sm py-4 rounded-xl hover:shadow-lg hover:shadow-red-200/50 transition-all shadow-md shadow-red-100 flex items-center justify-center gap-2.5 mt-8 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSigningUp ? (
            <>
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              <span>Creating Account...</span>
            </>
          ) : (
            <>
              <span>Create Business Account</span>
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
            <span className="px-4 bg-white text-gray-500">
              Already have a business account?
            </span>
          </div>
        </div>

        {/* Login Link */}
        <Link
          href="/login"
          className="w-full border-2 border-gray-200 text-gray-700 text-sm py-4 rounded-xl hover:border-[#FF6B6B] hover:bg-red-50/50 transition-all flex items-center justify-center gap-2 group"
        >
          <span>Sign In to Business Account</span>
          <span className="text-[#FF6B6B] group-hover:translate-x-0.5 transition-transform">
            →
          </span>
        </Link>
      </div>
    </AuthLayout>
  );
}

function RequirementItem({ met, text }: { met: boolean; text: string }) {
  return (
    <div className="flex items-center gap-2">
      <div
        className={`w-4 h-4 rounded-full flex items-center justify-center transition-colors ${
          met ? "bg-green-500" : "bg-gray-300"
        }`}
      >
        {met ? (
          <Check className="w-3 h-3 text-white" strokeWidth={3} />
        ) : (
          <X className="w-2.5 h-2.5 text-gray-500" strokeWidth={3} />
        )}
      </div>
      <span
        className={`text-xs transition-colors ${
          met ? "text-gray-700 font-medium" : "text-gray-500"
        }`}
      >
        {text}
      </span>
    </div>
  );
}
