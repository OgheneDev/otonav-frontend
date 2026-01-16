"use client";

import { useState, useEffect } from "react";
import {
  Package,
  User,
  Search,
  X,
  MapPin,
  ChevronDown,
  Check,
  Bike,
  Info,
  ArrowRight,
} from "lucide-react";
import {
  useOrderStore,
  useCustomerStore,
  useToastStore,
  useRiderStore,
} from "@/stores";
import { Customer } from "@/types/customer";
import { Rider } from "@/types/rider";

export default function CreateOrderPage() {
  const { showToast } = useToastStore();
  const { createOrder, isCreatingOrder } = useOrderStore();
  const { customers, getAllCustomers, searchCustomers } = useCustomerStore();
  const { riders, getAllRiders } = useRiderStore();

  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(
    null
  );
  const [selectedRider, setSelectedRider] = useState<Rider | null>(null);
  const [packageDescription, setPackageDescription] = useState("");
  const [customerSearch, setCustomerSearch] = useState("");
  const [riderSearch, setRiderSearch] = useState("");
  const [isCustomerDropdownOpen, setIsCustomerDropdownOpen] = useState(false);
  const [isRiderDropdownOpen, setIsRiderDropdownOpen] = useState(false);
  const [showLocationModal, setShowLocationModal] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState<string>("");

  useEffect(() => {
    getAllCustomers();
    getAllRiders({ includePending: false });
  }, [getAllCustomers, getAllRiders]);

  useEffect(() => {
    if (customerSearch.trim()) {
      const timeoutId = setTimeout(() => {
        searchCustomers(customerSearch);
      }, 300);
      return () => clearTimeout(timeoutId);
    } else {
      getAllCustomers();
    }
  }, [customerSearch, searchCustomers, getAllCustomers]);

  const filteredRiders = riders.filter(
    (rider) =>
      rider.name?.toLowerCase().includes(riderSearch.toLowerCase()) ||
      rider.email.toLowerCase().includes(riderSearch.toLowerCase())
  );

  const customerLocations = selectedCustomer?.locations || [];

  const resetForm = () => {
    setSelectedCustomer(null);
    setSelectedRider(null);
    setPackageDescription("");
    setCustomerSearch("");
    setRiderSearch("");
    setSelectedLocation("");
    setShowLocationModal(false);
  };

  const createOrderDirectly = async () => {
    try {
      await createOrder({
        packageDescription,
        customerId: selectedCustomer!.id,
        riderId: selectedRider!.id,
      });

      showToast("Order created successfully!", "success");
      resetForm();
    } catch (error: any) {
      showToast(error.message || "Failed to create order", "error");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCustomer || !selectedRider || !packageDescription.trim()) {
      showToast("Please fill in all fields", "error");
      return;
    }
    if (customerLocations.length > 0) {
      setShowLocationModal(true);
      return;
    }
    await createOrderDirectly();
  };

  const handleCreateWithLocation = async () => {
    if (!selectedLocation) {
      showToast("Please select a delivery location", "error");
      return;
    }
    await createOrderDirectly();
  };

  const handleCustomerSelect = (customer: Customer) => {
    setSelectedCustomer(customer);
    setCustomerSearch("");
    setIsCustomerDropdownOpen(false);
    setSelectedLocation("");
  };

  const handleRiderSelect = (rider: Rider) => {
    setSelectedRider(rider);
    setRiderSearch("");
    setIsRiderDropdownOpen(false);
  };

  const isFormValid = !!(
    selectedCustomer &&
    selectedRider &&
    packageDescription.trim()
  );

  return (
    <div className="min-h-screen bg-[#F9FAFB] pb-20">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="mb-10 text-center md:text-start">
          <h1 className="text-2xl md:text-3xl font-bold  text-gray-900 tracking-tight">
            Dispatch Central
          </h1>
          <div className="h-1 w-12 hidden md:block bg-[#00A082] rounded-full mt-2 mb-3" />
          <p className="text-gray-500 text-sm mt-1">
            Generate a new delivery request and assign a rider.
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="grid grid-cols-1 lg:grid-cols-3 gap-8"
        >
          <div className="lg:col-span-2 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {/* Customer Search */}
              <div className="relative customer-dropdown-container">
                <label className="text-[10px] uppercase tracking-wider text-gray-400 ml-1 mb-2.5 block">
                  1. Customer
                </label>
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Search by name..."
                    className="w-full pl-11 pr-4 py-3.5 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#00A082]/20 focus:border-[#00A082] outline-none transition-all text-sm"
                    value={
                      selectedCustomer
                        ? selectedCustomer.name ?? selectedCustomer.email
                        : customerSearch
                    }
                    onChange={(e) => {
                      setCustomerSearch(e.target.value);
                      setIsCustomerDropdownOpen(true);
                    }}
                    onFocus={() => setIsCustomerDropdownOpen(true)}
                  />
                  <div className="absolute left-3.5 top-1/2 -translate-y-1/2 p-1.5 bg-[#00A082]/8 rounded-md">
                    <User
                      className="text-[#00A082]"
                      size={16}
                      strokeWidth={1.5}
                    />
                  </div>
                </div>

                {isCustomerDropdownOpen && customers.length > 0 && (
                  <div className="absolute z-30 w-full mt-2 bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden max-h-60 overflow-y-auto">
                    {customers.map((c) => (
                      <div
                        key={c.id}
                        onClick={() => handleCustomerSelect(c)}
                        className="px-4 py-3.5 hover:bg-[#E6F4F1] cursor-pointer flex items-center justify-between border-b border-gray-50 last:border-0 transition-colors"
                      >
                        <div>
                          <p className="text-gray-800 text-sm mb-0.5">
                            {c.name || "Guest"}
                          </p>
                          <p className="text-xs text-gray-500">{c.email}</p>
                        </div>
                        <ChevronDown
                          size={14}
                          className="text-gray-300 -rotate-90"
                          strokeWidth={1.5}
                        />
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Rider Search */}
              <div className="relative rider-dropdown-container">
                <label className="text-[10px] uppercase tracking-wider text-gray-400 ml-1 mb-2.5 block">
                  2. Assign Rider
                </label>
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Search riders..."
                    className="w-full pl-11 pr-4 py-3.5 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#00A082]/20 focus:border-[#00A082] outline-none transition-all text-sm"
                    value={
                      selectedRider ? selectedRider.name ?? "" : riderSearch
                    }
                    onChange={(e) => {
                      setRiderSearch(e.target.value);
                      setIsRiderDropdownOpen(true);
                    }}
                    onFocus={() => setIsRiderDropdownOpen(true)}
                  />
                  <div className="absolute left-3.5 top-1/2 -translate-y-1/2 p-1.5 bg-emerald-50 rounded-md">
                    <Bike
                      className="text-emerald-600"
                      size={16}
                      strokeWidth={1.5}
                    />
                  </div>
                </div>

                {isRiderDropdownOpen && filteredRiders.length > 0 && (
                  <div className="absolute z-30 w-full mt-2 bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden max-h-60 overflow-y-auto">
                    {filteredRiders.map((r) => (
                      <div
                        key={r.id}
                        onClick={() => handleRiderSelect(r)}
                        className="px-4 py-3.5 hover:bg-[#E6F4F1] cursor-pointer border-b border-gray-50 last:border-0 transition-colors"
                      >
                        <p className="text-gray-800 text-sm mb-0.5">{r.name}</p>
                        <p className="text-xs text-gray-500">{r.phoneNumber}</p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
              <label className="text-[10px] uppercase tracking-wider text-gray-400 mb-4 block">
                3. Order Details
              </label>
              <div className="relative">
                <textarea
                  rows={5}
                  className="w-full p-4 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:border-[#00A082] focus:ring-2 focus:ring-[#00A082]/20 outline-none transition-all resize-none text-gray-700 text-sm leading-relaxed"
                  placeholder="What are we delivering? Include size, weight, or fragile notes..."
                  value={packageDescription}
                  onChange={(e) => setPackageDescription(e.target.value)}
                />
                <div className="absolute bottom-3 right-3 p-1.5 bg-gray-100 rounded-lg">
                  <Package
                    className="text-gray-400"
                    size={16}
                    strokeWidth={1.5}
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm sticky top-8">
              <h3 className="text-lg font-bold mb-6 flex items-center gap-2.5 text-gray-800">
                <div className="p-1.5 bg-[#00A082]/10 rounded-lg">
                  <Info size={16} className="text-[#00A082]" strokeWidth={2} />
                </div>
                Order Summary
              </h3>

              <div className="space-y-6">
                <div className="relative pl-8 space-y-8 before:content-[''] before:absolute before:left-2.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-linear-to-b before:from-gray-200 before:to-transparent">
                  <div className="relative">
                    <div
                      className={`absolute -left-7 top-0 w-5 h-5 rounded-full border-2 border-white flex items-center justify-center z-10 shadow-sm transition-all ${
                        selectedCustomer ? "bg-[#00A082]" : "bg-gray-200"
                      }`}
                    >
                      {selectedCustomer && (
                        <Check
                          size={10}
                          className="text-white"
                          strokeWidth={3}
                        />
                      )}
                    </div>
                    <p className="text-[10px] uppercase tracking-wider text-gray-400 mb-1">
                      From
                    </p>
                    <p className="text-sm text-gray-700 truncate">
                      {selectedCustomer
                        ? selectedCustomer.name || selectedCustomer.email
                        : "Select Customer"}
                    </p>
                  </div>

                  <div className="relative">
                    <div
                      className={`absolute -left-7 top-0 w-5 h-5 rounded-full border-2 border-white flex items-center justify-center z-10 shadow-sm transition-all ${
                        selectedRider ? "bg-[#E97474]" : "bg-gray-200"
                      }`}
                    >
                      {selectedRider && (
                        <Check
                          size={10}
                          className="text-white"
                          strokeWidth={3}
                        />
                      )}
                    </div>
                    <p className="text-[10px] uppercase tracking-wider text-gray-400 mb-1">
                      Assigned To
                    </p>
                    <p className="text-sm text-gray-700 truncate">
                      {selectedRider ? selectedRider.name : "Select Rider"}
                    </p>
                  </div>
                </div>

                <div className="pt-6 border-t border-gray-100">
                  <button
                    type="submit"
                    disabled={!isFormValid || isCreatingOrder}
                    className={`w-full py-4 rounded-xl text-sm cursor-pointer flex items-center justify-center gap-2 transition-all ${
                      isFormValid
                        ? "bg-[#E97474] hover:bg-[#E97474]/90 text-white shadow-lg shadow-[#E97474]/20 hover:shadow-xl"
                        : "bg-gray-100 text-gray-400 cursor-not-allowed shadow-none"
                    }`}
                  >
                    {isCreatingOrder ? "Processing..." : "Create Order"}
                    {!isCreatingOrder && (
                      <ArrowRight size={18} strokeWidth={1.5} />
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </form>
      </div>

      {/* Modal */}
      {showLocationModal && (
        <div className="fixed inset-0 bg-gray-900/40 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl max-w-md w-full p-8 shadow-2xl border border-gray-100 animate-in zoom-in-95 duration-200">
            <div className="text-center mb-8">
              <div className="w-16 h-16 bg-[#E6F4F1] text-[#00A082] rounded-xl flex items-center justify-center mx-auto mb-4">
                <MapPin size={28} strokeWidth={1.5} />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">
                Where to?
              </h3>
              <p className="text-gray-500 text-sm">
                Select a saved address for {selectedCustomer?.name}
              </p>
            </div>

            <div className="space-y-3 mb-8">
              {customerLocations.map((loc, i) => (
                <button
                  key={i}
                  onClick={() => setSelectedLocation(loc.label)}
                  className={`w-full p-4 rounded-xl border-2 text-left transition-all flex items-center justify-between ${
                    selectedLocation === loc.label
                      ? "border-[#00A082] bg-[#E6F4F1]"
                      : "border-gray-100 hover:border-gray-200 bg-gray-50 hover:bg-gray-100"
                  }`}
                >
                  <span className="text-gray-700 text-sm">{loc.label}</span>
                  {selectedLocation === loc.label && (
                    <Check
                      size={18}
                      className="text-[#00A082]"
                      strokeWidth={2.5}
                    />
                  )}
                </button>
              ))}
            </div>

            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => createOrderDirectly()}
                className="py-3.5 text-gray-500 hover:bg-gray-50 rounded-xl transition-all text-sm"
              >
                Skip
              </button>
              <button
                onClick={handleCreateWithLocation}
                disabled={!selectedLocation}
                className="py-3.5 bg-[#00A082] text-white rounded-xl shadow-md shadow-[#00A082]/20 hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed text-sm"
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
