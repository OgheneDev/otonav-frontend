import { create } from "zustand";
import axiosInstance from "@/api/axios";
import {
  Customer,
  CustomersResponse,
  CustomerResponse,
  CustomerStatsResponse,
  CustomerStore,
} from "@/types/customer";

export const useCustomerStore = create<CustomerStore>((set, get) => ({
  // Initial state
  customers: [],
  currentCustomer: null,
  customerStats: null,

  // Loading states
  isLoadingCustomers: false,
  isLoadingCustomer: false,
  isLoadingStats: false,

  // Get all customers
  getAllCustomers: async () => {
    try {
      set({ isLoadingCustomers: true });

      const response = await axiosInstance.get<CustomersResponse>("/customers");

      if (!response.data.success) {
        throw new Error("Failed to fetch customers");
      }

      set({
        customers: response.data.data || [],
        isLoadingCustomers: false,
      });

      return response.data;
    } catch (error: any) {
      set({ isLoadingCustomers: false });

      if (error.response?.data?.message) {
        throw new Error(error.response.data.message);
      }
      throw error;
    }
  },

  // Get customer by ID
  getCustomerById: async (customerId: string) => {
    try {
      set({ isLoadingCustomer: true });

      if (!customerId) {
        throw new Error("Customer ID is required");
      }

      const response = await axiosInstance.get<CustomerResponse>(
        `/customers/${customerId}`
      );

      if (!response.data.success || !response.data.data) {
        throw new Error("Failed to fetch customer");
      }

      set({
        currentCustomer: response.data.data,
        isLoadingCustomer: false,
      });

      return response.data.data;
    } catch (error: any) {
      set({ isLoadingCustomer: false });

      if (error.response?.data?.message) {
        throw new Error(error.response.data.message);
      }
      throw error;
    }
  },

  // Search customers
  searchCustomers: async (query: string) => {
    try {
      set({ isLoadingCustomers: true });

      if (!query) {
        throw new Error("Search query is required");
      }

      const response = await axiosInstance.get<CustomersResponse>(
        `/customers/search?query=${encodeURIComponent(query)}`
      );

      if (!response.data.success) {
        throw new Error("Failed to search customers");
      }

      set({
        customers: response.data.data || [],
        isLoadingCustomers: false,
      });

      return response.data;
    } catch (error: any) {
      set({ isLoadingCustomers: false });

      if (error.response?.data?.message) {
        throw new Error(error.response.data.message);
      }
      throw error;
    }
  },

  // Get customer statistics
  getCustomerStats: async () => {
    try {
      set({ isLoadingStats: true });

      const response = await axiosInstance.get<CustomerStatsResponse>(
        "/customers/stats/overview"
      );

      if (!response.data.success) {
        throw new Error("Failed to fetch customer statistics");
      }

      set({
        customerStats: response.data.data,
        isLoadingStats: false,
      });

      return response.data;
    } catch (error: any) {
      set({ isLoadingStats: false });

      if (error.response?.data?.message) {
        throw new Error(error.response.data.message);
      }
      throw error;
    }
  },

  // Helper actions
  clearCustomers: () => {
    set({
      customers: [],
      currentCustomer: null,
      customerStats: null,
    });
  },

  setCurrentCustomer: (customer: Customer | null) => {
    set({ currentCustomer: customer });
  },
}));
