"use client";

import Link from "next/link";
import { AccountShell } from "@/components/account/account-shell";
import { formatPrice } from "@/lib/constants/cart-data";
import { PAYMENT_METHODS } from "@/lib/constants/payment-config";
import { useOrderStore } from "@/lib/store/order-store";

export function AccountPaymentsContent() {
  const orders = useOrderStore((s) => s.orders);

  return (
    <AccountShell
      title="Payment History"
      breadcrumbs={[
        { label: "Home", href: "/" },
        { label: "My Account", href: "/account" },
        { label: "Payment History" },
      ]}
    >
      <p className="account-lead">
        UPI, bank transfer, and Google Pay payments submitted at checkout.
      </p>

      {orders.length === 0 ? (
        <p className="account-empty">No payment records yet.</p>
      ) : (
        <table className="account-table">
          <thead>
            <tr>
              <th>Order</th>
              <th>Method</th>
              <th>Reference</th>
              <th>Amount</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => {
              const methodLabel =
                PAYMENT_METHODS.find((m) => m.id === order.paymentMethod)?.label ??
                order.paymentMethod;
              return (
                <tr key={order.id}>
                  <td>
                    <Link
                      href={`/track-order?orderId=${order.id}`}
                      className="account-link"
                    >
                      {order.id}
                    </Link>
                  </td>
                  <td>{methodLabel}</td>
                  <td className="account-table__mono">{order.paymentReference}</td>
                  <td>{formatPrice(order.total)}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      )}
    </AccountShell>
  );
}
