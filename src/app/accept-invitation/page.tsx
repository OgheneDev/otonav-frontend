"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import {
  CheckCircle,
  AlertCircle,
  User,
  Shield,
  Building,
  Smartphone,
  Download,
  ArrowRight,
  ExternalLink,
} from "lucide-react";
import { useAuthStore } from "@/stores";

// Create a separate component that uses useSearchParams
function AcceptInvitationContent() {
  const searchParams = useSearchParams();
  const { acceptInvitation } = useAuthStore();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [organizationName, setOrganizationName] = useState<string>("");
  const [userEmail, setUserEmail] = useState<string>("");
  const [role, setRole] = useState<string>("");
  const [orgId, setOrgId] = useState<string>("");

  useEffect(() => {
    const token = searchParams.get("token");

    if (!token) {
      setError(
        "Invalid invitation link. Please check your email for the correct link."
      );
      return;
    }

    // Decode the JWT token to extract email, orgId, and role
    try {
      const base64Url = token.split(".")[1];
      const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
      const payload = JSON.parse(window.atob(base64));

      // Extract info from token
      if (payload.email) {
        setUserEmail(payload.email);
      }

      if (payload.role) {
        setRole(payload.role);
      }

      if (payload.orgId) {
        setOrgId(payload.orgId);
      }

      // Note: You might want to fetch organization name from backend
      // For now, we'll show a placeholder
      setOrganizationName("the organization");
    } catch (err) {
      console.warn(
        "Could not decode token, continuing without pre-filled data"
      );
    }
  }, [searchParams]);

  const handleAcceptInvitation = async () => {
    const token = searchParams.get("token");

    if (!token) {
      setError("Invalid invitation token");
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      await acceptInvitation({
        token: token,
      });

      // Show success message
      setSuccess(true);
    } catch (err: any) {
      setError(
        err.message ||
          "Failed to accept invitation. Please try again or contact support."
      );
    } finally {
      setIsLoading(false);
    }
  };

  if (!searchParams.get("token")) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-gray-50 to-gray-100 px-4">
        <div className="max-w-md w-full bg-white rounded-3xl shadow-xl p-8 text-center">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <AlertCircle className="w-8 h-8 text-red-500" />
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-3">
            Invalid Invitation Link
          </h2>
          <p className="text-gray-600 mb-6">
            The invitation link is invalid or has expired. Please check your
            email for the correct link or contact the organization
            administrator.
          </p>
          <Link
            href="/"
            className="inline-flex items-center justify-center px-6 py-3 bg-[#FF7B7B] hover:bg-[#ff6a6a] text-white font-semibold rounded-xl transition-all shadow-lg shadow-red-100 active:scale-95"
          >
            Return to Home
          </Link>
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
            Invitation Accepted! 🎉
          </h2>
          <p className="text-gray-600 mb-6">
            You are now a part of{" "}
            <span className="font-semibold">{organizationName}</span> as a{" "}
            <span className="font-semibold capitalize">{role}</span>.
          </p>

          {/* Role Badge */}
          <div className="mb-8">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-50 rounded-full">
              <User className="w-4 h-4 text-blue-600" />
              <span className="text-sm font-semibold text-blue-700 capitalize">
                {role}
              </span>
            </div>
          </div>

          {/* Mobile App Instructions for Riders */}
          {role === "rider" && (
            <div className="mb-8 p-5 bg-linear-to-r from-blue-50 to-indigo-50 rounded-2xl border border-blue-100">
              <div className="flex items-center justify-center gap-3 mb-4">
                <Smartphone className="w-6 h-6 text-blue-600" />
                <h3 className="font-bold text-gray-800">
                  Continue on Mobile App
                </h3>
              </div>
              <p className="text-gray-700 mb-4 text-sm">
                As a rider, your primary interface is through our mobile app
                where you can:
              </p>
              <ul className="text-left space-y-2 mb-4">
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 shrink-0" />
                  <span className="text-gray-700 text-sm">
                    View and accept delivery requests
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 shrink-0" />
                  <span className="text-gray-700 text-sm">
                    Track your deliveries in real-time
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 shrink-0" />
                  <span className="text-gray-700 text-sm">
                    Update delivery status
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 shrink-0" />
                  <span className="text-gray-700 text-sm">
                    View earnings and performance
                  </span>
                </li>
              </ul>

              <div className="space-y-3">
                <p className="text-gray-600 text-sm font-medium">
                  Download the rider app:
                </p>
                <div className="flex flex-col sm:flex-row gap-3">
                  <a
                    href="#"
                    className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-black hover:bg-gray-900 text-white rounded-xl transition-all"
                  >
                    <svg
                      className="w-5 h-5"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path d="M17.05 20.28c-.98.95-2.05.8-3.08.35-1.09-.46-2.09-.48-3.24 0-1.44.62-2.2.44-3.06-.35C2.79 15.36 3.51 7.79 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.99-2.54 4.09l.01-.01zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z" />
                    </svg>
                    <span className="text-sm font-medium">App Store</span>
                  </a>
                  <a
                    href="#"
                    className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl transition-all"
                  >
                    <svg
                      className="w-5 h-5"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path d="M3 20.5v-17c0-.59.34-1.11.84-1.35L13.69 12l-9.85 9.85c-.5-.24-.84-.76-.84-1.35zm13.81-5.38L6.05 21.34l8.49-8.49 2.27 2.27zm3.35-4.31c.34.27.59.69.59 1.19s-.25.92-.59 1.19l-2.01 1.55-2.27-2.27 2.01-1.55c.5-.38 1.17-.38 1.67 0l.2.15zm-3.59-3.59l2.27 2.27 1.55-2.01c.27-.34.69-.59 1.19-.59s.92.25 1.19.59l.15.2-2.01 1.55-2.27-2.27 1.55-2.01-.15-.2c-.38-.5-1.05-.5-1.55 0l-1.55 2.01z" />
                    </svg>
                    <span className="text-sm font-medium">Play Store</span>
                  </a>
                </div>
              </div>
            </div>
          )}

          {/* General Instructions for Other Roles */}
          {role !== "rider" && (
            <div className="mb-8 p-5 bg-gray-50 rounded-2xl">
              <p className="text-gray-700 mb-4 text-sm">
                You can now access the organization's resources. Check your
                email for further instructions on getting started.
              </p>
              <div className="flex items-center justify-center gap-2 text-sm text-gray-600">
                <ExternalLink className="w-4 h-4" />
                <span>You'll receive access details shortly</span>
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="space-y-3">
            <Link
              href="/"
              className="inline-flex items-center justify-center w-full px-6 py-3 bg-[#FF7B7B] hover:bg-[#ff6a6a] text-white font-semibold rounded-xl transition-all shadow-lg shadow-red-100 active:scale-95"
            >
              Return to Home
            </Link>
            <p className="text-gray-500 text-xs mt-4">
              If you have any questions, contact your organization administrator
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-gray-50 to-gray-100 px-4 py-8">
      <div className="max-w-md w-full">
        {/* Header */}
        <div className="text-center mb-10">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="w-12 h-12 rounded-2xl bg-blue-50 flex items-center justify-center">
              <Building className="w-6 h-6 text-blue-600" />
            </div>
            <h1 className="text-3xl font-bold text-gray-800">
              Organization Invitation
            </h1>
          </div>
          <p className="text-gray-600 font-medium">
            You've been invited to join an organization
          </p>

          {/* Email display */}
          {userEmail && (
            <div className="mt-4 inline-flex items-center gap-2 px-4 py-2 bg-gray-100 rounded-full">
              <User className="w-4 h-4 text-gray-600" />
              <span className="text-sm text-gray-700 font-medium">
                {userEmail}
              </span>
            </div>
          )}

          {/* Role display */}
          {role && (
            <div className="mt-2 inline-flex items-center gap-2 px-4 py-2 bg-blue-50 rounded-full">
              <Shield className="w-4 h-4 text-blue-600" />
              <span className="text-sm text-blue-700 font-medium">
                {role.charAt(0).toUpperCase() + role.slice(1)} Role
              </span>
            </div>
          )}
        </div>

        {/* Invitation Card */}
        <div className="bg-white rounded-3xl shadow-xl overflow-hidden">
          <div className="p-8">
            {/* Organization Info */}
            <div className="mb-8">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center">
                  <Building className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-gray-800">
                    Join {organizationName}
                  </h3>
                  <p className="text-gray-600 text-sm">
                    Accept the invitation to become a team member
                  </p>
                </div>
              </div>

              {/* Invitation Details */}
              <div className="bg-blue-50 rounded-2xl p-4 mb-6">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600 text-sm">Role</span>
                    <span className="font-semibold text-blue-700 capitalize">
                      {role || "Member"}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600 text-sm">Access Level</span>
                    <span className="font-semibold text-gray-800">
                      Team Member
                    </span>
                  </div>
                  {role === "rider" && (
                    <div className="pt-3 border-t border-blue-100">
                      <div className="flex items-center gap-2 text-sm text-gray-700">
                        <Smartphone className="w-4 h-4" />
                        <span>Primary interface: Mobile App</span>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {error && (
              <div className="mb-6 bg-red-50 border border-red-100 rounded-2xl p-4 flex items-center gap-3 animate-in fade-in slide-in-from-top-2">
                <AlertCircle className="text-red-500 shrink-0" size={20} />
                <p className="text-red-800 text-sm font-medium flex-1">
                  {error}
                </p>
              </div>
            )}

            {/* Action Buttons */}
            <div className="space-y-4">
              <button
                onClick={handleAcceptInvitation}
                disabled={isLoading}
                className="w-full flex items-center cursor-pointer justify-center gap-3 px-6 py-4 bg-[#FF7B7B] hover:bg-[#ff6a6a] text-white font-bold rounded-2xl transition-all shadow-lg shadow-red-100 hover:shadow-xl hover:shadow-red-200 active:scale-95 disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>Accepting Invitation...</span>
                  </>
                ) : (
                  <>
                    <span>Accept Invitation</span>
                    <ArrowRight size={20} />
                  </>
                )}
              </button>

              <button
                onClick={() => (window.location.href = "/")}
                disabled={isLoading}
                className="w-full px-6 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium rounded-2xl transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Decline
              </button>
            </div>

            {/* Mobile App Info for Riders */}
            {role === "rider" && (
              <div className="mt-8 p-4 bg-linear-to-r from-blue-50 to-indigo-50 rounded-2xl border border-blue-100">
                <div className="flex items-start gap-3">
                  <Smartphone className="w-5 h-5 text-blue-600 mt-0.5 shrink-0" />
                  <div>
                    <p className="text-sm text-blue-800 font-medium mb-1">
                      Note for Riders
                    </p>
                    <p className="text-xs text-blue-600">
                      After accepting this invitation, you'll use our dedicated
                      mobile app to manage deliveries, track orders, and
                      communicate with the organization. The web interface is
                      for administrators only.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Security Note for Others */}
            {role !== "rider" && role !== "" && (
              <div className="mt-8 p-4 bg-gray-50 rounded-2xl border border-gray-100">
                <div className="flex items-start gap-3">
                  <Shield className="w-5 h-5 text-gray-600 mt-0.5 shrink-0" />
                  <div>
                    <p className="text-sm text-gray-800 font-medium mb-1">
                      What happens next?
                    </p>
                    <p className="text-xs text-gray-600">
                      By accepting this invitation, you'll gain access to the
                      organization's dashboard and resources. You can leave the
                      organization at any time.
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Footer Links */}
        <div className="mt-8 text-center">
          <p className="text-gray-500 text-sm">
            Questions?{" "}
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
export default function AcceptInvitationPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-gray-50 to-gray-100">
          <div className="text-center">
            <div className="w-16 h-16 border-4 border-[#FF7B7B] border-t-transparent rounded-full animate-spin mx-auto mb-4" />
            <p className="text-gray-600 font-medium">Loading invitation...</p>
          </div>
        </div>
      }
    >
      <AcceptInvitationContent />
    </Suspense>
  );
}
