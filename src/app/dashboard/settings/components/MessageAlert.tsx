import { CheckCircle, AlertCircle, X } from "lucide-react";

interface MessageAlertProps {
  type: "success" | "error";
  text: string;
  onClose: () => void;
}

export function MessageAlert({ type, text, onClose }: MessageAlertProps) {
  return (
    <div
      className={`mb-6 p-4 rounded-2xl flex items-center gap-3 animate-in fade-in slide-in-from-top-2 ${
        type === "success"
          ? "bg-[#E6F4F1] text-[#00A082]"
          : "bg-[#FFEBEB] text-[#FF7B7B]"
      }`}
    >
      {type === "success" ? (
        <CheckCircle size={20} className="shrink-0" />
      ) : (
        <AlertCircle size={20} className="shrink-0" />
      )}
      <span className="text-sm font-medium">{text}</span>
      <button
        onClick={onClose}
        className="ml-auto p-1 hover:opacity-70 transition-opacity"
      >
        <X size={16} />
      </button>
    </div>
  );
}
