import type { ID } from "@/types/common";

export type CustomerBase = {
  customerId: ID;
  email?: string;
  phone?: string;
  isGuest: boolean;
};
