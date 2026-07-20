import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { JsonLd } from "@/components/seo/json-ld";
import {
  blogPostingSchema,
  breadcrumbSchema,
  faqPageSchema,
} from "@/config/seo/structured-data.config";
import { getAllBlogSlugs, getBlogPostBySlug } from "@/lib/seo/blog-posts";

type PageProps = {
  params: Promise<{ slug: string }>;
};

export function generateStaticParams() {
  return getAllBlogSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = getBlogPostBySlug(slug);
  if (!post) return { title: "Article not found" };

  return {
    title: post.title,
    description: post.description,
    keywords: post.keywords,
    alternates: { canonical: `/blog/${post.slug}` },
    openGraph: {
      title: post.title,
      description: post.description,
      type: "article",
      publishedTime: post.publishedAt,
      modifiedTime: post.updatedAt,
      url: `/blog/${post.slug}`,
    },
  };
}

export default async function BlogArticlePage({ params }: PageProps) {
  const { slug } = await params;
  const post = getBlogPostBySlug(slug);
  if (!post) notFound();

  const schemas = [
    breadcrumbSchema([
      { name: "Home", path: "/" },
      { name: "Blog", path: "/blog" },
      { name: post.title, path: `/blog/${post.slug}` },
    ]),
    blogPostingSchema({
      title: post.title,
      description: post.description,
      slug: post.slug,
      publishedAt: post.publishedAt,
      updatedAt: post.updatedAt,
      keywords: post.keywords,
    }),
    ...(post.faqs?.length ? [faqPageSchema(post.faqs)] : []),
  ];

  return (
    <main className="blog-article">
      <JsonLd data={schemas} />
      <article className="royal-section-inner blog-article__inner">
        <nav className="blog-article__crumbs" aria-label="Breadcrumb">
          <Link href="/">Home</Link>
          <span>/</span>
          <Link href="/blog">Blog</Link>
          <span>/</span>
          <span>{post.heroLabel}</span>
        </nav>

        <header className="blog-article__header">
          <p className="blog-article__eyebrow">{post.heroLabel}</p>
          <h1 className="blog-article__title">{post.title}</h1>
          <p className="blog-article__desc">{post.description}</p>
          <p className="blog-article__meta">
            <time dateTime={post.publishedAt}>Published {post.publishedAt}</time>
            <span aria-hidden>·</span>
            <span>Updated {post.updatedAt}</span>
            <span aria-hidden>·</span>
            <span>{post.readingMinutes} min read</span>
          </p>
        </header>

        <div className="blog-article__body">
          {post.sections.map((section) => (
            <section key={section.heading ?? section.paragraphs[0]?.slice(0, 32)}>
              {section.heading ? <h2>{section.heading}</h2> : null}
              {section.paragraphs.map((p) => (
                <p key={p.slice(0, 40)}>{p}</p>
              ))}
            </section>
          ))}
        </div>

        {post.faqs && post.faqs.length > 0 ? (
          <section className="blog-article__faqs">
            <h2>FAQs</h2>
            {post.faqs.map((faq) => (
              <div key={faq.question} className="blog-article__faq">
                <h3>{faq.question}</h3>
                <p>{faq.answer}</p>
              </div>
            ))}
          </section>
        ) : null}

        <footer className="blog-article__footer">
          <Link href="/blog" className="blog-article__back">
            ← All articles
          </Link>
          <Link href="/stores" className="blog-article__cta">
            Visit Belagavi store
          </Link>
          <Link href="/contact" className="blog-article__cta blog-article__cta--ghost">
            Contact us
          </Link>
        </footer>
      </article>
    </main>
  );
}
