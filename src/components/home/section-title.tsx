import Link from "next/link";

type SectionTitleProps = {
  title: string;
  viewAllHref?: string;
  viewAllLabel?: string;
  className?: string;
};

export function SectionTitle({
  title,
  viewAllHref,
  viewAllLabel = "View All",
  className = "",
}: SectionTitleProps) {
  return (
    <div className={`royal-section-heading--row ${className}`}>
      <h2 className="royal-section-title royal-section-title--playfair text-center sm:text-left">
        {title}
      </h2>
      {viewAllHref && (
        <Link href={viewAllHref} className="royal-section-view-all">
          {viewAllLabel}
        </Link>
      )}
    </div>
  );
}
