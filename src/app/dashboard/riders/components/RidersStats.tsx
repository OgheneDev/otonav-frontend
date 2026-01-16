import { Users, CheckCircle2, Clock } from "lucide-react";
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
      gradient: "bg-gradient-to-br from-[#E6F4F1] to-[#D0EDE6]",
      iconColor: "text-[#00A082]",
      trend: "",
    },
    {
      label: "Active Riders",
      value: activeRidersCount,
      icon: CheckCircle2,
      gradient: "bg-gradient-to-br from-[#EBFBF5] to-[#D1F5E6]",
      iconColor: "text-[#10B981]",
      trend: activeRidersCount > 0 ? `+${activeRidersCount}` : "",
    },
    {
      label: "Pending Invitations",
      value: pendingInvitationsCount,
      icon: Clock,
      gradient: "bg-gradient-to-br from-[#FFF7ED] to-[#FFEDD5]",
      iconColor: "text-[#F97316]",
      trend: "",
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
      {stats.map((stat) => (
        <div
          key={stat.label}
          className="group bg-white p-6 rounded-3xl shadow-sm border border-gray-100 hover:shadow-md hover:border-gray-200 transition-all duration-300 hover:-translate-y-1"
        >
          <div className="flex items-center gap-5">
            <div
              className={`w-16 h-16 rounded-2xl flex items-center justify-center ${stat.gradient} ring-1 ring-black/5 shadow-sm`}
            >
              <stat.icon className={stat.iconColor} size={28} strokeWidth={2} />
            </div>
            <div className="flex-1">
              <div className="flex items-end gap-2 mb-1">
                <h3 className="text-3xl text-gray-900 tabular-nums">
                  {stat.value}
                </h3>
                {stat.trend && (
                  <div className="flex items-center gap-1 px-2 py-0.5 bg-green-50 rounded-full mb-1">
                    <span className="text-[10px] text-green-600">
                      {stat.trend}
                    </span>
                  </div>
                )}
              </div>
              <p className="text-xs text-gray-500">{stat.label}</p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
