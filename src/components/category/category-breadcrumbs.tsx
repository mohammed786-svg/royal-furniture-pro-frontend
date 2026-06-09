import Link from "next/link";

type CategoryBreadcrumbsProps = {
  items: { label: string; href?: string }[];
};

export function CategoryBreadcrumbs({ items }: CategoryBreadcrumbsProps) {
  return (
    <nav className="category-breadcrumbs" aria-label="Breadcrumb">
      <ol className="category-breadcrumbs__list">
        {items.map((item, index) => {
          const isLast = index === items.length - 1;
          const isCurrent = isLast || !item.href;
          return (
            <li key={`${item.label}-${index}`} className="category-breadcrumbs__item">
              {index > 0 && (
                <span className="category-breadcrumbs__sep" aria-hidden>
                  /
                </span>
              )}
              {isCurrent ? (
                <span className="category-breadcrumbs__current">{item.label}</span>
              ) : (
                <Link href={item.href!} className="category-breadcrumbs__link">
                  {item.label}
                </Link>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
