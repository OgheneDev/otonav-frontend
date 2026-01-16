import React from "react";
import { Users, CheckCircle, Mail, Clock } from "lucide-react";

interface CustomerStats {
  total: number;
  active: number;
  verified: number;
  pending: number;
}

interface CustomersStatsProps {
  stats: CustomerStats;
}

export function CustomersStats({ stats }: CustomersStatsProps) {
  const statCards = [
    {
      label: "Total Customers",
      value: stats.total,
      icon: <Users className="text-[#00A082]" />,
      gradient: "bg-gradient-to-br from-[#E6F4F1] to-[#D0EDE6]",
      trend: "",
    },
    {
      label: "Active",
      value: stats.active,
      icon: <CheckCircle className="text-[#10B981]" />,
      gradient: "bg-gradient-to-br from-[#EBFBF5] to-[#D1F5E6]",
      trend: stats.active > 0 ? `+${stats.active}` : "",
    },
    {
      label: "Email Verified",
      value: stats.verified,
      icon: <Mail className="text-[#3B82F6]" />,
      gradient: "bg-gradient-to-br from-[#EFF6FF] to-[#DBEAFE]",
      trend: "",
    },
    {
      label: "Pending",
      value: stats.pending,
      icon: <Clock className="text-[#F59E0B]" />,
      gradient: "bg-gradient-to-br from-[#FFF7ED] to-[#FFEDD5]",
      trend: "",
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      {statCards.map((stat) => (
        <StatCard
          key={stat.label}
          label={stat.label}
          value={stat.value}
          color={stat.gradient}
          icon={stat.icon}
          trend={stat.trend}
        />
      ))}
    </div>
  );
}

function StatCard({ label, value, color, icon, trend }: any) {
  return (
    <div className="group bg-white p-6 rounded-3xl shadow-sm border border-gray-100 hover:shadow-md hover:border-gray-200 transition-all duration-300 hover:-translate-y-1">
      <div className="flex items-center gap-5">
        <div
          className={`w-16 h-16 rounded-2xl flex items-center justify-center ${color} ring-1 ring-black/5 shadow-sm`}
        >
          {React.cloneElement(icon, { size: 28 })}
        </div>
        <div className="flex-1">
          <div className="flex items-end gap-2 mb-1">
            <h3 className="text-3xl text-gray-900 tabular-nums">{value}</h3>
            {trend && (
              <div className="flex items-center gap-1 px-2 py-0.5 bg-green-50 rounded-full mb-1">
                <span className="text-[10px] text-green-600">{trend}</span>
              </div>
            )}
          </div>
          <p className="text-xs text-gray-500">{label}</p>
        </div>
      </div>
    </div>
  );
}
