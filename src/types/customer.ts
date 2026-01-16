export interface Customer {
  id: string;
  email: string;
  name: string | null;
  phoneNumber: string | null;
  emailVerified: boolean;
  registrationCompleted: boolean | null;
  registrationStatus: "pending" | "completed" | "cancelled" | "expired" | null;
  createdAt: string;
  lastLoginAt: string | null;
  locations: Array<{
    label: string;
    preciseLocation: string;
  }>;
}

export interface CustomersResponse {
  success: boolean;
  data: Customer[];
  count: number;
}

export interface CustomerResponse {
  success: boolean;
  data: Customer;
}

export interface CustomerStats {
  total: number;
  verified: number;
  pending: number;
  active: number;
}

export interface CustomerStatsResponse {
  success: boolean;
  data: CustomerStats;
}

export interface CustomerStore {
  // State
  customers: Customer[];
  currentCustomer: Customer | null;
  customerStats: CustomerStats | null;

  // Loading states
  isLoadingCustomers: boolean;
  isLoadingCustomer: boolean;
  isLoadingStats: boolean;

  // Actions
  getAllCustomers: () => Promise<CustomersResponse>;
  getCustomerById: (customerId: string) => Promise<Customer>;
  searchCustomers: (query: string) => Promise<CustomersResponse>;
  getCustomerStats: () => Promise<CustomerStatsResponse>;

  // Helper actions
  clearCustomers: () => void;
  setCurrentCustomer: (customer: Customer | null) => void;
}
