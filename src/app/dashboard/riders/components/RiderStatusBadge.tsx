import { StatusDisplay } from "@/utils/types";

interface RiderStatusBadgeProps {
  status: StatusDisplay;
}

export function RiderStatusBadge({ status }: RiderStatusBadgeProps) {
  return (
    <div className="flex flex-col gap-2">
      <span
        className={`inline-flex px-3 py-1 rounded-full text-[11px] font-bold border uppercase tracking-wider ${status.color}`}
      >
        {status.text}
      </span>
    </div>
  );
}
