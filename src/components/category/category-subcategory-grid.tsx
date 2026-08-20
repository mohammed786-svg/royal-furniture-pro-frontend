import Link from "next/link";
import { MediaImage } from "@/components/ui/media-image";
import type { CategorySubcategory } from "@/lib/constants/category-pages";
import { isValidMediaSrc } from "@/lib/media/resolve-url";

type CategorySubcategoryGridProps = {
  items: CategorySubcategory[];
};

function getInitials(label: string): string {
  const words = label
    .trim()
    .split(/[\s+/_-]+/)
    .filter(Boolean);
  if (words.length === 0) return "?";
  if (words.length === 1) {
    return words[0].slice(0, 2).toUpperCase();
  }
  return `${words[0][0] ?? ""}${words[1][0] ?? ""}`.toUpperCase();
}

function gradientForLabel(label: string): string {
  const gradients = [
    "linear-gradient(145deg, #1a2744 0%, #3d5a80 55%, #c45c26 100%)",
    "linear-gradient(145deg, #2c1810 0%, #8b4513 50%, #d4a574 100%)",
    "linear-gradient(145deg, #1f3a2e 0%, #3d6b54 55%, #c4a35a 100%)",
    "linear-gradient(145deg, #3b1f2b 0%, #7a3e5a 50%, #d4a08a 100%)",
    "linear-gradient(145deg, #1a2a3a 0%, #2f5d7a 55%, #e8a87c 100%)",
    "linear-gradient(145deg, #2d1f14 0%, #6b4423 50%, #c9a66b 100%)",
  ];
  let hash = 0;
  for (let i = 0; i < label.length; i += 1) {
    hash = (hash * 31 + label.charCodeAt(i)) >>> 0;
  }
  return gradients[hash % gradients.length]!;
}

export function CategorySubcategoryGrid({ items }: CategorySubcategoryGridProps) {
  if (!items.length) return null;

  return (
    <ul className="category-subcategory-grid">
      {items.map((item) => {
        const hasImage = isValidMediaSrc(item.image);
        return (
          <li key={`${item.href}-${item.label}`} className="category-subcategory-grid__item">
            <Link href={item.href} className="category-subcategory-link">
              <div
                className={
                  hasImage
                    ? "category-subcategory-thumb"
                    : "category-subcategory-thumb category-subcategory-thumb--initials"
                }
                style={
                  hasImage
                    ? undefined
                    : { backgroundImage: gradientForLabel(item.label) }
                }
              >
                {hasImage ? (
                  <MediaImage
                    src={item.image}
                    alt={item.label}
                    fill
                    fit="cover"
                    resolveUrl={false}
                  />
                ) : (
                  <span className="category-subcategory-initials" aria-hidden>
                    {getInitials(item.label)}
                  </span>
                )}
              </div>
              <span className="category-subcategory-label">{item.label}</span>
            </Link>
          </li>
        );
      })}
    </ul>
  );
}
