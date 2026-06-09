"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ProductFormField } from "@/components/admin/catalog/product-form-field";
import { AdminSectionHeader } from "@/components/admin/shared/admin-section-header";
import { formatCurrency, formatDate } from "@/lib/admin/format-currency";
import { getApiErrorMessage } from "@/lib/api/api-error";
import { royalToast } from "@/lib/toast/royal-toast";
import {
  fetchCustomerOptions,
  fetchWallet,
  processWalletTransaction,
} from "@/services/customers-api";
import type {
  CustomerOptions,
  WalletDetail,
  WalletTransactionFormValues,
} from "@/types/customers";

const LIST_PATH = "/admin/customers/wallet";

const emptyTxn: WalletTransactionFormValues = {
  transactionType: "CREDIT",
  amount: 0,
  referenceType: "MANUAL",
  referenceId: "",
  description: "",
};

type Props = { walletId: string };

export function WalletDetailPage({ walletId }: Props) {
  const router = useRouter();
  const [wallet, setWallet] = useState<WalletDetail | null>(null);
  const [options, setOptions] = useState<CustomerOptions | null>(null);
  const [form, setForm] = useState<WalletTransactionFormValues>(emptyTxn);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const [detail, opts] = await Promise.all([
        fetchWallet(walletId),
        fetchCustomerOptions(),
      ]);
      setWallet(detail);
      setOptions(opts);
    } catch (err) {
      royalToast.error(getApiErrorMessage(err, "Failed to load wallet"));
      router.push(LIST_PATH);
    } finally {
      setLoading(false);
    }
  }, [walletId, router]);

  useEffect(() => {
    void load();
  }, [load]);

  async function handleCredit(ev: React.FormEvent) {
    ev.preventDefault();
    if (!form.amount || form.amount <= 0) {
      royalToast.error("Enter a valid amount");
      return;
    }
    setSaving(true);
    try {
      const updated = await processWalletTransaction(walletId, form);
      setWallet(updated);
      setForm(emptyTxn);
      royalToast.success("Transaction processed");
    } catch (err) {
      royalToast.error(getApiErrorMessage(err, "Transaction failed"));
    } finally {
      setSaving(false);
    }
  }

  if (loading || !wallet) {
    return (
      <div className="admin-product-form-page">
        <div className="admin-product-form-loading">
          <div className="admin-inline-spinner" />
          <p>Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-product-form-page">
      <AdminSectionHeader
        title={`Wallet — ${wallet.customerName}`}
        listPath={LIST_PATH}
        listLabel="Wallets"
        sectionLabel="Customers"
      />

      <div className="admin-data-card admin-order-detail">
        <div className="admin-inventory-detail-grid">
          <div className="admin-detail-card">
            <h4>Balance</h4>
            <p className="admin-wallet-balance">{formatCurrency(wallet.balance)}</p>
            <p>{wallet.currency}</p>
          </div>
          <div className="admin-detail-card">
            <h4>Customer</h4>
            <p>
              <strong>{wallet.customerName}</strong>
            </p>
            <p>{wallet.customerEmail}</p>
            <p>{wallet.customerPhone}</p>
          </div>
        </div>

        <section className="admin-product-section-card">
          <header>
            <h2>Credit / Debit</h2>
          </header>
          <form onSubmit={handleCredit} className="admin-product-section-grid">
            <ProductFormField label="Type" required>
              <select
                value={form.transactionType}
                onChange={(e) =>
                  setForm((p) => ({ ...p, transactionType: e.target.value }))
                }
              >
                {(options?.transactionTypes ?? ["CREDIT", "DEBIT"]).map((t) => (
                  <option key={t} value={t}>
                    {t}
                  </option>
                ))}
              </select>
            </ProductFormField>
            <ProductFormField label="Amount" required>
              <input
                type="number"
                min={0}
                step="0.01"
                value={form.amount || ""}
                onChange={(e) =>
                  setForm((p) => ({ ...p, amount: Number(e.target.value) }))
                }
              />
            </ProductFormField>
            <ProductFormField label="Reference Type">
              <select
                value={form.referenceType}
                onChange={(e) =>
                  setForm((p) => ({ ...p, referenceType: e.target.value }))
                }
              >
                {(options?.referenceTypes ?? []).map((t) => (
                  <option key={t} value={t}>
                    {t}
                  </option>
                ))}
              </select>
            </ProductFormField>
            <ProductFormField label="Description" className="span-2">
              <input
                value={form.description}
                onChange={(e) =>
                  setForm((p) => ({ ...p, description: e.target.value }))
                }
              />
            </ProductFormField>
            <div className="admin-product-form-footer-actions">
              <button
                type="submit"
                className="admin-btn admin-btn-primary"
                disabled={saving}
              >
                {saving ? "Processing..." : "Process Transaction"}
              </button>
            </div>
          </form>
        </section>

        <div className="admin-data-table-wrap">
          <table className="admin-data-table">
            <thead>
              <tr>
                <th>Type</th>
                <th>Amount</th>
                <th>Before</th>
                <th>After</th>
                <th>Reference</th>
                <th>Description</th>
                <th>Date</th>
              </tr>
            </thead>
            <tbody>
              {wallet.transactions.length === 0 ? (
                <tr>
                  <td colSpan={7} className="admin-data-empty">
                    No transactions
                  </td>
                </tr>
              ) : (
                wallet.transactions.map((t) => (
                  <tr key={t.id}>
                    <td>{t.transactionType}</td>
                    <td>{formatCurrency(t.amount)}</td>
                    <td>{formatCurrency(t.balanceBefore)}</td>
                    <td>{formatCurrency(t.balanceAfter)}</td>
                    <td>{t.referenceType ?? "—"}</td>
                    <td>{t.description ?? "—"}</td>
                    <td>{formatDate(t.createdAt)}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
