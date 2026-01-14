"use client";

import React, { useState } from "react";
import {
  LayoutDashboard,
  PlusCircle,
  Package,
  Bike,
  Users,
  BadgeDollarSign,
  Settings,
  Menu,
  X,
  Search,
  Bell,
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
  //{ label: "Finance", icon: BadgeDollarSign, href: "/dashboard/finance" },
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

  return (
    <div className="flex min-h-screen bg-[#F9FAFB]">
      {/* Mobile Overlay */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/20 backdrop-blur-sm lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
        fixed inset-y-0 left-0 z-50 w-64 transform bg-white border-r border-r-gray-200 transition-transform duration-300 ease-in-out
        lg:translate-x-0 lg:static lg:inset-0
        ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"}
      `}
      >
        <div className="flex flex-col items-center py-8 relative">
          <h1 className="text-3xl font-bold text-[#E97474]">OtoNav</h1>
          <p className="text-[10px] tracking-widest text-gray-400 uppercase font-medium">
            Vendor Dashboard
          </p>
        </div>

        <nav className="mt-6 flex-1 px-4 space-y-1">
          {navItems.map((item) => {
            const active = isActive(item.href);
            return (
              <Link
                key={item.label}
                href={item.href}
                onClick={() => setIsSidebarOpen(false)}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                  active
                    ? "bg-[#E6F4F1] text-[#E97474] font-semibold border-l-4 border-[#00A082]"
                    : "text-gray-500 hover:bg-gray-50"
                }`}
              >
                <item.icon
                  size={20}
                  className={active ? "text-[#00A082]" : "text-gray-400"}
                />
                <span className="text-[14px]">{item.label}</span>
              </Link>
            );
          })}
        </nav>
      </aside>

      {/* Main Content Wrapper */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Global Header */}
        <header className="h-20 bg-white border-b border-b-gray-200 flex items-center justify-between px-4 md:px-8">
          {/* Mobile Menu Toggle */}
          <button
            onClick={() => setIsSidebarOpen(true)}
            className="p-2 bg-gray-50 rounded-lg lg:hidden mr-2"
          >
            <Menu size={24} />
          </button>

          {/* Search Bar - Hidden on very small screens, or grows */}
          <div className="relative flex-1 max-w-md hidden sm:block">
            <Search
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
              size={18}
            />
            <input
              type="text"
              placeholder="Search here"
              className="w-full pl-10 pr-4 py-2 bg-white border border-gray-100 rounded-full focus:outline-none focus:ring-1 focus:ring-[#00A082] transition-all"
            />
          </div>

          {/* User Actions */}
          <div className="flex items-center gap-2 md:gap-6 ml-auto">
            <div className="relative p-2 bg-[#EBF5FF] rounded-full cursor-pointer">
              <Bell size={20} className="text-[#3B82F6]" />
              <span className="absolute -top-1 -right-1 bg-[#3B82F6] text-white text-[10px] w-5 h-5 flex items-center justify-center rounded-full border-2 border-white font-bold">
                21
              </span>
            </div>

            <div className="h-8 w-px bg-gray-200 mx-2 hidden md:block" />

            <div className="flex items-center gap-3">
              <div className="text-right hidden sm:block">
                <p className="text-xs text-gray-500">Hello,</p>
                <p className="text-sm font-bold text-gray-800">
                  {authUser?.name}
                </p>
              </div>
              <div className="w-10 h-10 rounded-full bg-gray-200 border-2 border-white shadow-sm overflow-hidden">
                <img
                  src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=150"
                  alt="User"
                  className="w-full h-full object-cover"
                />
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
