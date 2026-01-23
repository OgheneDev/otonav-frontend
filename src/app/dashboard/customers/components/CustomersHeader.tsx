import { UserPlus } from "lucide-react";
import { useAuthStore } from "@/stores";

interface CustomersHeaderProps {
  onCreateCustomer: () => void;
}

export function CustomersHeader({ onCreateCustomer }: CustomersHeaderProps) {
  const { authUser } = useAuthStore();
  return (
    <header className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8">
      <section className="text-center md:text-left">
        <h2 className="text-2xl md:text-3xl font-semibold text-gray-900">
          Customers
        </h2>
        <div className="h-1 w-12 hidden md:block bg-[#00A082] rounded-full mt-2 mb-3" />
        <p className="text-gray-500 text-sm mt-1">
          View all customers in{" "}
          <span className="text-[#FF7B7B] font-semibold">
            {authUser?.organizations?.[0]?.name}
          </span>
        </p>
      </section>

      <button
        onClick={onCreateCustomer}
        className="flex items-center justify-center cursor-pointer gap-2 px-6 py-3.5 bg-[#FF7B7B] hover:bg-[#ff6a6a] text-white text-sm rounded-xl transition-all shadow-lg shadow-red-100 active:scale-95 w-full md:w-auto"
      >
        <UserPlus size={18} />
        <span>Create a new Customer</span>
      </button>
    </header>
  );
}
