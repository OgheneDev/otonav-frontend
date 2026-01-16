import { RidersTableRow } from "./RidersTableRow";
import type { Rider } from "@/types/rider";

interface RidersTableProps {
  riders: Rider[];
  actionLoading: string | null;
  onResendInvitation: (riderId: string) => Promise<void>;
  onCancelInvitation: (riderId: string) => void;
  onSuspendToggle: (riderId: string, isSuspended: boolean) => void;
  onRemoveRider: (riderId: string, isPending?: boolean) => void;
}

export function RidersTable({
  riders,
  actionLoading,
  onResendInvitation,
  onCancelInvitation,
  onSuspendToggle,
  onRemoveRider,
}: RidersTableProps) {
  return (
    <div className="bg-white md:rounded-4xl md:border border-gray-100 md:shadow-sm overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead className="hidden md:table-header-group bg-gray-50/50">
            <tr className="border-b border-gray-100">
              <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-gray-400">
                Name
              </th>
              <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-gray-400">
                Phone Number
              </th>
              <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-gray-400">
                Status
              </th>
              <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-gray-400">
                Joined/Invited
              </th>
              <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-gray-400 text-right">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="flex flex-col md:table-row-group gap-4 md:gap-0 p-1 md:p-0">
            {riders.map((rider) => (
              <RidersTableRow
                key={rider.id}
                rider={rider}
                actionLoading={actionLoading}
                onResendInvitation={onResendInvitation}
                onCancelInvitation={onCancelInvitation}
                onSuspendToggle={onSuspendToggle}
                onRemoveRider={onRemoveRider}
              />
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
