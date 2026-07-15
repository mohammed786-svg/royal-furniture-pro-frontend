import { formatApiDateTime } from "@/lib/datetime/format-api-datetime";

export function formatCurrency(value: number) {
  return `₹${value.toLocaleString("en-IN", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
}

export function formatDate(value?: string | null, options?: { dateOnly?: boolean }) {
  return formatApiDateTime(value, options);
}
