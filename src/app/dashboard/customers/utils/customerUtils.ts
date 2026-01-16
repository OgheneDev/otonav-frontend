import { Clock, XCircle, CheckCircle } from "lucide-react";
import React from "react";
import type { Customer } from "@/types/customer";
import type { StatusDisplay } from "./types";

export function formatDate(dateString: string | null): string {
  if (!dateString) return "N/A";
  return new Date(dateString).toLocaleDateString("en-US", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

export function getStatusDisplay(customer: Customer): StatusDisplay {
  const registrationStatus = customer.registrationStatus;

  if (registrationStatus === "pending") {
    return {
      text: "Pending",
      color: "bg-yellow-50 text-yellow-600 border-yellow-100",
      icon: React.createElement(Clock, { size: 12 }),
    };
  }

  if (registrationStatus === "cancelled" || registrationStatus === "expired") {
    return {
      text: "Cancelled",
      color: "bg-red-50 text-red-600 border-red-100",
      icon: React.createElement(XCircle, { size: 12 }),
    };
  }

  if (customer.emailVerified && registrationStatus === "completed") {
    return {
      text: "Active",
      color: "bg-green-50 text-green-600 border-green-100",
      icon: React.createElement(CheckCircle, { size: 12 }),
    };
  }

  return {
    text: "Inactive",
    color: "bg-gray-50 text-gray-600 border-gray-100",
    icon: React.createElement(XCircle, { size: 12 }),
  };
}

export function isInvitationExpired(createdAt: string | null): boolean {
  if (!createdAt) return false;
  const createdDate = new Date(createdAt);
  const expiryDate = new Date(createdDate.getTime() + 24 * 60 * 60 * 1000); // 24 hours for customer registration links
  return new Date() > expiryDate;
}

export function isPendingCustomer(customer: Customer): boolean {
  return customer.registrationStatus === "pending";
}

export function isActiveCustomer(customer: Customer): boolean {
  return (
    !!customer.emailVerified &&
    !!customer.registrationCompleted &&
    customer.registrationStatus === "completed"
  );
}

export function isVerifiedCustomer(customer: Customer): boolean {
  return !!customer.emailVerified;
}
