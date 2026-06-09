import Link from "next/link";
import { popularCategories } from "@/lib/constants/home";
import { categoryPageHref, popularCategoryHrefs } from "@/lib/routes/category";

export function PopularCategories() {
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
          {popularCategories.map((cat) => (
            <li key={cat.name} className="popular-categories-grid__item">
              <Link
                href={popularCategoryHrefs[cat.name] ?? categoryPageHref(cat.name)}
                className="popular-cat-link"
              >
                <div className="popular-cat-thumb">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={cat.image}
                    alt={cat.name}
                    width={190}
                    height={190}
                    loading="lazy"
                  />
                </div>
                <h5 className="popular-cat-label">{cat.name}</h5>
              </Link>
            </li>
          ))}
        </ul>

        <div className="popular-categories-explore">
          <Link href="#">Explore Complete Catalogue</Link>
        </div>
      </div>
    </section>
  );
}
