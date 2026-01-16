import React from "react";
import { getStatusConfig } from "@/utils/orderUtils";

interface StatusBadgeProps {
  status: string;
}

export function StatusBadge({ status }: StatusBadgeProps) {
  const statusConfig = getStatusConfig(status);

  return (
    <span
      className={`inline-flex items-center px-3 py-1 rounded-full text-[11px] font-bold border shadow-sm ${statusConfig.color}`}
    >
      <span className="w-1.5 h-1.5 rounded-full bg-current mr-2 opacity-60" />
      {statusConfig.label}
    </span>
  );
}
