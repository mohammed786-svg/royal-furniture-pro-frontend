import { CategoryBreadcrumbs } from "@/components/category/category-breadcrumbs";
import { CategoryListingCard } from "@/components/category/category-listing-card";
import { CategorySortBar } from "@/components/category/category-sort-bar";
import { CategorySubcategoryGrid } from "@/components/category/category-subcategory-grid";
import type { CategoryPageData } from "@/lib/constants/category-pages";
import { categoryPageHref, primaryNavCategoryHref } from "@/lib/routes/category";

type CategoryListingPageProps = {
  data: CategoryPageData;
};

export function CategoryListingPage({ data }: CategoryListingPageProps) {
  const breadcrumbs = [
    { label: "Home", href: "/" },
    {
      label: data.department,
      href: primaryNavCategoryHref(data.department),
    },
    {
      label: data.category,
      href: categoryPageHref(data.department, data.category),
    },
  ];

  return (
    <main className="category-listing-page">
      <div className="category-listing-page__inner royal-section-inner">
        <CategoryBreadcrumbs items={breadcrumbs} />

        <h1 className="category-listing-page__title">{data.title}</h1>

        <CategorySubcategoryGrid items={data.subcategories} />

        <CategorySortBar options={data.sortOptions} />

        <ul className="category-listing-grid">
          {data.products.map((product) => (
            <li key={product.id} className="category-listing-grid__item">
              <CategoryListingCard product={product} />
            </li>
          ))}
        </ul>
      </div>
    </main>
  );
}
