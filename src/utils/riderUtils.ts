import type { Rider } from "@/types/rider";
import { StatusDisplay } from "./types";

export function formatDate(dateString: string | null): string {
  if (!dateString) return "Not joined yet";
  return new Date(dateString).toLocaleDateString("en-US", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

export function formatDateTime(dateString: string | null): string {
  if (!dateString) return "N/A";
  return new Date(dateString).toLocaleDateString("en-US", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function getStatusDisplay(rider: Rider): StatusDisplay {
  const registrationStatus = rider.orgMembership?.registrationStatus;

  if (registrationStatus === "pending") {
    return {
      text: "Pending",
      color: "bg-yellow-50 text-yellow-600 border-yellow-100",
      icon: "🕒",
    };
  }

  if (rider.orgMembership?.isSuspended) {
    return {
      text: "Suspended",
      color: "bg-orange-50 text-orange-600 border-orange-100",
      icon: "⚠️",
    };
  }

  if (rider.orgMembership?.isActive === false) {
    return {
      text: "Deactivated",
      color: "bg-red-50 text-red-600 border-red-100",
      icon: "❌",
    };
  }

  return {
    text: "Active",
    color: "bg-green-50 text-green-600 border-green-100",
    icon: "✅",
  };
}

export function isInvitationExpired(invitedAt: string | null): boolean {
  if (!invitedAt) return false;
  const invitedDate = new Date(invitedAt);
  const expiryDate = new Date(invitedDate.getTime() + 7 * 24 * 60 * 60 * 1000); // 7 days
  return new Date() > expiryDate;
}

export function isPendingRider(rider: Rider): boolean {
  return rider.orgMembership?.registrationStatus === "pending";
}

export function isSuspendedRider(rider: Rider): boolean {
  return rider.orgMembership?.isSuspended || false;
}

export function isActiveRider(rider: Rider): boolean {
  return (
    !rider.orgMembership?.isSuspended &&
    rider.orgMembership?.isActive !== false &&
    rider.orgMembership?.registrationStatus !== "pending"
  );
}
