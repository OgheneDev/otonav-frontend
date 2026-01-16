import { Users } from "lucide-react";

interface EmptyStateProps {
  onCreateCustomer: () => void;
}

export function EmptyState({ onCreateCustomer }: EmptyStateProps) {
  return (
    <div className="bg-white md:rounded-4xl md:border border-gray-100 md:shadow-sm">
      <div className="flex flex-col items-center justify-center py-20 px-6 text-center">
        <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mb-4 text-gray-300">
          <Users size={32} />
        </div>
        <p className="text-gray-500 text-lg font-semibold">
          No customers found
        </p>
        <p className="text-gray-400 text-sm max-w-xs mt-1">
          Customers will appear here when they register.
        </p>
        <button
          onClick={onCreateCustomer}
          className="mt-6 px-6 py-3 bg-[#FF7B7B] hover:bg-[#ff6a6a] text-white text-sm rounded-xl transition-all shadow-lg shadow-red-100"
        >
          Create First Customer
        </button>
      </div>
    </div>
  );
}
