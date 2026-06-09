"use client";

import { useState } from "react";
import type { ProductDetail } from "@/lib/constants/product-details";

const TABS = [
  { id: "description", label: "Description" },
  { id: "features", label: "Product Features" },
  { id: "more", label: "More Information" },
  { id: "reviews", label: "Ratings & Reviews" },
] as const;

type TabId = (typeof TABS)[number]["id"];

type ProductDetailTabsProps = {
  product: ProductDetail;
};

export function ProductDetailTabs({ product }: ProductDetailTabsProps) {
  const [active, setActive] = useState<TabId>("description");

  return (
    <section className="product-detail-tabs">
      <div className="product-detail-tabs__nav" role="tablist">
        {TABS.map((tab) => (
          <button
            key={tab.id}
            type="button"
            role="tab"
            aria-selected={active === tab.id}
            className={`product-detail-tabs__tab${active === tab.id ? " product-detail-tabs__tab--active" : ""}`}
            onClick={() => setActive(tab.id)}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div className="product-detail-tabs__panel" role="tabpanel">
        {active === "description" && (
          <p className="product-detail-tabs__text">{product.description}</p>
        )}

        {active === "features" && (
          <ul className="product-detail-tabs__list">
            {product.features.map((feature) => (
              <li key={feature}>{feature}</li>
            ))}
          </ul>
        )}

        {active === "more" && (
          <table className="product-detail-tabs__table">
            <tbody>
              {product.moreInfo.map((row) => (
                <tr key={row.label}>
                  <th>{row.label}</th>
                  <td>{row.value}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}

        {active === "reviews" && (
          <div className="product-detail-tabs__reviews">
            <p className="product-detail-tabs__text">
              <strong>Write Your Own Review</strong>
            </p>
            <p className="product-detail-tabs__text product-detail-tabs__text--muted">
              Only registered users can write reviews. Please sign in or create an
              account.
            </p>
            <p className="product-detail-tabs__text">Shop Reviews 0</p>
          </div>
        )}
      </div>
    </section>
  );
}
