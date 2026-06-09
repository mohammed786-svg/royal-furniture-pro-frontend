"use client";

import { useEffect, useMemo, useState, type ReactNode } from "react";
import {
  CheckCircle2,
  Circle,
  DollarSign,
  ImageIcon,
  Layers,
  ListChecks,
  Package,
  Plus,
  Search,
  Sparkles,
  Tag,
  Trash2,
} from "lucide-react";
import { ProductFormField } from "@/components/admin/catalog/product-form-field";
import { ProductImagesPanel } from "@/components/admin/catalog/product-images-panel";
import {
  getSectionCompletion,
  validateProductForm,
  type ProductFieldErrors,
  type ProductFormSection,
} from "@/lib/catalog/product-validation";
import type {
  CatalogOption,
  SubCategoryOption,
  UnderSubCategoryOption,
} from "@/types/catalog";
import type {
  BrandOption,
  ProductFeature,
  ProductFormValues,
  ProductSpecification,
  ProductVariant,
} from "@/types/product";

export const emptyProductForm: ProductFormValues = {
  name: "",
  slug: "",
  sku: "",
  categoryId: "",
  subCategoryId: "",
  underSubCategoryId: "",
  brandId: "",
  shortDescription: "",
  longDescription: "",
  material: "",
  fabric: "",
  color: "",
  dimensions: "",
  weight: 0,
  assemblyRequired: false,
  warranty: "",
  countryOfOrigin: "India",
  hsnCode: "",
  barcode: "",
  basePrice: 0,
  salePrice: 0,
  mrp: 0,
  gstPercent: 18,
  isFeatured: false,
  isNewArrival: false,
  isBestSeller: false,
  isTrending: false,
  isActive: true,
  seoTitle: "",
  seoDescription: "",
  seoKeywords: "",
  images: [],
  variants: [],
  specifications: [],
  features: [],
};

const SECTIONS: {
  id: ProductFormSection;
  label: string;
  icon: ReactNode;
  description: string;
}[] = [
  {
    id: "basic",
    label: "Basic Info",
    icon: <Package size={16} />,
    description: "Name, SKU, brand & status",
  },
  {
    id: "category",
    label: "Category",
    icon: <Layers size={16} />,
    description: "Category hierarchy (FK chain)",
  },
  {
    id: "pricing",
    label: "Pricing & Tax",
    icon: <DollarSign size={16} />,
    description: "Prices, GST, HSN & barcode",
  },
  {
    id: "details",
    label: "Physical Details",
    icon: <ListChecks size={16} />,
    description: "Material, dimensions & warranty",
  },
  {
    id: "images",
    label: "Images",
    icon: <ImageIcon size={16} />,
    description: "Multiple product images",
  },
  {
    id: "variants",
    label: "Variants",
    icon: <Tag size={16} />,
    description: "Color, size & SKU variants",
  },
  {
    id: "specs",
    label: "Specifications",
    icon: <ListChecks size={16} />,
    description: "Grouped spec key-value pairs",
  },
  {
    id: "features",
    label: "Features",
    icon: <Sparkles size={16} />,
    description: "Selling points & highlights",
  },
  {
    id: "seo",
    label: "SEO",
    icon: <Search size={16} />,
    description: "Search engine metadata",
  },
];

type ProductFormProps = {
  mode: "create" | "edit";
  initial?: Partial<ProductFormValues>;
  categories: CatalogOption[];
  subCategories: SubCategoryOption[];
  underSubCategories: UnderSubCategoryOption[];
  brands: BrandOption[];
  onCancel: () => void;
  onSubmit: (values: ProductFormValues) => Promise<void>;
};

