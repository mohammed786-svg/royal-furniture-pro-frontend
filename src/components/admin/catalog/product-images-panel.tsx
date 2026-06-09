"use client";

import { useRef } from "react";
import { ImagePlus, Star, Trash2 } from "lucide-react";
import { ProductFormField } from "@/components/admin/catalog/product-form-field";
import { resolveMediaUrl } from "@/lib/media/resolve-url";
import { fileToDataUrl } from "@/services/catalog-products";
import type { ProductImage } from "@/types/product";

const IMAGE_TYPES = [
  { value: "gallery", label: "Gallery" },
  { value: "thumbnail", label: "Thumbnail" },
  { value: "lifestyle", label: "Lifestyle" },
  { value: "detail", label: "Detail" },
  { value: "360", label: "360 View" },
];

type ProductImagesPanelProps = {
  images: ProductImage[];
  productName: string;
  error?: string;
  onChange: (images: ProductImage[]) => void;
};

export function ProductImagesPanel({
  images,
  productName,
  error,
  onChange,
}: ProductImagesPanelProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  async function addFiles(files: FileList | File[]) {
    const list = Array.from(files).filter((f) => f.type.startsWith("image/"));
    if (!list.length) return;

    const uploaded = await Promise.all(list.map((file) => fileToDataUrl(file)));
    const next = [...images];
    uploaded.forEach((imageUrl, offset) => {
      next.push({
        imageUrl,
        altText: productName || "Product image",
        imageType: "gallery",
        isPrimary: next.length === 0 && offset === 0,
        is360: false,
        displayOrder: next.length,
      });
    });
    onChange(next);
  }

  function updateImage(index: number, patch: Partial<ProductImage>) {
    onChange(images.map((img, i) => (i === index ? { ...img, ...patch } : img)));
  }

  function setPrimary(index: number) {
    onChange(
      images.map((img, i) => ({
        ...img,
        isPrimary: i === index,
      })),
    );
  }

  function removeImage(index: number) {
    const next = images.filter((_, i) => i !== index);
    if (next.length && !next.some((img) => img.isPrimary)) {
      next[0] = { ...next[0], isPrimary: true };
    }
    onChange(next.map((img, i) => ({ ...img, displayOrder: i })));
  }

  function moveImage(index: number, direction: -1 | 1) {
    const target = index + direction;
    if (target < 0 || target >= images.length) return;
    const next = [...images];
    [next[index], next[target]] = [next[target], next[index]];
    onChange(next.map((img, i) => ({ ...img, displayOrder: i })));
  }

  return (
    <div className="admin-product-images-panel">
      <ProductFormField
        label="Product Images"
        hint="Upload multiple images. Mark one as primary for listings. Supports gallery, lifestyle, and 360° types."
        error={error}
      >
        <div
          className="admin-image-dropzone"
          onDragOver={(e) => {
            e.preventDefault();
            e.currentTarget.classList.add("drag-over");
          }}
          onDragLeave={(e) => e.currentTarget.classList.remove("drag-over")}
          onDrop={(e) => {
            e.preventDefault();
            e.currentTarget.classList.remove("drag-over");
            void addFiles(e.dataTransfer.files);
          }}
          onClick={() => inputRef.current?.click()}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") inputRef.current?.click();
          }}
          role="button"
          tabIndex={0}
        >
          <ImagePlus size={28} />
          <p>Drag & drop images here or click to browse</p>
          <span>PNG, JPG, WEBP — multiple files supported</span>
          <input
            ref={inputRef}
            type="file"
            accept="image/*"
            multiple
            hidden
            onChange={(e) => {
              if (e.target.files) void addFiles(e.target.files);
              e.target.value = "";
            }}
          />
        </div>
      </ProductFormField>

      {images.length > 0 && (
        <div className="admin-image-gallery">
          {images.map((img, idx) => (
            <article
              key={idx}
              className={`admin-image-card ${img.isPrimary ? "is-primary" : ""}`}
            >
              <div className="admin-image-card-preview">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={resolveMediaUrl(img.imageUrl) ?? img.imageUrl}
                  alt={img.altText ?? ""}
                />
                {img.isPrimary && (
                  <span className="admin-image-primary-badge">
                    <Star size={12} /> Primary
                  </span>
                )}
              </div>

              <div className="admin-image-card-fields">
                <input
                  placeholder="Alt text"
                  value={img.altText ?? ""}
                  onChange={(e) => updateImage(idx, { altText: e.target.value })}
                />
                <select
                  value={img.imageType ?? "gallery"}
                  onChange={(e) => {
                    const imageType = e.target.value;
                    updateImage(idx, {
                      imageType,
                      is360: imageType === "360",
                    });
                  }}
                >
                  {IMAGE_TYPES.map((type) => (
                    <option key={type.value} value={type.value}>
                      {type.label}
                    </option>
                  ))}
                </select>
                <label className="admin-image-check">
                  <input
                    type="checkbox"
                    checked={Boolean(img.is360)}
                    onChange={(e) => updateImage(idx, { is360: e.target.checked })}
                  />
                  360° image
                </label>
              </div>

              <div className="admin-image-card-actions">
                <button
                  type="button"
                  onClick={() => moveImage(idx, -1)}
                  disabled={idx === 0}
                >
                  ←
                </button>
                <button
                  type="button"
                  onClick={() => setPrimary(idx)}
                  className={img.isPrimary ? "active" : ""}
                >
                  <Star size={14} />
                </button>
                <button
                  type="button"
                  onClick={() => moveImage(idx, 1)}
                  disabled={idx === images.length - 1}
                >
                  →
                </button>
                <button
                  type="button"
                  className="danger"
                  onClick={() => removeImage(idx)}
                >
                  <Trash2 size={14} />
                </button>
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}
