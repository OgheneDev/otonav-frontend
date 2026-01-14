import { Bike, BarChart3, MapPin, Clock } from "lucide-react";

export default function AuthLayout({
  children,
  title,
  subtitle,
}: {
  children: React.ReactNode;
  title: string;
  subtitle: string;
}) {
  return (
    <div className="min-h-screen flex bg-linear-to-br from-gray-50 to-white font-sans">
      {/* Form Section */}
      <div className="w-full lg:w-[45%] flex flex-col p-6 md:p-12 lg:p-16 justify-center">
        <div className="max-w-md w-full mx-auto">
          {/* Logo */}
          <div className="flex items-center gap-3 mb-16">
            <div className="w-11 h-11 bg-linear-to-br from-[#FF6B6B] to-[#ff5252] rounded-2xl flex items-center justify-center shadow-lg shadow-red-200/50 transition-transform hover:scale-105">
              <Bike className="text-white w-6 h-6" />
            </div>
            <span className="text-3xl font-bold bg-linear-to-r from-[#FF6B6B] to-[#ff5252] bg-clip-text text-transparent tracking-tight">
              OtoNav
            </span>
          </div>

          {/* Title & Subtitle */}
          <div className="mb-10">
            <h2 className="text-4xl font-bold text-gray-900 mb-3 leading-tight">
              {title}
            </h2>
            <p className="text-gray-600 text-lg leading-relaxed">{subtitle}</p>
          </div>

          {/* Form Content */}
          {children}
        </div>
      </div>

      {/* Enhanced Side Panel */}
      <div className="hidden lg:flex w-[55%] bg-linear-to-br from-[#F0F9F7] via-[#E8F5F1] to-[#F0F9F7] m-6 rounded-[48px] relative overflow-hidden items-center justify-center">
        {/* Animated Gradient Orbs */}
        <div
          className="absolute top-[-15%] right-[-15%] w-125 h-125 bg-linear-to-br from-[#FF6B6B]/10 to-transparent rounded-full blur-3xl animate-pulse"
          style={{ animationDuration: "4s" }}
        />
        <div
          className="absolute bottom-[-15%] left-[-15%] w-125 h-125 bg-linear-to-tr from-emerald-300/15 to-transparent rounded-full blur-3xl animate-pulse"
          style={{ animationDuration: "5s", animationDelay: "1s" }}
        />

        <div className="relative z-10 w-full max-w-lg px-8">
          {/* Feature Card */}
          <div className="bg-white/80 backdrop-blur-2xl border border-white/60 p-8 rounded-3xl shadow-2xl shadow-emerald-900/5 mb-8 transition-transform hover:scale-[1.02]">
            <div className="flex gap-4 mb-6">
              <div className="h-14 w-14 bg-linear-to-br from-emerald-100 to-emerald-50 rounded-2xl flex items-center justify-center shrink-0 shadow-sm">
                <BarChart3 className="text-emerald-600 w-7 h-7" />
              </div>
              <div>
                <h4 className="font-bold text-gray-900 text-xl mb-1">
                  Real-time Tracking
                </h4>
                <p className="text-gray-600 text-sm leading-relaxed">
                  Monitor deliveries with live GPS updates and route
                  optimization.
                </p>
              </div>
            </div>

            {/* Feature Highlights */}
            <div className="space-y-3 mt-6">
              <div className="flex items-center gap-3 text-sm">
                <div className="w-8 h-8 bg-emerald-50 rounded-lg flex items-center justify-center">
                  <MapPin className="w-4 h-4 text-emerald-600" />
                </div>
                <span className="text-gray-700 font-medium">
                  Live location tracking
                </span>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <div className="w-8 h-8 bg-emerald-50 rounded-lg flex items-center justify-center">
                  <Clock className="w-4 h-4 text-emerald-600" />
                </div>
                <span className="text-gray-700 font-medium">
                  Estimated arrival times
                </span>
              </div>
            </div>
          </div>

          {/* Value Proposition */}
          <div className="text-center bg-white/40 backdrop-blur-sm rounded-3xl p-8 border border-white/40">
            <h3 className="text-3xl font-bold text-gray-900 mb-3 leading-tight">
              Simplify Your Logistics
            </h3>
            <p className="text-gray-700 text-base leading-relaxed">
              Built for modern businesses that need reliable, efficient delivery
              management.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
