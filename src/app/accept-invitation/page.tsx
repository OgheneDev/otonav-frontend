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
  ShoppingBag,
  ArrowRight,
  MapPin,
} from "lucide-react";
import { useAuthStore } from "@/stores";

function AcceptInvitationContent() {
  const searchParams = useSearchParams();
  const { acceptInvitation, acceptCustomerInvitation } = useAuthStore();
  const [isLoading, setIsLoading] = useState(false);
  const [isFetchingOrg, setIsFetchingOrg] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [organizationName, setOrganizationName] = useState<string>("");
  const [organizationAddress, setOrganizationAddress] = useState<string>("");
  const [userEmail, setUserEmail] = useState<string>("");
  const [role, setRole] = useState<string>("");
  const [orgId, setOrgId] = useState<string>("");
  const [invitationType, setInvitationType] = useState<"rider" | "customer">(
    "rider",
  );

  // Fetch organization details from API
  const fetchOrganizationDetails = async (id: string) => {
    try {
      setIsFetchingOrg(true);
      const response = await fetch(
        `https://otonav-backend-production.up.railway.app/api/organizations/${id}`,
      );

      if (!response.ok) {
        throw new Error(`Failed to fetch organization: ${response.status}`);
      }

      const data = await response.json();

      if (data.success && data.data) {
        setOrganizationName(data.data.name || "the organization");
        setOrganizationAddress(data.data.address || "");
      }
    } catch (err) {
      console.error("Error fetching organization:", err);
      // Fallback to placeholder
      setOrganizationName("the organization");
    } finally {
      setIsFetchingOrg(false);
    }
  };

  useEffect(() => {
    const token = searchParams.get("token");
    const type = searchParams.get("type") as "rider" | "customer";

    if (type) {
      setInvitationType(type);
    }

    if (!token) {
      setError(
        "Invalid invitation link. Please check your email for the correct link.",
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
        if (!type) {
          setInvitationType(payload.role === "customer" ? "customer" : "rider");
        }
      }

      if (payload.orgId) {
        setOrgId(payload.orgId);
        // Fetch organization details
        fetchOrganizationDetails(payload.orgId);
      } else {
        setOrganizationName("the organization");
      }
    } catch (err) {
      console.warn(
        "Could not decode token, continuing without pre-filled data",
      );
      setOrganizationName("the organization");
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
      if (invitationType === "customer") {
        await acceptCustomerInvitation({
          token: token,
        });
      } else {
        await acceptInvitation({
          token: token,
        });
      }

      setSuccess(true);
    } catch (err: any) {
      setError(
        err.message ||
          "Failed to accept invitation. Please try again or contact support.",
      );
    } finally {
      setIsLoading(false);
    }
  };

  // Get invitation details - NOW SAME FOR BOTH RIDER AND CUSTOMER
  const getInvitationDetails = () => {
    const commonDetails = {
      title: `${invitationType === "customer" ? "Customer" : "Rider"} Invitation`,
      description: `You've been invited to join ${organizationName}`,
      icon:
        invitationType === "customer" ? (
          <ShoppingBag className="w-6 h-6 text-purple-600" />
        ) : (
          <Smartphone className="w-6 h-6 text-blue-600" />
        ),
      iconBg: invitationType === "customer" ? "bg-purple-50" : "bg-blue-50",
      roleLabel: invitationType === "customer" ? "Customer" : "Rider",
      badgeColor: invitationType === "customer" ? "purple" : "blue",
      ctaText: `Accept ${invitationType === "customer" ? "Customer" : "Rider"} Invitation`,
    };

    if (invitationType === "customer") {
      return {
        ...commonDetails,
        features: [
          "Track your orders in real-time",
          "Save delivery locations",
          "View order history",
        ],
        mobileInstructions:
          "Use our mobile app for the best shopping experience",
      };
    } else {
      return {
        ...commonDetails,
        features: [
          "Accept delivery requests",
          "Track deliveries in real-time",
          "Update delivery status",
        ],
        mobileInstructions: "Use our mobile app to accept deliveries",
      };
    }
  };

  const details = getInvitationDetails();

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
            You are now a {details.roleLabel.toLowerCase()} of{" "}
            <span className="font-semibold">{organizationName}</span>.
          </p>

          {/* Role Badge */}
          <div className="mb-8">
            <div
              className={`inline-flex items-center gap-2 px-4 py-2 bg-${details.badgeColor}-50 rounded-full`}
            >
              {details.icon}
              <span
                className={`text-sm font-semibold text-${details.badgeColor}-700 capitalize`}
              >
                {details.roleLabel}
              </span>
            </div>
          </div>

          {/* MOBILE APP INSTRUCTIONS FOR BOTH */}
          <div className="mb-8 p-5 bg-linear-to-r from-blue-50 to-indigo-50 rounded-2xl border border-blue-100">
            <div className="flex items-center justify-center gap-3 mb-4">
              <Smartphone className="w-6 h-6 text-blue-600" />
              <h3 className="font-bold text-gray-800">
                Continue on Mobile App
              </h3>
            </div>

            <p className="text-gray-700 mb-4 text-sm">
              For the best experience, use our mobile app to:
            </p>

            <ul className="text-left space-y-2 mb-4">
              {details.features.map((feature, index) => (
                <li key={index} className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 shrink-0" />
                  <span className="text-gray-700 text-sm">{feature}</span>
                </li>
              ))}
            </ul>

            <div className="space-y-3">
              <p className="text-gray-600 text-sm font-medium">
                Download the app now:
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

          <div className="mt-6">
            <Link
              href="/dashboard"
              className="inline-flex items-center gap-2 px-6 py-3 bg-gray-800 hover:bg-gray-900 text-white font-medium rounded-2xl transition-all"
            >
              Go to Dashboard
              <ArrowRight size={16} />
            </Link>
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
            <div
              className={`w-12 h-12 rounded-2xl ${details.iconBg} flex items-center justify-center`}
            >
              {details.icon}
            </div>
            <h1 className="text-3xl font-bold text-gray-800">
              {details.title}
            </h1>
          </div>

          <p className="text-gray-600 font-medium">{details.description}</p>

          {/* Email display */}
          {userEmail && (
            <div className="mt-4 inline-flex items-center gap-2 px-4 py-2 bg-gray-100 rounded-full">
              <User className="w-4 h-4 text-gray-600" />
              <span className="text-sm text-gray-700 font-medium">
                {userEmail}
              </span>
            </div>
          )}

          {/* Organization Info */}
          {isFetchingOrg ? (
            <div className="mt-4 flex items-center justify-center gap-2">
              <div className="w-4 h-4 border-2 border-gray-300 border-t-gray-600 rounded-full animate-spin" />
              <span className="text-sm text-gray-500">
                Loading organization...
              </span>
            </div>
          ) : (
            organizationName && (
              <div className="mt-4 flex items-center justify-center gap-2">
                <Building className="w-4 h-4 text-gray-500" />
                <span className="text-sm text-gray-700 font-medium">
                  {organizationName}
                </span>
              </div>
            )
          )}
        </div>

        {/* Invitation Card */}
        <div className="bg-white rounded-3xl shadow-xl overflow-hidden">
          <div className="p-8">
            {/* Organization Details */}
            <div className="mb-8">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center">
                  <Building className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-gray-800">
                    {organizationName || "Organization"}
                  </h3>
                  {organizationAddress && (
                    <p className="text-gray-600 text-sm flex items-center gap-1">
                      <MapPin size={12} />
                      {organizationAddress}
                    </p>
                  )}
                </div>
              </div>

              {/* Invitation Details */}
              <div
                className={`bg-${details.badgeColor}-50 rounded-2xl p-4 mb-6`}
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600 text-sm">Role</span>
                    <span
                      className={`font-semibold text-${details.badgeColor}-700 capitalize`}
                    >
                      {details.roleLabel}
                    </span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-gray-600 text-sm">Access</span>
                    <span className="font-semibold text-gray-800">
                      {invitationType === "customer"
                        ? "Customer Portal"
                        : "Delivery Dashboard"}
                    </span>
                  </div>

                  {/* Features */}
                  <div className="pt-3 border-t border-blue-100">
                    <p className="text-sm font-medium text-gray-700 mb-2">
                      What you can do:
                    </p>
                    <ul className="space-y-2">
                      {details.features.map((feature, index) => (
                        <li key={index} className="flex items-start gap-2">
                          <CheckCircle
                            className={`w-4 h-4 text-${details.badgeColor}-500 mt-0.5 shrink-0`}
                          />
                          <span className="text-gray-700 text-sm">
                            {feature}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>
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

            {/* Mobile App Notice */}
            <div className="mb-6 p-4 bg-linear-to-r from-blue-50 to-indigo-50 rounded-2xl border border-blue-100">
              <div className="flex items-center gap-3">
                <Smartphone className="w-5 h-5 text-blue-600 shrink-0" />
                <div>
                  <p className="text-sm text-blue-800 font-medium mb-1">
                    Mobile App Required
                  </p>
                  <p className="text-xs text-blue-600">
                    After accepting, download our mobile app for the best
                    experience.
                    {invitationType === "customer"
                      ? " Shop, track orders, and manage your account on the go."
                      : " Manage deliveries and communicate with the organization."}
                  </p>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="space-y-4">
              <button
                onClick={handleAcceptInvitation}
                disabled={isLoading || isFetchingOrg}
                className={`w-full flex items-center cursor-pointer justify-center gap-3 px-6 py-4 bg-[#FF7B7B] hover:bg-[#ff6a6a] text-white font-bold rounded-2xl transition-all shadow-lg shadow-red-100 hover:shadow-xl hover:shadow-red-200 active:scale-95 disabled:opacity-70 disabled:cursor-not-allowed`}
              >
                {isLoading ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>Accepting Invitation...</span>
                  </>
                ) : (
                  <>
                    <span>{details.ctaText}</span>
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

            {/* Security Note */}
            <div className="mt-6 p-4 bg-gray-50 rounded-2xl border border-gray-100">
              <div className="flex items-start gap-3">
                <Shield className="w-5 h-5 text-gray-600 mt-0.5 shrink-0" />
                <div>
                  <p className="text-sm text-gray-800 font-medium mb-1">
                    Secure Invitation
                  </p>
                  <p className="text-xs text-gray-600">
                    This invitation is securely linked to your email address. By
                    accepting, you'll gain access to the organization's
                    platform.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Links */}
        <div className="mt-8 text-center space-y-2">
          <p className="text-gray-500 text-sm">
            Already have the app?{" "}
            <a
              href="#"
              className="text-[#FF7B7B] hover:text-[#ff6a6a] font-semibold"
            >
              Open it now
            </a>
          </p>
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
