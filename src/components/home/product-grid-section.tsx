import type { ProductItem } from "@/lib/constants/home-data";
import { ProductCard } from "./product-card";
import { SectionTitle } from "./section-title";

type ProductGridSectionProps = {
  title: string;
  products: ProductItem[];
  viewAllHref?: string;
  bgClassName?: string;
};

export function ProductGridSection({
  title,
  products,
  viewAllHref,
  bgClassName = "bg-white",
}: ProductGridSectionProps) {
  return (
    <section className={`py-8 md:py-12 ${bgClassName}`}>
      <div className="royal-section-inner">
        <SectionTitle title={title} viewAllHref={viewAllHref} />
        <div className="grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-3 lg:grid-cols-4">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </section>
  );
}
