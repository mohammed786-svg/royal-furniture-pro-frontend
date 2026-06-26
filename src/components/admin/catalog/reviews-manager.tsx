"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Check, Plus, X } from "lucide-react";
import {
  AdminDataTable,
  type AdminTableColumn,
} from "@/components/admin/data-table/admin-data-table";
import { AdminDataToolbar } from "@/components/admin/data-table/admin-data-toolbar";
import { AdminPagination } from "@/components/admin/data-table/admin-pagination";
import { formatDate } from "@/lib/admin/format-currency";
import { getApiErrorMessage } from "@/lib/api/api-error";
import { royalToast } from "@/lib/toast/royal-toast";
import {
  deleteReview,
  fetchReviews,
  updateReviewStatus,
} from "@/services/catalog-reviews";
import type { PaginationMeta } from "@/types/catalog";
import type { ReviewItem } from "@/types/reviews";

const NEW_PATH = "/my-admin/catalog/reviews/new";
const BASE_PATH = "/my-admin/catalog/reviews";

type ApprovalFilter = "all" | "pending" | "approved";

function parseSort(value: string) {
  const [sortBy, sortDir] = value.split("-") as [string, "asc" | "desc"];
  return { sortBy, sortDir: sortDir ?? "desc" };
}

function renderStars(rating: number) {
  return "★".repeat(rating) + "☆".repeat(5 - rating);
}

export function ReviewsManager() {
  const router = useRouter();
  const [rows, setRows] = useState<ReviewItem[]>([]);
  const [pagination, setPagination] = useState<PaginationMeta>({
    page: 1,
    pageSize: 10,
    total: 0,
    totalPages: 1,
  });
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [sortBy, setSortBy] = useState("createdAt-desc");
  const [approvalFilter, setApprovalFilter] = useState<ApprovalFilter>("all");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const t = setTimeout(() => setDebouncedSearch(search), 300);
    return () => clearTimeout(t);
  }, [search]);

  const loadData = useCallback(async () => {
    setLoading(true);
    try {
      const { sortBy: sf, sortDir } = parseSort(sortBy);
      const data = await fetchReviews({
        page: pagination.page,
        pageSize: pagination.pageSize,
        search: debouncedSearch,
        sortBy: sf,
        sortDir,
        isApproved:
          approvalFilter === "all" ? undefined : approvalFilter === "approved",
      });
      setRows(data.items);
      setPagination(data.pagination);
    } catch (err) {
      royalToast.error(getApiErrorMessage(err, "Failed to load reviews"));
    } finally {
      setLoading(false);
    }
  }, [pagination.page, pagination.pageSize, debouncedSearch, sortBy, approvalFilter]);

  useEffect(() => {
    void loadData();
  }, [loadData]);
  useEffect(() => {
    setPagination((p) => ({ ...p, page: 1 }));
  }, [debouncedSearch, sortBy, approvalFilter]);

  async function handleApprove(row: ReviewItem) {
    try {
      await updateReviewStatus(row.id, "APPROVED");
      royalToast.success("Review approved");
      await loadData();
    } catch (err) {
      royalToast.error(getApiErrorMessage(err, "Approve failed"));
    }
  }

  async function handleReject(row: ReviewItem) {
    try {
      await updateReviewStatus(row.id, "REJECTED");
      royalToast.success("Review rejected");
      await loadData();
    } catch (err) {
      royalToast.error(getApiErrorMessage(err, "Reject failed"));
    }
  }

  async function handleDelete(row: ReviewItem) {
    if (!window.confirm(`Delete review "${row.title || row.id}"?`)) return;
    try {
      await deleteReview(row.id);
      royalToast.success("Review deleted");
      await loadData();
    } catch (err) {
      royalToast.error(getApiErrorMessage(err, "Delete failed"));
    }
  }

  const columns = useMemo(
    (): AdminTableColumn<ReviewItem>[] => [
      {
        key: "title",
        label: "Review",
        render: (r) => (
          <button
            type="button"
            className="admin-data-link"
            onClick={() => router.push(`${BASE_PATH}/${r.id}`)}
          >
            {r.title || "—"}
          </button>
        ),
      },
      {
        key: "productName",
        label: "Product",
        render: (r) => (
          <span>
            {r.productName} <small>({r.productSku})</small>
          </span>
        ),
      },
      { key: "customerName", label: "Customer" },
      {
        key: "rating",
        label: "Rating",
        render: (r) => <span title={`${r.rating}/5`}>{renderStars(r.rating)}</span>,
      },
      {
        key: "isVerifiedPurchase",
        label: "Verified",
        render: (r) => (r.isVerifiedPurchase ? "Yes" : "No"),
      },
      {
        key: "isApproved",
        label: "Status",
        render: (r) => (
          <span
            className={`admin-status-badge ${r.isApproved ? "active" : "inactive"}`}
          >
            {r.isApproved ? "Approved" : "Pending"}
          </span>
        ),
      },
      { key: "createdAt", label: "Date", render: (r) => formatDate(r.createdAt) },
    ],
    [router],
  );

  return (
    <>
      <div className="admin-data-tabs">
        <h3 className="admin-data-tabs-title">Reviews & Ratings</h3>
        <Link
          href={NEW_PATH}
          className="admin-btn admin-btn-primary admin-data-add-btn"
        >
          <Plus size={16} /> Add Review
        </Link>
      </div>
      <div className="admin-data-card">
        <div className="admin-data-filter-tabs">
          {(["all", "pending", "approved"] as ApprovalFilter[]).map((f) => (
            <button
              key={f}
              type="button"
              className={approvalFilter === f ? "active" : ""}
              onClick={() => setApprovalFilter(f)}
            >
              {f === "all" ? "All" : f === "pending" ? "Pending" : "Approved"}
            </button>
          ))}
        </div>
        <AdminDataToolbar
          title="Review List"
          search={search}
          viewMode="table"
          sortBy={sortBy}
          onSearchChange={setSearch}
          onViewModeChange={() => {}}
          onSortChange={setSortBy}
          onRefresh={() => void loadData()}
        />
        <AdminDataTable
          columns={columns}
          rows={rows}
          loading={loading}
          selectedIds={new Set()}
          onToggleSelect={() => {}}
          onToggleSelectAll={() => {}}
          onEdit={(row) => router.push(`${BASE_PATH}/${row.id}`)}
          onDelete={handleDelete}
          renderRowActions={(row) => (
            <>
              {!row.isApproved && (
                <button type="button" onClick={() => void handleApprove(row)}>
                  <Check size={14} /> Approve
                </button>
              )}
              {row.isApproved && (
                <button type="button" onClick={() => void handleReject(row)}>
                  <X size={14} /> Reject
                </button>
              )}
              <button
                type="button"
                onClick={() => router.push(`${BASE_PATH}/${row.id}/edit`)}
              >
                Edit
              </button>
            </>
          )}
        />
        <AdminPagination
          page={pagination.page}
          totalPages={pagination.totalPages}
          pageSize={pagination.pageSize}
          total={pagination.total}
          onPageChange={(page) => setPagination((p) => ({ ...p, page }))}
          onPageSizeChange={(ps) =>
            setPagination((p) => ({ ...p, pageSize: ps, page: 1 }))
          }
        />
      </div>
    </>
  );
}
