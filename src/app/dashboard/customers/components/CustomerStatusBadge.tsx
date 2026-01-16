import { StatusDisplay } from "../utils/types";

interface CustomerStatusBadgeProps {
  status: StatusDisplay;
  isEmailVerified: boolean;
}

export function CustomerStatusBadge({
  status,
  isEmailVerified,
}: CustomerStatusBadgeProps) {
  return (
    <div className="flex flex-col gap-1">
      <div className="flex items-center gap-2">
        <span
          className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[11px] font-bold border uppercase tracking-wider ${status.color}`}
        >
          {status.icon}
          {status.text}
        </span>
      </div>
      {isEmailVerified && (
        <span className="text-xs text-green-600 font-medium">
          Email Verified
        </span>
      )}
    </div>
  );
}
