export interface StatusDisplay {
  text: string;
  color: string;
  icon: string;
}

export interface ConfirmationConfig {
  isOpen: boolean;
  title: string;
  message: string;
  confirmText: string;
  variant: "danger" | "warning" | "info";
  onConfirm: () => void;
}
