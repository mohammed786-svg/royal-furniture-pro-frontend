"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";

type InventoryPageHeaderProps = {
  title: string;
  listPath: string;
  listLabel: string;
  sectionLabel?: string;
};

export function InventoryPageHeader({
  title,
  listPath,
  listLabel,
  sectionLabel = "Inventory",
}: InventoryPageHeaderProps) {
  const router = useRouter();

  return (
    <div className="admin-page-header">
      <div>
        <button
          type="button"
          className="admin-back-link"
          onClick={() => router.push(listPath)}
        >
          <ArrowLeft size={16} />
          Back to {listLabel}
        </button>
        <h1>{title}</h1>
        <div className="admin-breadcrumb">
          <Link href="/admin/dashboard">Dashboard</Link>
          <span>/</span>
          <span>{sectionLabel}</span>
          <span>/</span>
          <Link href={listPath}>{listLabel}</Link>
          <span>/</span>
          <span>{title}</span>
        </div>
      </div>
    </div>
  );
}
