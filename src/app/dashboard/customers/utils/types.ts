import { ReactNode } from "react";

export interface StatusDisplay {
  text: string;
  color: string;
  icon: ReactNode;
}

export interface ConfirmationConfig {
  isOpen: boolean;
  title: string;
  message: string;
  confirmText: string;
  variant: "danger" | "warning" | "info";
  onConfirm: () => void;
}

export interface CustomerStats {
  total: number;
  active: number;
  verified: number;
  pending: number;
}
