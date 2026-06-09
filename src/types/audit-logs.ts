export type AuditLogItem = {
  id: string;
  userId?: string | null;
  customerId?: string | null;
  actionType: string;
  tableName: string;
  recordId?: string | null;
  oldValues: Record<string, unknown>;
  newValues: Record<string, unknown>;
  ipAddress?: string | null;
  userAgent?: string | null;
  remarks?: string | null;
  loggedAt?: string | null;
  createdAt?: string | null;
};
