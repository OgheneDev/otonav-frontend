import { UserPlus, Clock, CheckCircle2, Users } from "lucide-react";
import type { Rider } from "@/types/rider";

interface RidersStatsProps {
  riders: Rider[];
}

export function RidersStats({ riders }: RidersStatsProps) {
  const activeRidersCount = riders.filter(
    (r) =>
      !r.orgMembership?.isSuspended &&
      r.orgMembership?.isActive !== false &&
      r.orgMembership?.registrationStatus !== "pending"
  ).length;

  const pendingInvitationsCount = riders.filter(
    (r) => r.orgMembership?.registrationStatus === "pending"
  ).length;

  const stats = [
    {
      label: "Total Riders",
      value: riders.length,
      icon: Users,
      color: "blue",
      bgColor: "bg-blue-50",
      iconColor: "text-blue-500",
      textColor: "text-gray-800",
    },
    {
      label: "Active Riders",
      value: activeRidersCount,
      icon: CheckCircle2,
      color: "green",
      bgColor: "bg-green-50",
      iconColor: "text-green-500",
      textColor: "text-green-600",
    },
    {
      label: "Pending Invitations",
      value: pendingInvitationsCount,
      icon: Clock,
      color: "yellow",
      bgColor: "bg-yellow-50",
      iconColor: "text-yellow-500",
      textColor: "text-yellow-600",
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
      {stats.map((stat) => (
        <div
          key={stat.label}
          className="group bg-white rounded-2xl p-6 border border-gray-100 shadow-sm transition-all duration-200 hover:shadow-md hover:border-gray-200"
        >
          <div className="flex items-start justify-between">
            <div className="space-y-1">
              <p className="text-gray-500 text-sm font-normal tracking-wide">
                {stat.label}
              </p>
              <p
                className={`text-3xl font-bold ${stat.textColor} tabular-nums`}
              >
                {stat.value}
              </p>
            </div>
            <div className={`${stat.bgColor} p-3 rounded-xl transition-colors`}>
              <stat.icon className={stat.iconColor} size={22} strokeWidth={2} />
            </div>
          </div>

          {/* Optional: Visual accent bar at the bottom for better UX grouping */}
          <div
            className={`h-1 w-8 rounded-full mt-4 ${stat.bgColor} opacity-0 group-hover:opacity-100 transition-opacity`}
          />
        </div>
      ))}
    </div>
  );
}
