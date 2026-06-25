"use client";

import { useHomepage } from "@/providers/homepage-provider";

const DEFAULT_SEO = {
  title: "Buy Furniture Online at Royal Furniture Pro",
  content: `Getting the best furniture and decor might transform an ordinary house into the kind of place that feels distinctively yours. Royal Furniture Pro, India's premier furniture brand, is your ultimate destination to shop furniture online in India.`,
};

export function SeoContent() {
  const { data } = useHomepage();
  const seo = data.seoContent;
  const title = seo?.title || DEFAULT_SEO.title;
  const content = seo?.content || DEFAULT_SEO.content;

  return (
    <section className="bg-[#ebebeb] py-10 md:py-14">
      <div className="royal-section-inner text-base leading-relaxed text-[#444]">
        <h2 className="royal-section-title royal-section-title--playfair mb-4 text-left">
          {title}
        </h2>
        {content.split("\n\n").map((paragraph) => (
          <p key={paragraph.slice(0, 24)} className="mb-4 whitespace-pre-line">
            {paragraph}
          </p>
        ))}
      </div>
    </section>
  );
}
