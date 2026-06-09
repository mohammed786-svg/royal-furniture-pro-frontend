import type { PaginationMeta } from "@/types/catalog";

export type AnalyticsPeriod = "7d" | "30d" | "90d";

export type ChartDataPoint = {
  label: string;
  value: number;
  color?: string;
};

export type DonutSegment = {
  label: string;
  value: number;
  color: string;
};

export type SalesSummary = {
  totalRevenue: number;
  totalOrders: number;
  avgOrderValue: number;
  revenueChangePercent: number;
  ordersChangePercent: number;
};

export type SalesTopProduct = {
  id: string;
  name: string;
  sku: string;
  quantity: number;
  revenue: number;
};

export type SalesRecentOrder = {
  id: string;
  orderNumber: string;
  customerName: string;
  totalAmount: number;
  status: string;
  createdAt?: string | null;
};

export type SalesDashboard = {
  summary: SalesSummary;
  revenueTrend: ChartDataPoint[];
  ordersByStatus: DonutSegment[];
  topProducts: SalesTopProduct[];
  paymentBreakdown: ChartDataPoint[];
  recentOrders: SalesRecentOrder[];
};

export type PageViewSummary = {
  totalViews: number;
  uniqueSessions: number;
  topReferrer?: string | null;
};

export type PageViewTopPage = {
  pageUrl: string;
  pageTitle: string;
  views: number;
};

export type PageViewDashboard = {
  summary: PageViewSummary;
  viewsTrend: ChartDataPoint[];
  topPages: PageViewTopPage[];
  viewsByProduct: { productName: string; views: number }[];
};

export type PageViewItem = {
  id: string;
  pageUrl: string;
  pageTitle: string;
  customerId?: string | null;
  sessionId: string;
  categoryId?: string | null;
  subCategoryId?: string | null;
  productId?: string | null;
  referrer?: string | null;
  ipAddress?: string | null;
  viewedAt?: string | null;
  createdAt?: string | null;
  updatedAt?: string | null;
};

export type PageViewFormValues = {
  pageUrl: string;
  pageTitle: string;
  customerId: string;
  sessionId: string;
  categoryId: string;
  subCategoryId: string;
  productId: string;
  referrer: string;
  ipAddress: string;
  viewedAt: string;
};

export type PageViewListResponse = {
  items: PageViewItem[];
  pagination: PaginationMeta;
};

export type SearchSummary = {
  totalSearches: number;
  avgResults: number;
  zeroResultRate: number;
};

export type SearchTopQuery = {
  query: string;
  count: number;
};

export type SearchDashboard = {
  summary: SearchSummary;
  topQueries: SearchTopQuery[];
  searchesTrend: ChartDataPoint[];
  zeroResultQueries: SearchTopQuery[];
};

export type SearchHistoryItem = {
  id: string;
  searchQuery: string;
  customerId?: string | null;
  sessionId: string;
  resultsCount: number;
  clickedProductId?: string | null;
  ipAddress?: string | null;
  searchedAt?: string | null;
  createdAt?: string | null;
  updatedAt?: string | null;
};

export type SearchHistoryFormValues = {
  searchQuery: string;
  customerId: string;
  sessionId: string;
  resultsCount: number;
  clickedProductId: string;
  ipAddress: string;
  searchedAt: string;
};

export type SearchListResponse = {
  items: SearchHistoryItem[];
  pagination: PaginationMeta;
};
