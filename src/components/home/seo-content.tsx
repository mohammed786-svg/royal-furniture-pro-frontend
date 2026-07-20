"use client";

import { useHomepage } from "@/providers/homepage-provider";

const DEFAULT_SEO = {
  title: "Buy Furniture Online at Royal Furniture Pro — Belagavi & Across India",
  content: `Looking for the best furniture store near me or furniture near me in Belagavi? Royal Furniture Pro is your destination for sofas, beds, dining sets, office chairs, and décor — with a Belagavi showroom and online shopping across India.

Shop living room, bedroom, and dining furniture with clear GST pricing, delivery support, and prepaid UPI or bank transfer checkout. Visit our Azam Nagar store or browse categories online to find furniture that fits your home and budget.

Royal Furniture Pro — international-quality furniture, unbeatable prices, and local Karnataka service you can trust.`,
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
