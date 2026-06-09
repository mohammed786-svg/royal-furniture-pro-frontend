import Link from "next/link";

export default function CategoryNotFound() {
  return (
    <main className="category-listing-page">
      <div className="category-listing-page__inner royal-section-inner py-12 text-center">
        <p className="mb-2 font-[family-name:var(--font-playfair)] text-4xl text-[var(--royal-gold-brand)]">
          ♛
        </p>
        <h1 className="category-listing-page__title">Category not found</h1>
        <p className="mb-2 text-sm text-[#666]">
          This category page is not available yet.
        </p>
        <p className="mb-6 text-sm text-[#888]">
          Browse our live collections or check back soon.
        </p>
        <div className="flex flex-wrap justify-center gap-3">
          <Link
            href="/"
            className="inline-block rounded-sm bg-[var(--royal-navy)] px-6 py-2.5 text-sm font-semibold text-white"
          >
            Back to Home
          </Link>
          <Link
            href="/coming-soon"
            className="inline-block rounded-sm border-2 border-[var(--royal-navy)] px-6 py-2.5 text-sm font-semibold text-[var(--royal-navy)]"
          >
            Coming soon
          </Link>
        </div>
      </div>
    </main>
  );
}
