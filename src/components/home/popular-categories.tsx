"use client";

import Link from "next/link";
import { MediaImage } from "@/components/ui/media-image";
import { resolvePopularCategoryHref } from "@/lib/routes/category";
import { useHomepage } from "@/providers/homepage-provider";

export function PopularCategories() {
  const { data } = useHomepage();

  return (
    <section
      className="popular-categories-section"
      aria-labelledby="popular-categories-heading"
    >
      <div className="popular-categories-inner royal-section-inner">
        <h2 id="popular-categories-heading" className="popular-categories-title">
          Popular Categories
        </h2>

        <ul className="popular-categories-grid">
          {data.popularCategories.map((cat) => (
            <li key={cat.id} className="popular-categories-grid__item">
              <Link href={resolvePopularCategoryHref(cat)} className="popular-cat-link">
                <div className="popular-cat-thumb">
                  <MediaImage
                    src={cat.imageUrl}
                    alt={cat.name}
                    fill
                    rounded="full"
                    fit="cover"
                    placeholderSize="md"
                    showLabel={false}
                  />
                </div>
                <h5 className="popular-cat-label">{cat.name}</h5>
              </Link>
            </li>
          ))}
        </ul>

        <div className="popular-categories-explore">
          <Link href="/living">Explore Complete Catalogue</Link>
        </div>
      </div>
    </section>
  );
}
