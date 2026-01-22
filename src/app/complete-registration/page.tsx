"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import {
  CheckCircle,
  AlertCircle,
  User,
  Shield,
  Phone,
  Eye,
  EyeOff,
  Lock,
  Mail,
  ArrowRight,
} from "lucide-react";
import { useAuthStore } from "@/stores";

// Create a separate component that uses useSearchParams
function CompleteRegistrationContent() {
  const searchParams = useSearchParams();
  const { completeRiderRegistration, completeCustomerRegistration } =
    useAuthStore();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [decodedToken, setDecodedToken] = useState<any>(null);
  const [userEmail, setUserEmail] = useState<string>("");

  const [formData, setFormData] = useState({
    password: "",
    confirmPassword: "",
    phoneNumber: "",
    token: "",
    type: "",
  });

  const router = useRouter();

  useEffect(() => {
    const token = searchParams.get("token");
    const type = searchParams.get("type");

    if (!token || !type) {
      setError(
        "Invalid registration link. Please check your email for the correct link.",
      );
      return;
    }

    if (type !== "rider" && type !== "customer") {
      setError(
        "Invalid registration type. Please use a valid registration link.",
      );
      return;
    }

    // Decode the JWT token to extract email and other info
    try {
      const base64Url = token.split(".")[1];
      const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
      const payload = JSON.parse(window.atob(base64));
      setDecodedToken(payload);

      // Extract email from token
      if (payload.email) {
        setUserEmail(payload.email);
      }
    } catch (err) {
      console.warn(
        "Could not decode token, continuing without pre-filled data",
      );
    }

    setFormData((prev) => ({
      ...prev,
      token: token,
      type: type,
    }));
  }, [searchParams]);

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
    // Phone validation - required for both rider and customer
    if (!formData.phoneNumber.trim()) {
      setError("Phone number is required");
      return false;
    }

    // Ensure exactly 10 digits
    const phoneDigits = formData.phoneNumber.replace(/\D/g, "");
    if (phoneDigits.length !== 10) {
      setError("Phone number must be exactly 10 digits");
      return false;
    }

    // Password validation
    if (!formData.password) {
      setError("Please enter a password");
      return false;
    }

    if (formData.password.length < 8) {
      setError("Password must be at least 8 characters long");
      return false;
    }

    if (!/(?=.*[a-z])/.test(formData.password)) {
      setError("Password must contain at least one lowercase letter");
      return false;
    }

    if (!/(?=.*[A-Z])/.test(formData.password)) {
      setError("Password must contain at least one uppercase letter");
      return false;
    }

    if (!/(?=.*\d)/.test(formData.password)) {
      setError("Password must contain at least one number");
      return false;
    }

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      return false;
    }

    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!validateForm()) {
      return;
    }

    setIsLoading(true);

    try {
      // Format phone number for backend with +234 prefix
      const formattedPhoneNumber = formatPhoneForBackend(formData.phoneNumber);

      let response;
      if (formData.type === "rider") {
        response = await completeRiderRegistration({
          token: formData.token,
          password: formData.password,
          phoneNumber: formattedPhoneNumber,
        });
      } else {
        response = await completeCustomerRegistration({
          token: formData.token,
          password: formData.password,
          phoneNumber: formattedPhoneNumber,
        });
      }

      // Store email and user type for verification page
      if (userEmail) {
        localStorage.setItem("pendingVerificationEmail", userEmail);
        localStorage.setItem("pendingUserType", formData.type);

        // Redirect to verify-email page instead of dashboard
        setSuccess(true);
        setTimeout(() => {
          router.push("/verify-email");
        }, 1500);
      } else {
        // Fallback: if no email in token, show success message
        setSuccess(true);
        setTimeout(() => {
          router.push("/dashboard");
        }, 2000);
      }
    } catch (err: any) {
      setError(
        err.message ||
          `Failed to complete ${formData.type} registration. Please try again.`,
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    if (name === "phoneNumber") {
      // Format phone number for display
      const formattedPhone = formatPhoneNumber(value);
      setFormData((prev) => ({
        ...prev,
        [name]: formattedPhone,
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }

    // Clear error when user starts typing
    if (error) setError(null);
  };

  const getRoleDisplay = () => {
    switch (formData.type) {
      case "rider":
        return {
          title: "Rider Registration",
          description: decodedToken?.name
            ? `Complete setup for ${decodedToken.name}`
            : "Complete your rider account setup",
          icon: <User className="w-5 h-5" />,
          color: "text-blue-600 bg-blue-100",
          bgColor: "bg-blue-50",
        };
      case "customer":
        return {
          title: "Customer Registration",
          description: decodedToken?.name
            ? `Complete setup for ${decodedToken.name}`
            : "Complete your customer account setup",
          icon: <Shield className="w-5 h-5" />,
          color: "text-purple-600 bg-purple-100",
          bgColor: "bg-purple-50",
        };
      default:
        return {
          title: "Complete Registration",
          description: "Set up your account",
          icon: <User className="w-5 h-5" />,
          color: "text-gray-600 bg-gray-100",
          bgColor: "bg-gray-50",
        };
    }
  };

  const roleDisplay = getRoleDisplay();

  if (!formData.token || !formData.type) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-gray-50 to-gray-100 px-4">
        <div className="max-w-md w-full bg-white rounded-3xl shadow-xl p-8 text-center">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <AlertCircle className="w-8 h-8 text-red-500" />
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-3">
            Invalid Registration Link
          </h2>
          <p className="text-gray-600 mb-6">
            The registration link is invalid or has expired. Please check your
            email for the correct link or contact support.
          </p>
        </div>
      </div>
    );
  }

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-gray-50 to-gray-100 px-4">
        <div className="max-w-md w-full bg-white rounded-3xl shadow-xl p-8 text-center animate-in fade-in zoom-in duration-500">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="w-8 h-8 text-green-500" />
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-3">
            Registration Complete!
          </h2>
          <p className="text-gray-600 mb-4">
            Your {formData.type} account has been successfully created.
          </p>
          <p className="text-gray-600 mb-6">
            Redirecting to email verification...
          </p>
          <div className="flex items-center justify-center space-x-4">
            <div className={`px-4 py-2 rounded-full ${roleDisplay.bgColor}`}>
              <div className="flex items-center space-x-2">
                {roleDisplay.icon}
                <span className={`font-semibold ${roleDisplay.color}`}>
                  {formData.type.charAt(0).toUpperCase() +
                    formData.type.slice(1)}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-gray-50 to-gray-100 px-4 py-8">
      <div className="max-w-lg w-full">
        {/* Header */}
        <div className="text-center mb-10">
          <div className="flex items-center justify-center gap-3 mb-4">
            <h1 className="text-3xl font-bold text-gray-800">
              {roleDisplay.title}
            </h1>
          </div>
          <p className="text-gray-600 font-medium">{roleDisplay.description}</p>
          {userEmail && (
            <div className="mt-2 inline-flex items-center gap-2 px-4 py-2 bg-gray-100 rounded-full">
              <Mail className="w-4 h-4 text-gray-600" />
              <span className="text-sm text-gray-700 font-medium">
                {userEmail}
              </span>
            </div>
          )}
          {decodedToken?.name && (
            <div className="mt-2 inline-flex items-center gap-2 px-4 py-2 bg-gray-100 rounded-full">
              <User className="w-4 h-4 text-gray-600" />
              <span className="text-sm text-gray-700 font-medium">
                {decodedToken.name}
              </span>
            </div>
          )}
        </div>

        {/* Form Card */}
        <div className="bg-white rounded-3xl shadow-xl overflow-hidden">
          {/* Role Badge */}
          <div className="px-8 pt-8">
            <div
              className={`inline-flex items-center gap-2 px-4 py-2 rounded-full ${roleDisplay.bgColor} mb-2`}
            >
              {roleDisplay.icon}
              <span className={`text-sm font-semibold ${roleDisplay.color}`}>
                {formData.type.charAt(0).toUpperCase() + formData.type.slice(1)}{" "}
                Account
              </span>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="p-8">
            {error && (
              <div className="mb-6 bg-red-50 border border-red-100 rounded-2xl p-4 flex items-center gap-3 animate-in fade-in slide-in-from-top-2">
                <AlertCircle className="text-red-500 shrink-0" size={20} />
                <p className="text-red-800 text-sm font-medium flex-1">
                  {error}
                </p>
              </div>
            )}

            {/* Phone Number Field - REQUIRED FOR BOTH */}
            <div className="mb-6">
              <label className="block text-gray-700 text-sm font-semibold mb-2">
                Phone Number <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400">
                  <Phone size={20} />
                </div>
                <input
                  type="tel"
                  name="phoneNumber"
                  value={formData.phoneNumber}
                  onChange={handleInputChange}
                  placeholder="08012345678"
                  className="w-full pl-12 pr-4 py-4 bg-gray-50 border border-gray-200 rounded-2xl text-gray-800 font-medium placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#FF7B7B] focus:border-transparent transition-all"
                  disabled={isLoading}
                  required
                  maxLength={11} // 10 digits + visual buffer
                />
                <div className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 font-medium text-sm">
                  (+234)
                </div>
              </div>
              <div className="flex justify-between mt-2">
                <p className="text-xs text-gray-500 font-medium">
                  {formData.phoneNumber.length}/10 digits
                </p>
              </div>
            </div>

            {/* Password Field */}
            <div className="mb-6">
              <label className="block text-gray-700 text-sm font-semibold mb-2">
                Password <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400">
                  <Lock size={20} />
                </div>
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  placeholder="Create a strong password"
                  className="w-full pl-12 pr-12 py-4 bg-gray-50 border border-gray-200 rounded-2xl text-gray-800 font-medium placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#FF7B7B] focus:border-transparent transition-all"
                  disabled={isLoading}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
              <p className="mt-2 text-xs text-gray-500">
                Must be at least 8 characters with uppercase, lowercase, and
                numbers
              </p>
            </div>

            {/* Confirm Password Field */}
            <div className="mb-8">
              <label className="block text-gray-700 text-sm font-semibold mb-2">
                Confirm Password <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400">
                  <Lock size={20} />
                </div>
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                  placeholder="Confirm your password"
                  className="w-full pl-12 pr-12 py-4 bg-gray-50 border border-gray-200 rounded-2xl text-gray-800 font-medium placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#FF7B7B] focus:border-transparent transition-all"
                  disabled={isLoading}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showConfirmPassword ? (
                    <EyeOff size={20} />
                  ) : (
                    <Eye size={20} />
                  )}
                </button>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full flex items-center cursor-pointer justify-center gap-3 px-6 py-4 bg-[#FF7B7B] hover:bg-[#ff6a6a] text-white text-sm rounded-2xl transition-all shadow-lg shadow-red-100 hover:shadow-xl hover:shadow-red-200 active:scale-95 disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Setting up account...</span>
                </>
              ) : (
                <>
                  <span>Complete Registration</span>
                  <ArrowRight size={20} />
                </>
              )}
            </button>

            {/* Security Note */}
            <div className="mt-6 p-4 bg-blue-50 rounded-2xl border border-blue-100">
              <div className="flex items-start gap-3">
                <Shield className="w-5 h-5 text-blue-500 mt-0.5 shrink-0" />
                <div>
                  <p className="text-sm text-blue-800 font-medium mb-1">
                    Secure Registration
                  </p>
                  <p className="text-xs text-blue-600">
                    Your information is encrypted and securely stored. By
                    completing registration, you agree to our Terms of Service
                    and Privacy Policy.
                  </p>
                </div>
              </div>
            </div>
          </form>
        </div>

        {/* Footer Links */}
        <div className="mt-8 text-center">
          <p className="text-gray-500 text-sm">
            Need help?{" "}
            <Link
              href="/support"
              className="text-[#FF7B7B] hover:text-[#ff6a6a] font-semibold"
            >
              Contact Support
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

// Main component with Suspense boundary
export default function CompleteRegistrationPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-gray-50 to-gray-100">
          <div className="text-center">
            <div className="w-16 h-16 border-4 border-[#FF7B7B] border-t-transparent rounded-full animate-spin mx-auto mb-4" />
            <p className="text-gray-600 font-medium">Loading registration...</p>
          </div>
        </div>
      }
    >
      <CompleteRegistrationContent />
    </Suspense>
  );
}
