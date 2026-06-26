"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { ProductForm } from "@/components/admin/catalog/product-form";
import { getApiErrorMessage } from "@/lib/api/api-error";
import { detailToForm } from "@/lib/catalog/product-form-utils";
import { royalToast } from "@/lib/toast/royal-toast";
import {
  createProduct,
  fetchProduct,
  fetchProductOptions,
  updateProduct,
} from "@/services/catalog-products";
import type {
  CatalogOption,
  SubCategoryOption,
  UnderSubCategoryOption,
} from "@/types/catalog";
import type { BrandOption, ProductFormValues } from "@/types/product";

const PRODUCTS_LIST_PATH = "/my-admin/catalog/products";

type ProductFormPageProps = {
  mode: "create" | "edit";
  productId?: string;
};

export function ProductFormPage({ mode, productId }: ProductFormPageProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [initial, setInitial] = useState<Partial<ProductFormValues>>();
  const [categories, setCategories] = useState<CatalogOption[]>([]);
  const [subCategories, setSubCategories] = useState<SubCategoryOption[]>([]);
  const [underSubCategories, setUnderSubCategories] = useState<
    UnderSubCategoryOption[]
  >([]);
  const [brands, setBrands] = useState<BrandOption[]>([]);

  const [loadError, setLoadError] = useState("");

  const loadPage = useCallback(async () => {
    setLoading(true);
    setLoadError("");
    try {
      const options = await fetchProductOptions();
      setCategories(options.categories);
      setSubCategories(options.subCategories);
      setUnderSubCategories(options.underSubCategories);
      setBrands(options.brands);

      if (mode === "edit" && productId) {
        const detail = await fetchProduct(productId);
        setInitial(detailToForm(detail));
      } else {
        setInitial(undefined);
      }
    } catch (err) {
      const message = getApiErrorMessage(err, "Failed to load product form");
      setLoadError(message);
      royalToast.error(message);
      if (mode === "edit") {
        router.push(PRODUCTS_LIST_PATH);
      }
    } finally {
      setLoading(false);
    }
  }, [mode, productId, router]);

  useEffect(() => {
    void loadPage();
  }, [loadPage]);

  async function handleSubmit(values: ProductFormValues) {
    try {
      if (mode === "edit" && productId) {
        await updateProduct(productId, values);
        royalToast.success("Product updated");
      } else {
        await createProduct(values);
        royalToast.success("Product created");
      }
      router.push(PRODUCTS_LIST_PATH);
    } catch (err) {
      throw new Error(getApiErrorMessage(err, "Save failed"));
    }
  }

  const title = mode === "edit" ? "Edit Product" : "Add Product";

  if (loading) {
    return (
      <div className="admin-product-form-page">
        <div className="admin-product-form-loading">
          <div className="admin-inline-spinner" aria-hidden />
          <p>Loading product form...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-product-form-page">
      <div className="admin-page-header">
        <div>
          <button
            type="button"
            className="admin-back-link"
            onClick={() => router.push(PRODUCTS_LIST_PATH)}
          >
            <ArrowLeft size={16} />
            Back to Products
          </button>
          <h1>{title}</h1>
          <div className="admin-breadcrumb">
            <Link href="/my-admin/dashboard">Dashboard</Link>
            <span>/</span>
            <Link href={PRODUCTS_LIST_PATH}>Products</Link>
            <span>/</span>
            <span>{title}</span>
          </div>
        </div>
      </div>

      {loadError && mode === "create" ? (
        <div className="admin-product-form-error-card">
          <p>{loadError}</p>
          <button
            type="button"
            className="admin-btn admin-btn-primary"
            onClick={() => void loadPage()}
          >
            Retry
          </button>
        </div>
      ) : (
        <ProductForm
          mode={mode}
          initial={initial}
          categories={categories}
          subCategories={subCategories}
          underSubCategories={underSubCategories}
          brands={brands}
          onCancel={() => router.push(PRODUCTS_LIST_PATH)}
          onSubmit={handleSubmit}
        />
      )}
    </div>
  );
}
