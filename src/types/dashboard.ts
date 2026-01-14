// types/dashboard.ts
export interface StatCardProps {
  label: string;
  value: number;
  icon: React.ReactNode;
  trend: string;
  color: string;
}

export interface NavItem {
  label: string;
  icon: React.ElementType;
  href: string;
  active?: boolean;
}
