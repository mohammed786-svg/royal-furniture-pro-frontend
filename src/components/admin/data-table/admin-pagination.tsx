"use client";

type AdminPaginationProps = {
  page: number;
  totalPages: number;
  pageSize: number;
  total: number;
  onPageChange: (page: number) => void;
  onPageSizeChange: (size: number) => void;
};

const PAGE_SIZES = [10, 25, 50, 100];

export function AdminPagination({
  page,
  totalPages,
  pageSize,
  total,
  onPageChange,
  onPageSizeChange,
}: AdminPaginationProps) {
  return (
    <div className="admin-data-pagination">
      <div className="admin-data-pagination-left">
        <span>Row Per Page</span>
        <select
          value={pageSize}
          onChange={(e) => onPageSizeChange(Number(e.target.value))}
          aria-label="Rows per page"
        >
          {PAGE_SIZES.map((size) => (
            <option key={size} value={size}>
              {size}
            </option>
          ))}
        </select>
        <span>Entries</span>
        <span className="admin-data-pagination-total">{total} total</span>
      </div>
      <div className="admin-data-pagination-right">
        <button
          type="button"
          className="admin-data-page-btn"
          disabled={page <= 1}
          onClick={() => onPageChange(page - 1)}
        >
          Prev
        </button>
        {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
          let pageNum = i + 1;
          if (totalPages > 5) {
            if (page <= 3) pageNum = i + 1;
            else if (page >= totalPages - 2) pageNum = totalPages - 4 + i;
            else pageNum = page - 2 + i;
          }
          return (
            <button
              key={pageNum}
              type="button"
              className={`admin-data-page-btn ${page === pageNum ? "active" : ""}`}
              onClick={() => onPageChange(pageNum)}
            >
              {pageNum}
            </button>
          );
        })}
        <button
          type="button"
          className="admin-data-page-btn"
          disabled={page >= totalPages}
          onClick={() => onPageChange(page + 1)}
        >
          Next
        </button>
      </div>
    </div>
  );
}
