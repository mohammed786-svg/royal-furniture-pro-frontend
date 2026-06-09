import Link from "next/link";
import type { CategorySubcategory } from "@/lib/constants/category-pages";

type CategorySubcategoryGridProps = {
  items: CategorySubcategory[];
};

export function CategorySubcategoryGrid({ items }: CategorySubcategoryGridProps) {
  return (
    <ul className="category-subcategory-grid">
      {items.map((item) => (
        <li key={item.label} className="category-subcategory-grid__item">
          <Link href={item.href} className="category-subcategory-link">
            <div className="category-subcategory-thumb">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={item.image}
                alt={item.label}
                width={96}
                height={96}
                loading="lazy"
              />
            </div>
            <span className="category-subcategory-label">{item.label}</span>
          </Link>
        </li>
      ))}
    </ul>
  );
}
