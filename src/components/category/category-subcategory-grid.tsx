import Link from "next/link";
import { MediaImage } from "@/components/ui/media-image";
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
              <MediaImage
                src={item.image}
                alt={item.label}
                fill
                fit="cover"
                resolveUrl={false}
              />
            </div>
            <span className="category-subcategory-label">{item.label}</span>
          </Link>
        </li>
      ))}
    </ul>
  );
}
