import { CustomersTableRow } from "./CustomersTableRow";
import type { Customer } from "@/types/customer";

interface CustomersTableProps {
  customers: Customer[];
  actionLoading: string | null;
  onResendInvitation: (customerId: string) => Promise<void>;
}

export function CustomersTable({
  customers,
  actionLoading,
  onResendInvitation,
}: CustomersTableProps) {
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
                Contact
              </th>
              <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-gray-400">
                Status
              </th>
              <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-gray-400">
                Created
              </th>
              <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-gray-400 text-right">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="flex flex-col md:table-row-group gap-4 md:gap-0 p-1 md:p-0">
            {customers.map((customer) => (
              <CustomersTableRow
                key={customer.id}
                customer={customer}
                actionLoading={actionLoading}
                onResendInvitation={onResendInvitation}
              />
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