function slugify(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export function ProductForm({
  mode,
  initial,
  categories,
  subCategories,
  underSubCategories,
  brands,
  onCancel,
  onSubmit,
}: ProductFormProps) {
  const [form, setForm] = useState<ProductFormValues>(emptyProductForm);
  const [activeSection, setActiveSection] = useState<ProductFormSection>("basic");
  const [saving, setSaving] = useState(false);
  const [errors, setErrors] = useState<ProductFieldErrors>({});
  const [submitError, setSubmitError] = useState("");

  useEffect(() => {
    setForm({
      ...emptyProductForm,
      ...initial,
      images: initial?.images ?? [],
      variants: initial?.variants ?? [],
      specifications: initial?.specifications ?? [],
      features: initial?.features ?? [],
    });
    setActiveSection("basic");
    setErrors({});
    setSubmitError("");
  }, [initial]);

  const completion = useMemo(() => getSectionCompletion(form), [form]);

  const filteredSubCategories = useMemo(
    () =>
      subCategories.filter((s) => !form.categoryId || s.categoryId === form.categoryId),
    [subCategories, form.categoryId],
  );

  const filteredUnderSubCategories = useMemo(
    () =>
      underSubCategories.filter(
        (item) =>
          (!form.categoryId || item.categoryId === form.categoryId) &&
          (!form.subCategoryId || item.subCategoryId === form.subCategoryId),
      ),
    [underSubCategories, form.categoryId, form.subCategoryId],
  );

  const categoryPath = useMemo(() => {
    const parts: string[] = [];
    const cat = categories.find((c) => c.id === form.categoryId);
    if (cat) parts.push(cat.name);
    const sub = filteredSubCategories.find((s) => s.id === form.subCategoryId);
    if (sub) parts.push(sub.name);
    const under = filteredUnderSubCategories.find(
      (u) => u.id === form.underSubCategoryId,
    );
    if (under) parts.push(under.name);
    return parts;
  }, [
    categories,
    filteredSubCategories,
    filteredUnderSubCategories,
    form.categoryId,
    form.subCategoryId,
    form.underSubCategoryId,
  ]);

  function patchForm(patch: Partial<ProductFormValues>) {
    setForm((prev) => ({ ...prev, ...patch }));
  }

  function fieldError(key: string) {
    return errors[key];
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const validation = validateProductForm(form);
    setErrors(validation.errors);
    if (!validation.valid) {
      setSubmitError("Please fix the highlighted fields before saving.");
      const firstErrorSection = SECTIONS.find((section) => {
        const sectionValidation = validateProductForm(form, section.id);
        return !sectionValidation.valid;
      });
      if (firstErrorSection) setActiveSection(firstErrorSection.id);
      return;
    }

    setSaving(true);
    setSubmitError("");
    try {
      await onSubmit(form);
    } catch (err) {
      setSubmitError(err instanceof Error ? err.message : "Save failed");
    } finally {
      setSaving(false);
    }
  }

  function updateVariant(index: number, patch: Partial<ProductVariant>) {
    setForm((prev) => ({
      ...prev,
      variants: prev.variants.map((v, i) => (i === index ? { ...v, ...patch } : v)),
    }));
  }

  function updateSpec(index: number, patch: Partial<ProductSpecification>) {
    setForm((prev) => ({
      ...prev,
      specifications: prev.specifications.map((s, i) =>
        i === index ? { ...s, ...patch } : s,
      ),
    }));
  }

  function updateFeature(index: number, patch: Partial<ProductFeature>) {
    setForm((prev) => ({
      ...prev,
      features: prev.features.map((f, i) => (i === index ? { ...f, ...patch } : f)),
    }));
  }

  return (
    <div className="admin-product-form-layout">
      <nav className="admin-product-form-nav" aria-label="Product form sections">
        {SECTIONS.map((section) => {
          const done = completion[section.id];
          return (
            <button
              key={section.id}
              type="button"
              className={`admin-product-form-nav-item ${activeSection === section.id ? "active" : ""}`}
              onClick={() => setActiveSection(section.id)}
            >
              <span className="admin-product-form-nav-icon">{section.icon}</span>
              <span className="admin-product-form-nav-text">
                <strong>{section.label}</strong>
                <small>{section.description}</small>
              </span>
              <span className={`admin-product-form-nav-status ${done ? "done" : ""}`}>
                {done ? <CheckCircle2 size={16} /> : <Circle size={16} />}
              </span>
            </button>
          );
        })}
      </nav>

      <form onSubmit={handleSubmit} className="admin-product-form-main">
        {submitError && (
          <p className="admin-form-error admin-form-error-banner">{submitError}</p>
        )}

        {activeSection === "basic" && (
          <section className="admin-product-section-card">
            <header>
              <h2>Basic Information</h2>
              <p>Core product identity from producttbl — name, SKU, slug and brand.</p>
            </header>
            <div className="admin-product-section-grid">
              <ProductFormField
                label="Product Name"
                required
                error={fieldError("name")}
              >
                <input
                  value={form.name}
                  onChange={(e) => {
                    const name = e.target.value;
                    patchForm({
                      name,
                      slug: form.slug || slugify(name),
                    });
                  }}
                  placeholder="e.g. Royal Chesterfield Sofa"
                />
              </ProductFormField>
              <ProductFormField
                label="SKU"
                required
                error={fieldError("sku")}
                hint="Unique stock keeping unit"
              >
                <input
                  value={form.sku}
                  onChange={(e) => patchForm({ sku: e.target.value.toUpperCase() })}
                  placeholder="e.g. RF-SOF-001"
                />
              </ProductFormField>
              <ProductFormField
                label="Slug"
                error={fieldError("slug")}
                hint="URL-friendly identifier"
              >
                <input
                  value={form.slug}
                  onChange={(e) => patchForm({ slug: e.target.value })}
                  placeholder="auto-generated from name"
                />
              </ProductFormField>
              <ProductFormField label="Brand">
                <select
                  value={form.brandId}
                  onChange={(e) => patchForm({ brandId: e.target.value })}
                >
                  <option value="">No brand</option>
                  {brands.map((b) => (
                    <option key={b.id} value={b.id}>
                      {b.name}
                    </option>
                  ))}
                </select>
              </ProductFormField>
              <ProductFormField label="Short Description" className="span-2">
                <textarea
                  rows={2}
                  value={form.shortDescription}
                  onChange={(e) => patchForm({ shortDescription: e.target.value })}
                  placeholder="Brief summary for listings"
                />
              </ProductFormField>
              <ProductFormField label="Long Description" className="span-2">
                <textarea
                  rows={5}
                  value={form.longDescription}
                  onChange={(e) => patchForm({ longDescription: e.target.value })}
                  placeholder="Full product description"
                />
              </ProductFormField>
            </div>
            <div className="admin-form-checks admin-product-flag-grid">
              {(
                [
                  ["isActive", "Active"],
                  ["isFeatured", "Featured"],
                  ["isNewArrival", "New Arrival"],
                  ["isBestSeller", "Best Seller"],
                  ["isTrending", "Trending"],
                ] as const
              ).map(([key, label]) => (
                <label key={key}>
                  <input
                    type="checkbox"
                    checked={form[key]}
                    onChange={(e) => patchForm({ [key]: e.target.checked })}
                  />
                  {label}
                </label>
              ))}
            </div>
          </section>
        )}

        {activeSection === "category" && (
          <section className="admin-product-section-card">
            <header>
              <h2>Category Hierarchy</h2>
              <p>
                Maps to category_id → sub_category_id → under_sub_category_id foreign
                keys.
              </p>
            </header>
            {categoryPath.length > 0 && (
              <div className="admin-category-path">
                {categoryPath.map((part, i) => (
                  <span key={part}>
                    {i > 0 && <span className="sep">›</span>}
                    {part}
                  </span>
                ))}
              </div>
            )}
            <div className="admin-product-section-grid">
              <ProductFormField
                label="Category"
                required
                error={fieldError("categoryId")}
              >
                <select
                  value={form.categoryId}
                  onChange={(e) =>
                    patchForm({
                      categoryId: e.target.value,
                      subCategoryId: "",
                      underSubCategoryId: "",
                    })
                  }
                >
                  <option value="">Select category</option>
                  {categories.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </ProductFormField>
              <ProductFormField
                label="Sub Category"
                error={fieldError("subCategoryId")}
                hint="Required if under sub category is selected"
              >
                <select
                  value={form.subCategoryId}
                  disabled={!form.categoryId}
                  onChange={(e) =>
                    patchForm({
                      subCategoryId: e.target.value,
                      underSubCategoryId: "",
                    })
                  }
                >
                  <option value="">Select sub category</option>
                  {filteredSubCategories.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.name}
                    </option>
                  ))}
                </select>
              </ProductFormField>
              <ProductFormField label="Under Sub Category" className="span-2">
                <select
                  value={form.underSubCategoryId}
                  disabled={!form.subCategoryId}
                  onChange={(e) => patchForm({ underSubCategoryId: e.target.value })}
                >
                  <option value="">Select under sub category</option>
                  {filteredUnderSubCategories.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.name}
                    </option>
                  ))}
                </select>
              </ProductFormField>
            </div>
          </section>
        )}

        {activeSection === "pricing" && (
          <section className="admin-product-section-card">
            <header>
              <h2>Pricing & Tax</h2>
              <p>base_price, sale_price, mrp, gst_percent, hsn_code and barcode.</p>
            </header>
            <div className="admin-product-section-grid">
              <ProductFormField label="Base Price (₹)" error={fieldError("basePrice")}>
                <input
                  type="number"
                  min={0}
                  step="0.01"
                  value={form.basePrice}
                  onChange={(e) => patchForm({ basePrice: Number(e.target.value) })}
                />
              </ProductFormField>
              <ProductFormField label="Sale Price (₹)" error={fieldError("salePrice")}>
                <input
                  type="number"
                  min={0}
                  step="0.01"
                  value={form.salePrice}
                  onChange={(e) => patchForm({ salePrice: Number(e.target.value) })}
                />
              </ProductFormField>
              <ProductFormField label="MRP (₹)" error={fieldError("mrp")}>
                <input
                  type="number"
                  min={0}
                  step="0.01"
                  value={form.mrp}
                  onChange={(e) => patchForm({ mrp: Number(e.target.value) })}
                />
              </ProductFormField>
              <ProductFormField label="GST %" error={fieldError("gstPercent")}>
                <input
                  type="number"
                  min={0}
                  max={100}
                  step="0.01"
                  value={form.gstPercent}
                  onChange={(e) => patchForm({ gstPercent: Number(e.target.value) })}
                />
              </ProductFormField>
              <ProductFormField label="HSN Code">
                <input
                  value={form.hsnCode}
                  onChange={(e) => patchForm({ hsnCode: e.target.value })}
                  placeholder="e.g. 9403"
                />
              </ProductFormField>
              <ProductFormField label="Barcode">
                <input
                  value={form.barcode}
                  onChange={(e) => patchForm({ barcode: e.target.value })}
                  placeholder="EAN / UPC"
                />
              </ProductFormField>
            </div>
          </section>
        )}

        {activeSection === "details" && (
          <section className="admin-product-section-card">
            <header>
              <h2>Physical Details</h2>
              <p>Material, fabric, color, dimensions, weight and warranty fields.</p>
            </header>
            <div className="admin-product-section-grid">
              <ProductFormField label="Material">
                <input
                  value={form.material}
                  onChange={(e) => patchForm({ material: e.target.value })}
                />
              </ProductFormField>
              <ProductFormField label="Fabric">
                <input
                  value={form.fabric}
                  onChange={(e) => patchForm({ fabric: e.target.value })}
                />
              </ProductFormField>
              <ProductFormField label="Color">
                <input
                  value={form.color}
                  onChange={(e) => patchForm({ color: e.target.value })}
                />
              </ProductFormField>
              <ProductFormField label="Dimensions">
                <input
                  value={form.dimensions}
                  onChange={(e) => patchForm({ dimensions: e.target.value })}
                  placeholder="L x W x H (cm)"
                />
              </ProductFormField>
              <ProductFormField label="Weight (kg)" error={fieldError("weight")}>
                <input
                  type="number"
                  min={0}
                  step="0.01"
                  value={form.weight}
                  onChange={(e) => patchForm({ weight: Number(e.target.value) })}
                />
              </ProductFormField>
              <ProductFormField label="Warranty">
                <input
                  value={form.warranty}
                  onChange={(e) => patchForm({ warranty: e.target.value })}
                  placeholder="e.g. 2 years"
                />
              </ProductFormField>
              <ProductFormField label="Country of Origin">
                <input
                  value={form.countryOfOrigin}
                  onChange={(e) => patchForm({ countryOfOrigin: e.target.value })}
                />
              </ProductFormField>
              <ProductFormField label="Assembly">
                <label className="admin-inline-check">
                  <input
                    type="checkbox"
                    checked={form.assemblyRequired}
                    onChange={(e) => patchForm({ assemblyRequired: e.target.checked })}
                  />
                  Assembly required
                </label>
              </ProductFormField>
            </div>
          </section>
        )}

        {activeSection === "images" && (
          <section className="admin-product-section-card">
            <header>
              <h2>Product Images</h2>
              <p>
                product_imagestbl — multiple images with type, alt text, primary and
                360° flags.
              </p>
            </header>
            <ProductImagesPanel
              images={form.images}
              productName={form.name}
              error={fieldError("images")}
              onChange={(images) => patchForm({ images })}
            />
          </section>
        )}

        {activeSection === "variants" && (
          <section className="admin-product-section-card">
            <header>
              <h2>Product Variants</h2>
              <p>
                product_varianttbl — color, size, fabric, SKU and per-variant pricing.
              </p>
            </header>
            <button
              type="button"
              className="admin-btn admin-btn-outline admin-add-row-btn"
              onClick={() =>
                patchForm({
                  variants: [
                    ...form.variants,
                    {
                      variantName: `Variant ${form.variants.length + 1}`,
                      sku: `${form.sku || "SKU"}-V${form.variants.length + 1}`,
                      color: form.color,
                      fabric: form.fabric,
                      material: form.material,
                      price: form.basePrice,
                      salePrice: form.salePrice,
                      mrp: form.mrp,
                      weight: form.weight,
                      dimensions: form.dimensions,
                      isDefault: form.variants.length === 0,
                      isActive: true,
                    },
                  ],
                })
              }
            >
              <Plus size={14} /> Add Variant
            </button>
            {form.variants.length === 0 && (
              <p className="admin-field-hint">
                No variants added — a default variant will be created automatically on
                save.
              </p>
            )}
            <div className="admin-variant-list">
              {form.variants.map((variant, idx) => (
                <article key={idx} className="admin-variant-card">
                  <div className="admin-variant-card-head">
                    <strong>Variant {idx + 1}</strong>
                    <button
                      type="button"
                      className="admin-remove-row-btn"
                      onClick={() =>
                        patchForm({
                          variants: form.variants.filter((_, i) => i !== idx),
                        })
                      }
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                  <div className="admin-product-section-grid">
                    <ProductFormField
                      label="Variant Name"
                      error={fieldError(`variants.${idx}.variantName`)}
                    >
                      <input
                        value={variant.variantName}
                        onChange={(e) =>
                          updateVariant(idx, { variantName: e.target.value })
                        }
                      />
                    </ProductFormField>
                    <ProductFormField
                      label="SKU"
                      error={fieldError(`variants.${idx}.sku`)}
                    >
                      <input
                        value={variant.sku}
                        onChange={(e) =>
                          updateVariant(idx, { sku: e.target.value.toUpperCase() })
                        }
                      />
                    </ProductFormField>
                    <ProductFormField label="Color">
                      <input
                        value={variant.color ?? ""}
                        onChange={(e) => updateVariant(idx, { color: e.target.value })}
                      />
                    </ProductFormField>
                    <ProductFormField label="Size">
                      <input
                        value={variant.size ?? ""}
                        onChange={(e) => updateVariant(idx, { size: e.target.value })}
                      />
                    </ProductFormField>
                    <ProductFormField label="Fabric">
                      <input
                        value={variant.fabric ?? ""}
                        onChange={(e) => updateVariant(idx, { fabric: e.target.value })}
                      />
                    </ProductFormField>
                    <ProductFormField label="Material">
                      <input
                        value={variant.material ?? ""}
                        onChange={(e) =>
                          updateVariant(idx, { material: e.target.value })
                        }
                      />
                    </ProductFormField>
                    <ProductFormField
                      label="Price"
                      error={fieldError(`variants.${idx}.price`)}
                    >
                      <input
                        type="number"
                        min={0}
                        value={variant.price}
                        onChange={(e) =>
                          updateVariant(idx, { price: Number(e.target.value) })
                        }
                      />
                    </ProductFormField>
                    <ProductFormField
                      label="Sale Price"
                      error={fieldError(`variants.${idx}.salePrice`)}
                    >
                      <input
                        type="number"
                        min={0}
                        value={variant.salePrice}
                        onChange={(e) =>
                          updateVariant(idx, { salePrice: Number(e.target.value) })
                        }
                      />
                    </ProductFormField>
                    <ProductFormField
                      label="MRP"
                      error={fieldError(`variants.${idx}.mrp`)}
                    >
                      <input
                        type="number"
                        min={0}
                        value={variant.mrp}
                        onChange={(e) =>
                          updateVariant(idx, { mrp: Number(e.target.value) })
                        }
                      />
                    </ProductFormField>
                    <ProductFormField label="Barcode">
                      <input
                        value={variant.barcode ?? ""}
                        onChange={(e) =>
                          updateVariant(idx, { barcode: e.target.value })
                        }
                      />
                    </ProductFormField>
                  </div>
                  <div className="admin-form-checks">
                    <label>
                      <input
                        type="checkbox"
                        checked={variant.isDefault}
                        onChange={(e) =>
                          patchForm({
                            variants: form.variants.map((v, i) => ({
                              ...v,
                              isDefault: i === idx ? e.target.checked : false,
                            })),
                          })
                        }
                      />
                      Default variant
                    </label>
                    <label>
                      <input
                        type="checkbox"
                        checked={variant.isActive ?? true}
                        onChange={(e) =>
                          updateVariant(idx, { isActive: e.target.checked })
                        }
                      />
                      Active
                    </label>
                  </div>
                </article>
              ))}
            </div>
          </section>
        )}

        {activeSection === "specs" && (
          <section className="admin-product-section-card">
            <header>
              <h2>Specifications</h2>
              <p>product_specificationtbl — grouped key-value specification rows.</p>
            </header>
            <button
              type="button"
              className="admin-btn admin-btn-outline admin-add-row-btn"
              onClick={() =>
                patchForm({
                  specifications: [
                    ...form.specifications,
                    {
                      specGroup: "General",
                      specKey: "",
                      specValue: "",
                      displayOrder: form.specifications.length,
                    },
                  ],
                })
              }
            >
              <Plus size={14} /> Add Specification
            </button>
            <div className="admin-repeat-list">
              {form.specifications.map((spec, idx) => (
                <div key={idx} className="admin-repeat-row admin-spec-row">
                  <ProductFormField label="Group">
                    <input
                      value={spec.specGroup}
                      onChange={(e) => updateSpec(idx, { specGroup: e.target.value })}
                      placeholder="e.g. Dimensions"
                    />
                  </ProductFormField>
                  <ProductFormField
                    label="Key"
                    error={fieldError(`specifications.${idx}.specKey`)}
                  >
                    <input
                      value={spec.specKey}
                      onChange={(e) => updateSpec(idx, { specKey: e.target.value })}
                      placeholder="e.g. Width"
                    />
                  </ProductFormField>
                  <ProductFormField label="Value">
                    <input
                      value={spec.specValue}
                      onChange={(e) => updateSpec(idx, { specValue: e.target.value })}
                      placeholder="e.g. 220 cm"
                    />
                  </ProductFormField>
                  <button
                    type="button"
                    className="admin-remove-row-btn"
                    onClick={() =>
                      patchForm({
                        specifications: form.specifications.filter((_, i) => i !== idx),
                      })
                    }
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              ))}
            </div>
          </section>
        )}

        {activeSection === "features" && (
          <section className="admin-product-section-card">
            <header>
              <h2>Product Features</h2>
              <p>
                product_featuretbl — highlight titles, descriptions and optional icons.
              </p>
            </header>
            <button
              type="button"
              className="admin-btn admin-btn-outline admin-add-row-btn"
              onClick={() =>
                patchForm({
                  features: [
                    ...form.features,
                    {
                      featureTitle: "",
                      featureDescription: "",
                      displayOrder: form.features.length,
                    },
                  ],
                })
              }
            >
              <Plus size={14} /> Add Feature
            </button>
            <div className="admin-repeat-list">
              {form.features.map((feature, idx) => (
                <div key={idx} className="admin-repeat-row admin-feature-row">
                  <ProductFormField
                    label="Title"
                    error={fieldError(`features.${idx}.featureTitle`)}
                  >
                    <input
                      value={feature.featureTitle}
                      onChange={(e) =>
                        updateFeature(idx, { featureTitle: e.target.value })
                      }
                      placeholder="e.g. Premium cushioning"
                    />
                  </ProductFormField>
                  <ProductFormField label="Description">
                    <input
                      value={feature.featureDescription ?? ""}
                      onChange={(e) =>
                        updateFeature(idx, { featureDescription: e.target.value })
                      }
                      placeholder="Short feature description"
                    />
                  </ProductFormField>
                  <button
                    type="button"
                    className="admin-remove-row-btn"
                    onClick={() =>
                      patchForm({ features: form.features.filter((_, i) => i !== idx) })
                    }
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              ))}
            </div>
          </section>
        )}

        {activeSection === "seo" && (
          <section className="admin-product-section-card">
            <header>
              <h2>SEO Metadata</h2>
              <p>seo_title, seo_description and seo_keywords for search visibility.</p>
            </header>
            <div className="admin-product-section-grid single-col">
              <ProductFormField
                label="SEO Title"
                error={fieldError("seoTitle")}
                hint={`${form.seoTitle.length}/70 characters`}
              >
                <input
                  value={form.seoTitle}
                  onChange={(e) => patchForm({ seoTitle: e.target.value })}
                  placeholder={form.name || "Product title for search engines"}
                />
              </ProductFormField>
              <ProductFormField label="SEO Keywords">
                <input
                  value={form.seoKeywords}
                  onChange={(e) => patchForm({ seoKeywords: e.target.value })}
                  placeholder="sofa, living room, leather"
                />
              </ProductFormField>
              <ProductFormField
                label="SEO Description"
                error={fieldError("seoDescription")}
                hint={`${form.seoDescription.length}/160 characters`}
              >
                <textarea
                  rows={4}
                  value={form.seoDescription}
                  onChange={(e) => patchForm({ seoDescription: e.target.value })}
                  placeholder="Meta description for search results"
                />
              </ProductFormField>
            </div>
          </section>
        )}

        <div className="admin-product-form-footer">
          <div className="admin-product-form-footer-hint">
            Section {SECTIONS.findIndex((s) => s.id === activeSection) + 1} of{" "}
            {SECTIONS.length}
          </div>
          <div className="admin-product-form-footer-actions">
            <button
              type="button"
              className="admin-btn admin-btn-outline"
              onClick={onCancel}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="admin-btn admin-btn-primary"
              disabled={saving}
            >
              {saving
                ? "Saving..."
                : mode === "edit"
                  ? "Update Product"
                  : "Create Product"}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
