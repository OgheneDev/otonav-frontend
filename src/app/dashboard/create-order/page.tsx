import { Mail, Package, User } from "lucide-react";

export default function CreateOrderPage() {
  return (
    <div className="max-w-5xl mx-auto">
      {/* Title Section */}
      <section className="mb-8">
        <h2 className="text-3xl font-bold text-slate-800 text-center md:text-start">
          Create Order
        </h2>
        <p className="text-gray-400 text-sm text-center mt-1 font-medium md:text-start">
          Connect your customer with their rider!
        </p>
        <p className="text-gray-400 text-sm mt-6 font-medium text-center md:text-start">
          Fill Form Below accordingly
        </p>
      </section>

      <form className="space-y-6">
        {/* Input Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormInput
            icon={<Mail size={18} />}
            placeholder="Customer's Email Address"
          />
          <FormInput
            icon={<Mail size={18} />}
            placeholder="Rider's Email Address"
          />
          <FormInput
            icon={<Package size={18} />}
            placeholder="Package Description"
          />
          <FormInput
            icon={<Mail size={18} />}
            placeholder="Rider's Email Address"
          />
        </div>

        {/* Profile Preview Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4">
          <ProfilePreviewCard title="Customer Details" />
          <ProfilePreviewCard title="Rider's Details" />
        </div>

        {/* Submit Button */}
        <div className="pt-8">
          <button
            type="submit"
            className="w-full py-4 cursor-pointer bg-[#FF7B7B] hover:bg-[#ff6a6a] text-white text-sm rounded-xl transition-all shadow-md active:scale-[0.99]"
          >
            Initiate Order
          </button>
        </div>
      </form>
    </div>
  );
}

// Reusable Input Component
function FormInput({
  icon,
  placeholder,
}: {
  icon: React.ReactNode;
  placeholder: string;
}) {
  return (
    <div className="relative group">
      <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-700">
        {icon}
      </div>
      <input
        type="text"
        placeholder={placeholder}
        className="w-full pl-12 pr-4 py-4 bg-gray-200 border-none rounded-xl text-sm placeholder:text-gray-400 focus:ring-2 focus:ring-[#00A082]/20 outline-none transition-all"
      />
    </div>
  );
}

// Reusable Profile Card Component
function ProfilePreviewCard({ title }: { title: string }) {
  return (
    <div className="bg-[#F8F9FA] p-8 rounded-4xl border border-gray-50">
      <h3 className="text-lg font-semibold text-slate-600 mb-6 text-center md:text-start">
        {title}
      </h3>
      <div className="flex items-center gap-6">
        {/* Gray Circle Placeholder */}
        <div className="w-24 h-24 bg-[#D9D9D9] rounded-full shrink-0" />

        <div className="space-y-1">
          <h4 className="text-xl font-bold text-slate-800">Abu Kabir</h4>
          <p className="text-sm text-slate-700 font-medium">234 8067 000 178</p>
          <p className="text-sm text-slate-700 font-medium">abc@gmail.com</p>
        </div>
      </div>
    </div>
  );
}
