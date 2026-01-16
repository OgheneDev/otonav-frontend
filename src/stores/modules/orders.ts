import { create } from "zustand";
import axiosInstance from "@/api/axios";
import { Order, OrderStore } from "@/types/order";

export const useOrderStore = create<OrderStore>((set, get) => ({
  // Initial state
  orders: [],
  currentOrder: null,

  // Loading states
  isLoadingOrders: false,
  isLoadingOrder: false,
  isCreatingOrder: false,

  // Get all orders (filtered by role automatically)
  getAllOrders: async () => {
    try {
      set({ isLoadingOrders: true });

      const response = await axiosInstance.get("/orders");
      console.log("Orders:", response);

      if (!response.data.success) {
        throw new Error("Failed to fetch orders");
      }

      set({
        orders: response.data.data || [],
        isLoadingOrders: false,
      });

      return response.data;
    } catch (error: any) {
      set({ isLoadingOrders: false });
      throw error;
    }
  },

  // Get order by ID
  getOrderById: async (orderId: string) => {
    try {
      set({ isLoadingOrder: true });

      const response = await axiosInstance.get(`/orders/${orderId}`);

      if (!response.data.success || !response.data.data) {
        throw new Error("Failed to fetch order");
      }

      set({
        currentOrder: response.data.data,
        isLoadingOrder: false,
      });

      return response.data.data;
    } catch (error: any) {
      set({ isLoadingOrder: false });
      throw error;
    }
  },

  // Create order (Owner only)
  createOrder: async (orderData: {
    packageDescription: string;
    customerId: string;
    riderId: string;
  }) => {
    try {
      set({ isCreatingOrder: true });

      const response = await axiosInstance.post("/orders", orderData);

      if (!response.data.success) {
        throw new Error("Failed to create order");
      }

      // Add the new order to the list
      set((state) => ({
        orders: [response.data.data, ...state.orders],
        isCreatingOrder: false,
      }));

      return response.data;
    } catch (error: any) {
      set({ isCreatingOrder: false });
      throw error;
    }
  },

  // Owner sets customer location
  ownerSetCustomerLocation: async (orderId: string, locationLabel: string) => {
    try {
      const response = await axiosInstance.post(
        `/orders/${orderId}/set-customer-location`,
        { locationLabel }
      );

      if (!response.data.success) {
        throw new Error("Failed to set customer location");
      }

      // Update the order in the list
      set((state) => ({
        orders: state.orders.map((order) =>
          order.id === orderId ? response.data.data : order
        ),
        currentOrder:
          state.currentOrder?.id === orderId
            ? response.data.data
            : state.currentOrder,
      }));

      return response.data;
    } catch (error: any) {
      throw error;
    }
  },

  // Get customer location labels (Owner only)
  getCustomerLocationLabels: async (orderId: string) => {
    try {
      const response = await axiosInstance.get(
        `/orders/${orderId}/customer-location-labels`
      );

      if (!response.data.success) {
        throw new Error("Failed to fetch location labels");
      }

      return response.data.data;
    } catch (error: any) {
      throw error;
    }
  },

  // Cancel order
  cancelOrder: async (orderId: string) => {
    try {
      const response = await axiosInstance.delete(`/orders/${orderId}/cancel`);

      if (!response.data.success) {
        throw new Error("Failed to cancel order");
      }

      // Update the order in the list
      set((state) => ({
        orders: state.orders.map((order) =>
          order.id === orderId ? response.data.data : order
        ),
        currentOrder:
          state.currentOrder?.id === orderId
            ? response.data.data
            : state.currentOrder,
      }));

      return response.data;
    } catch (error: any) {
      throw error;
    }
  },

  // Helper actions
  clearOrders: () => {
    set({
      orders: [],
      currentOrder: null,
    });
  },

  setCurrentOrder: (order: Order | null) => {
    set({ currentOrder: order });
  },
}));
