// Status configuration
export const statusDisplayMap = {
  pending: {
    label: "Pending",
    color: "bg-amber-50 text-amber-700 border-amber-200",
    canCancel: true,
  },
  rider_accepted: {
    label: "Rider Accepted",
    color: "bg-[#E6F4F1] text-[#00A082] border-[#00A082]/20",
    canCancel: true,
  },
  customer_location_set: {
    label: "Location Set",
    color: "bg-indigo-50 text-indigo-700 border-indigo-200",
    canCancel: true,
  },
  confirmed: {
    label: "Confirmed",
    color: "bg-cyan-50 text-cyan-700 border-cyan-200",
    canCancel: true,
  },
  delivered: {
    label: "Delivered",
    color: "bg-emerald-50 text-emerald-700 border-emerald-200",
    canCancel: false,
  },
  cancelled: {
    label: "Cancelled",
    color: "bg-rose-50 text-rose-700 border-rose-200",
    canCancel: false,
  },
} as const;

export function getStatusConfig(status: string) {
  return (
    statusDisplayMap[status as keyof typeof statusDisplayMap] ||
    statusDisplayMap.pending
  );
}

export function getDisplayStatus(status: string): string {
  if (status === "rider_accepted" || status === "customer_location_set")
    return "Pending";
  return status.charAt(0).toUpperCase() + status.slice(1);
}

export function formatTimeAgo(dateString: string | null): string {
  if (!dateString) return "Just now";
  const date = new Date(dateString);
  const diffMins = Math.floor((new Date().getTime() - date.getTime()) / 60000);
  if (diffMins < 1) return "Just now";
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffMins < 1440) return `${Math.floor(diffMins / 60)}h ago`;
  return `${Math.floor(diffMins / 1440)}d ago`;
}
