import type { Metadata } from "next";
import Link from "next/link";
import { JsonLd } from "@/components/seo/json-ld";
import { breadcrumbSchema } from "@/config/seo/structured-data.config";
import { getAllBlogPosts } from "@/lib/seo/blog-posts";

export const metadata: Metadata = {
  title: "Furniture Blog — Buying Guides & Belagavi Store Tips",
  description:
    "Royal Furniture Pro blog: best furniture store near me, furniture near me Belagavi, sofa & bedroom guides, and how to buy furniture online in India.",
  keywords: [
    "furniture blog",
    "furniture near me",
    "best furniture store near me",
    "Belagavi furniture",
    "Royal Furniture Pro blog",
  ],
  alternates: { canonical: "/blog" },
  openGraph: {
    title: "Royal Furniture Pro Blog | Furniture Near Me Guides",
    description:
      "Local Belagavi furniture guides, sofa tips, and online shopping advice from Royal Furniture Pro.",
    url: "/blog",
    type: "website",
  },
};

export default function BlogIndexPage() {
  const posts = getAllBlogPosts();

  return (
    <main className="blog-page">
      <JsonLd
        data={breadcrumbSchema([
          { name: "Home", path: "/" },
          { name: "Blog", path: "/blog" },
        ])}
      />
      <header className="blog-page__hero">
        <div className="royal-section-inner">
          <p className="blog-page__eyebrow">Royal Furniture Pro · Insights</p>
          <h1 className="blog-page__title">
            Furniture guides for Belagavi &amp; online shoppers
          </h1>
          <p className="blog-page__subtitle">
            Rank-worthy answers for “furniture near me,” sofa stores, bedroom sets, and
            shopping at Royal Furniture Pro — written for Google and for real buyers.
          </p>
        </div>
      </header>

      <div className="royal-section-inner blog-page__list">
        {posts.map((post) => (
          <article key={post.slug} className="blog-card">
            <p className="blog-card__meta">
              <span>{post.category}</span>
              <span aria-hidden>·</span>
              <time dateTime={post.publishedAt}>{post.publishedAt}</time>
              <span aria-hidden>·</span>
              <span>{post.readingMinutes} min read</span>
            </p>
            <h2 className="blog-card__title">
              <Link href={`/blog/${post.slug}`}>{post.title}</Link>
            </h2>
            <p className="blog-card__excerpt">{post.description}</p>
            <Link href={`/blog/${post.slug}`} className="blog-card__link">
              Read article →
            </Link>
          </article>
        ))}
      </div>
    </main>
  );
}
