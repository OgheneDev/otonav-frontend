export interface Order {
  id: string;
  orderNumber: string;
  orgId: string;
  packageDescription: string;
  customerId: string;
  riderId: string;
  riderCurrentLocation: string | null;
  customerLocationLabel: string | null;
  customerLocationPrecise: string | null;
  status:
    | "pending"
    | "rider_accepted"
    | "customer_location_set"
    | "confirmed"
    | "delivered"
    | "cancelled";
  assignedAt: string | null;
  riderAcceptedAt: string | null;
  customerLocationSetAt: string | null;
  deliveredAt: string | null;
  cancelledAt: string | null;
  createdAt: string;
  updatedAt: string;
  customer?: {
    id: string;
    email: string;
    name: string | null;
    phoneNumber: string;
  };
  rider?: {
    id: string;
    email: string;
    name: string | null;
    currentLocation: string | null;
    phoneNumber: string;
  };
}

export interface CustomerLocationLabel {
  label: string;
}

export interface CreateOrderDTO {
  packageDescription: string;
  customerId: string;
  riderId: string;
}

export interface OrderResponse {
  success: boolean;
  message: string;
  data: Order;
}

export interface OrdersResponse {
  success: boolean;
  message: string;
  data: Order[];
}

export interface CustomerLocationLabelsResponse {
  success: boolean;
  message: string;
  data: CustomerLocationLabel[];
}

export interface OrderStore {
  // State
  orders: Order[];
  currentOrder: Order | null;

  // Loading states
  isLoadingOrders: boolean;
  isLoadingOrder: boolean;
  isCreatingOrder: boolean;

  // Actions
  getAllOrders: () => Promise<OrdersResponse>;
  getOrderById: (orderId: string) => Promise<Order>;
  createOrder: (orderData: CreateOrderDTO) => Promise<OrderResponse>;
  ownerSetCustomerLocation: (
    orderId: string,
    locationLabel: string
  ) => Promise<OrderResponse>;
  getCustomerLocationLabels: (
    orderId: string
  ) => Promise<CustomerLocationLabel[]>;
  cancelOrder: (orderId: string) => Promise<OrderResponse>;

  // Helper actions
  clearOrders: () => void;
  setCurrentOrder: (order: Order | null) => void;
}
