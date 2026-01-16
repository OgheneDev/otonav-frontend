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
  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
      {/* Total Customers */}
      <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-gray-500 text-sm font-medium">Total Customers</p>
            <p className="text-2xl font-bold text-gray-800 mt-1">
              {stats.total}
            </p>
          </div>
          <div className="bg-blue-50 p-3 rounded-xl">
            <Users className="text-blue-500" size={24} />
          </div>
        </div>
      </div>

      {/* Active */}
      <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-gray-500 text-sm font-medium">Active</p>
            <p className="text-2xl font-bold text-green-600 mt-1">
              {stats.active}
            </p>
          </div>
          <div className="bg-green-50 p-3 rounded-xl">
            <CheckCircle className="text-green-500" size={24} />
          </div>
        </div>
      </div>

      {/* Email Verified */}
      <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-gray-500 text-sm font-medium">Email Verified</p>
            <p className="text-2xl font-bold text-blue-600 mt-1">
              {stats.verified}
            </p>
          </div>
          <div className="bg-blue-50 p-3 rounded-xl">
            <Mail className="text-blue-500" size={24} />
          </div>
        </div>
      </div>

      {/* Pending */}
      <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-gray-500 text-sm font-medium">Pending</p>
            <p className="text-2xl font-bold text-yellow-600 mt-1">
              {stats.pending}
            </p>
          </div>
          <div className="bg-yellow-50 p-3 rounded-xl">
            <Clock className="text-yellow-500" size={24} />
          </div>
        </div>
      </div>
    </div>
  );
}
