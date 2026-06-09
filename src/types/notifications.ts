export type NotificationItem = {
  id: string;
  title: string;
  message: string;
  channel: string;
  templateCode?: string | null;
  targetType: string;
  isActive: boolean;
  createdAt?: string | null;
  updatedAt?: string | null;
  logs?: NotificationLogItem[];
};

export type NotificationFormValues = {
  title: string;
  message: string;
  channel: string;
  templateCode: string;
  targetType: string;
  isActive: boolean;
};

export type NotificationLogItem = {
  id: string;
  notificationId?: string | null;
  notificationTitle?: string | null;
  customerId?: string | null;
  customerFullName?: string | null;
  customerEmail?: string | null;
  userId?: string | null;
  userFullName?: string | null;
  userEmail?: string | null;
  channel: string;
  recipient?: string | null;
  subject?: string | null;
  body?: string | null;
  status: string;
  sentAt?: string | null;
  failureReason?: string | null;
  metadata?: Record<string, unknown>;
  createdAt?: string | null;
  updatedAt?: string | null;
};

export type NotificationMetaOptions = {
  customers: Array<{
    id: string;
    fullName: string;
    email?: string | null;
    phone?: string | null;
  }>;
  channels: string[];
  targetTypes: string[];
  statuses: string[];
};
