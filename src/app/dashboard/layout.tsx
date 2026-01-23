"use client";

import React, { useState } from "react";
import {
  LayoutDashboard,
  PlusCircle,
  Package,
  Bike,
  Users,
  Settings,
  Menu,
  X,
  Search,
  Bell,
  ChevronRight,
  User,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuthStore } from "@/stores";

const navItems = [
  {
    label: "Dashboard",
    icon: LayoutDashboard,
    href: "/dashboard",
  },
  { label: "Create Order", icon: PlusCircle, href: "/dashboard/create-order" },
  { label: "Order Management", icon: Package, href: "/dashboard/orders" },
  { label: "Riders", icon: Bike, href: "/dashboard/riders" },
  { label: "Customers", icon: Users, href: "/dashboard/customers" },
  { label: "Settings", icon: Settings, href: "/dashboard/settings" },
];

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const { authUser } = useAuthStore();
  const pathname = usePathname();

  const isActive = (href: string) => {
    if (href === "/dashboard") {
      return pathname === "/dashboard";
    }
    return pathname.startsWith(href);
  };

  // Get profile image or fallback
  const getProfileImage = () => {
    if (authUser?.profileImage) {
      return (
        <img
          src={authUser.profileImage}
          alt={authUser?.name || "User"}
          className="w-full h-full object-cover"
          onError={(e) => {
            // If image fails to load, show fallback
            const target = e.target as HTMLImageElement;
            target.style.display = "none";
            const parent = target.parentElement;
            if (parent) {
              const fallback = parent.querySelector(".profile-fallback");
              if (fallback) {
                (fallback as HTMLElement).style.display = "flex";
              }
            }
          }}
        />
      );
    }

    // Return fallback icon if no profile image
    return (
      <div className="profile-fallback w-full h-full flex items-center justify-center bg-gray-300">
        <User size={20} className="text-gray-600" />
      </div>
    );
  };

  return (
    <div className="flex min-h-screen bg-linear-to-br from-gray-50 via-white to-gray-50">
      {/* Mobile Overlay */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/30 backdrop-blur-sm lg:hidden transition-opacity duration-300"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
        fixed inset-y-0 left-0 z-50 w-64 transform bg-white shadow-xl transition-transform duration-300 ease-in-out
        lg:translate-x-0 lg:static lg:inset-0 lg:shadow-none lg:border-r lg:border-gray-100
        ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"}
      `}
      >
        {/* Logo Section */}
        <div className="flex flex-col items-center py-8 px-6 border-b border-gray-100 relative">
          <div className="relative">
            <h1 className="text-3xl font-bold text-[#E97474] tracking-tight">
              OtoNav
            </h1>
            <div className="absolute -bottom-1 left-0 right-0 h-1 bg-linear-to-r from-[#E97474] to-[#00A082] rounded-full opacity-60"></div>
          </div>
          <p className="text-[10px] tracking-[0.2em] text-gray-400 uppercase mt-3">
            Vendor Dashboard
          </p>

          {/* Close Button - Mobile Only */}
          <button
            onClick={() => setIsSidebarOpen(false)}
            className="absolute top-4 right-4 p-2 rounded-lg hover:bg-gray-100 lg:hidden transition-colors"
          >
            <X size={20} className="text-gray-500" />
          </button>
        </div>

        {/* Navigation */}
        <nav className="mt-8 px-3 space-y-1.5">
          {navItems.map((item) => {
            const active = isActive(item.href);
            return (
              <Link
                key={item.label}
                href={item.href}
                onClick={() => setIsSidebarOpen(false)}
                className={`
                  group flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 relative
                  ${
                    active
                      ? "bg-linear-to-r from-[#E6F4F1] to-[#F0F9FF] text-[#E97474] shadow-sm"
                      : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                  }
                `}
              >
                {/* Active Indicator */}
                {active && (
                  <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-linear-to-b from-[#E97474] to-[#00A082] rounded-r-full"></div>
                )}

                <item.icon
                  size={20}
                  className={`transition-colors ${
                    active
                      ? "text-[#00A082]"
                      : "text-gray-400 group-hover:text-gray-600"
                  }`}
                />
                <span className="text-[14px] flex-1">{item.label}</span>

                {/* Hover Arrow */}
                <ChevronRight
                  size={16}
                  className={`transition-all ${
                    active
                      ? "opacity-100 text-[#00A082]"
                      : "opacity-0 group-hover:opacity-100 text-gray-400"
                  }`}
                />
              </Link>
            );
          })}
        </nav>

        {/* Bottom Gradient */}
        <div className="absolute bottom-0 left-0 right-0 h-24 bg-linear-to-t from-white via-white to-transparent pointer-events-none"></div>
      </aside>

      {/* Main Content Wrapper */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Global Header */}
        <header className="h-20 bg-white/80 backdrop-blur-md border-b border-gray-100 flex items-center justify-between px-4 md:px-8 sticky top-0 z-30 shadow-sm">
          {/* Mobile Menu Toggle */}
          <button
            onClick={() => setIsSidebarOpen(true)}
            className="p-2.5 rounded-xl bg-linear-to-br from-gray-50 to-white border border-gray-200 hover:border-gray-300 lg:hidden transition-all shadow-sm hover:shadow"
          >
            <Menu size={20} className="text-gray-700" />
          </button>

          {/* Search Bar */}
          <div className="relative flex-1 max-w-md hidden sm:block ml-4 lg:ml-0">
            <Search
              className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
              size={18}
            />
            <input
              type="text"
              placeholder="Search orders, riders, customers..."
              className="w-full pl-11 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-full text-sm text-gray-700 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#00A082] focus:bg-white focus:border-transparent transition-all"
            />
          </div>

          {/* User Actions */}
          <div className="flex items-center gap-3 md:gap-6 ml-auto">
            {/* Notification Bell */}
            <div className="relative group cursor-pointer">
              <div className="p-2.5 bg-linear-to-br from-[#EBF5FF] to-[#DBEAFE] rounded-xl transition-all group-hover:shadow-md">
                <Bell size={20} className="text-[#3B82F6]" />
              </div>
              <span className="absolute -top-1 -right-1 bg-linear-to-br from-[#3B82F6] to-[#2563EB] text-white text-[10px] w-5 h-5 flex items-center justify-center rounded-full border-2 border-white shadow-sm">
                21
              </span>
            </div>

            {/* Divider */}
            <div className="h-10 w-px bg-linear-to-b from-transparent via-gray-200 to-transparent hidden md:block" />

            {/* User Profile */}
            <div className="flex items-center gap-3 cursor-pointer group">
              <div className="text-right hidden sm:block">
                <p className="text-[11px] text-gray-500 tracking-wide">
                  Hello,
                </p>
                <p className="text-sm text-gray-800">{authUser?.name}</p>
              </div>
              <div className="w-10 h-10 rounded-full bg-linear-to-br from-gray-200 to-gray-300 border-2 border-white shadow-md overflow-hidden ring-2 ring-gray-100 group-hover:ring-[#00A082] transition-all">
                {getProfileImage()}
              </div>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto p-4 md:p-8">{children}</main>
      </div>
    </div>
  );
}
