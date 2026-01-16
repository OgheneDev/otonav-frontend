import { AlertCircle, CheckCircle, X, Info, AlertTriangle } from "lucide-react";

interface AlertProps {
  type: "success" | "error" | "warning" | "info";
  message: string;
  onClose?: () => void;
  className?: string;
  showIcon?: boolean;
}

export function Alert({
  type,
  message,
  onClose,
  className = "",
  showIcon = true,
}: AlertProps) {
  const config = {
    success: {
      bg: "bg-green-50",
      border: "border-green-100",
      text: "text-green-800",
      icon: CheckCircle,
      iconColor: "text-green-500",
    },
    error: {
      bg: "bg-red-50",
      border: "border-red-100",
      text: "text-red-800",
      icon: AlertCircle,
      iconColor: "text-red-500",
    },
    warning: {
      bg: "bg-amber-50",
      border: "border-amber-100",
      text: "text-amber-800",
      icon: AlertTriangle,
      iconColor: "text-amber-500",
    },
    info: {
      bg: "bg-blue-50",
      border: "border-blue-100",
      text: "text-blue-800",
      icon: Info,
      iconColor: "text-blue-500",
    },
  }[type];

  const Icon = config.icon;

  return (
    <div
      className={`rounded-2xl p-4 flex items-center gap-3 animate-in fade-in slide-in-from-top-2 ${config.bg} ${config.border} ${className}`}
    >
      {showIcon && (
        <Icon className={`shrink-0 ${config.iconColor}`} size={20} />
      )}
      <p className={`text-sm font-medium flex-1 ${config.text}`}>{message}</p>
      {onClose && (
        <button
          onClick={onClose}
          className={`p-1 hover:bg-opacity-80 rounded-lg transition-colors`}
        >
          <X className={`w-4 h-4 ${config.iconColor}`} />
        </button>
      )}
    </div>
  );
}
