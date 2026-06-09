import { CategoryBreadcrumbs } from "@/components/category/category-breadcrumbs";
import { ProductDetailTabs } from "@/components/product/product-detail-tabs";
import { ProductImageGallery } from "@/components/product/product-image-gallery";
import { ProductPurchasePanel } from "@/components/product/product-purchase-panel";
import { ProductTrustBar } from "@/components/product/product-trust-bar";
import {
  getProductBreadcrumbs,
  type ProductDetail,
} from "@/lib/constants/product-details";

type ProductDetailPageProps = {
  product: ProductDetail;
};

export function ProductDetailPage({ product }: ProductDetailPageProps) {
  const isNewArrival = product.badge === "New Arrival";
  const isOnlineExclusive = product.badge === "Online Exclusive";

  return (
    <main className="product-detail-page">
      <div className="product-detail-page__inner royal-section-inner">
        <CategoryBreadcrumbs items={getProductBreadcrumbs(product)} />

        <div className="product-detail-page__hero">
          <ProductImageGallery
            images={product.images}
            alt={product.name}
            product={product}
            discount={product.discount}
            isNewArrival={isNewArrival}
            isOnlineExclusive={isOnlineExclusive}
          />
          <ProductPurchasePanel product={product} />
        </div>
      </div>

      <ProductTrustBar />

      <div className="product-detail-page__tabs-wrap product-detail-page__inner royal-section-inner">
        <ProductDetailTabs product={product} />
      </div>
    </main>
  );
}
