"use client";

import { useState } from "react";
import { Mail, Lock, LogIn, Eye, EyeOff } from "lucide-react";
import AuthLayout from "@/components/AuthLayout";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/stores";
import { useToastStore } from "@/stores";

export default function Login() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [rememberMe, setRememberMe] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const { login, isLoggingIn } = useAuthStore();
  const { showToast } = useToastStore();

  const handleSubmit = async () => {
    // Validate form
    if (!formData.email.trim() || !formData.password.trim()) {
      showToast("Please fill in all fields", "error");
      return;
    }

    if (!/\S+@\S+\.\S+/.test(formData.email)) {
      showToast("Please enter a valid email address", "error");
      return;
    }

    setIsLoading(true);

    try {
      const response = await login({
        email: formData.email.trim(),
        password: formData.password,
      });

      // Check if user is a business owner
      if (response.user.role !== "owner") {
        showToast("This portal is for business owners only", "error");
        // Clear auth since non-owner logged in
        useAuthStore.getState().clearAuth();
        return;
      }

      showToast("Login successful!", "success");

      // Redirect to business owner dashboard
      setTimeout(() => {
        router.push("/dashboard");
      }, 1500);
    } catch (error: any) {
      console.error("Login error:", error);

      // Handle specific error messages
      const errorMessage =
        error.message || "Login failed. Please check your credentials.";

      // Provide more specific messages for common errors
      if (
        errorMessage.includes("Invalid credentials") ||
        errorMessage.includes("incorrect")
      ) {
        showToast("Invalid email or password", "error");
      } else if (errorMessage.includes("not verified")) {
        showToast("Please verify your email first", "error");
      } else {
        showToast(errorMessage, "error");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !isLoading && !isLoggingIn) {
      handleSubmit();
    }
  };

  const isButtonDisabled =
    isLoading || isLoggingIn || !formData.email || !formData.password;

  return (
    <AuthLayout
      title="Welcome Back"
      subtitle="Log in to manage your business and deliveries."
    >
      <div className="space-y-5">
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
              disabled={isLoading || isLoggingIn}
              autoComplete="email"
            />
          </div>
        </div>

        {/* Password Input */}
        <div className="space-y-2">
          <label
            htmlFor="password"
            className="text-sm font-semibold text-gray-700 pl-1"
          >
            Password
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
              onKeyPress={handleKeyPress}
              placeholder="Enter your password"
              className="w-full pl-12 pr-12 py-3.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#FF6B6B]/30 focus:border-[#FF6B6B] focus:bg-white transition-all outline-none text-gray-900 placeholder:text-gray-400 disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={isLoading || isLoggingIn}
              autoComplete="current-password"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-4 cursor-pointer top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors focus:outline-none disabled:opacity-50"
              aria-label={showPassword ? "Hide password" : "Show password"}
              disabled={isLoading || isLoggingIn}
            >
              {showPassword ? (
                <EyeOff className="w-5 h-5" />
              ) : (
                <Eye className="w-5 h-5" />
              )}
            </button>
          </div>
        </div>

        {/* Remember Me & Forgot Password */}
        <div className="flex items-center justify-between px-1 pt-1">
          <label className="flex items-center gap-2.5 cursor-pointer group">
            <div className="relative">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="w-4 h-4 rounded border-2 border-gray-300 text-[#FF6B6B] focus:ring-2 focus:ring-[#FF6B6B]/30 focus:ring-offset-0 cursor-pointer transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={isLoading || isLoggingIn}
              />
            </div>
            <span className="text-sm text-gray-600 group-hover:text-gray-900 transition-colors select-none">
              Remember me
            </span>
          </label>
          <Link
            href="/forgot-password"
            className="text-sm underline text-[#FF6B6B] hover:text-[#ff5252] transition-colors"
          >
            Forgot Password?
          </Link>
        </div>

        {/* Submit Button */}
        <button
          onClick={handleSubmit}
          disabled={isButtonDisabled}
          className="w-full bg-linear-to-r from-[#FF6B6B] cursor-pointer to-[#ff5252] text-white text-sm py-4 rounded-xl hover:shadow-lg hover:shadow-red-200/50 transition-all shadow-md shadow-red-100 flex items-center justify-center gap-2.5 mt-8 disabled:opacity-70 disabled:cursor-not-allowed group"
        >
          {isLoading || isLoggingIn ? (
            <>
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              <span>Signing In...</span>
            </>
          ) : (
            <>
              <LogIn className="w-5 h-5 group-hover:translate-x-0.5 transition-transform" />
              <span>Sign In</span>
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
              New to OtoNav Business?
            </span>
          </div>
        </div>

        {/* Register Link */}
        <Link
          href="/register"
          className="w-full border-2 border-gray-200 text-gray-700 text-sm py-4 rounded-xl hover:border-[#FF6B6B] hover:bg-red-50/50 transition-all flex items-center justify-center gap-2 group"
        >
          <span>Create Business Account</span>
          <span className="text-[#FF6B6B] group-hover:translate-x-0.5 transition-transform">
            →
          </span>
        </Link>
      </div>
    </AuthLayout>
  );
}
