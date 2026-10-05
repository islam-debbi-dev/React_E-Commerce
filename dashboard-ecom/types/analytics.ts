export interface RevenueSummary {
  total: number;
  previousPeriod: number;
  changePercent: number | null;
  windowDays: number;
}

export interface OrderStatusSummary {
  total: number;
  pending: number;
  confirmed: number;
  shipped: number;
  delivered: number;
  cancelled: number;
}

export interface CatalogueSummary {
  total: number;
  categories: number;
}

export interface CustomerSummary {
  total: number;
}

export interface ChannelSummary {
  telegram: number;
  whatsapp: number;
}

export interface SalesTrendPoint {
  date: string;
  revenue: number;
  orders: number;
}

export interface TopProduct {
  productId: string;
  title: string;
  image: string;
  units: number;
  revenue: number;
}

export interface OverviewData {
  code: string;
  message: string;
  revenue: RevenueSummary;
  orders: OrderStatusSummary;
  products: CatalogueSummary;
  customers: CustomerSummary;
  channels: ChannelSummary;
  salesTrend: SalesTrendPoint[];
  topProducts: TopProduct[];
  recentOrders: import("./order").Order[];
  generatedAt: string;
  db: boolean;
}