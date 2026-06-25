"use client";

import Link from "next/link";
import { MediaImage } from "@/components/ui/media-image";
import { isValidMediaSrc } from "@/lib/media/resolve-url";
import type { HeroCarouselSlide } from "@/types/hero-banners";

type HeroBannerSlideProps = {
  slide: HeroCarouselSlide;
  priority?: boolean;
};

function BannerFrame({
  src,
  alt,
  priority,
  className,
}: {
  src: string | null;
  alt: string;
  priority?: boolean;
  className?: string;
}) {
  return (
    <div className={`hero-banner-slide__frame${className ? ` ${className}` : ""}`}>
      <MediaImage
        src={src}
        alt={alt}
        fill
        fit="cover"
        loading={priority ? "eager" : "lazy"}
        placeholderSize="lg"
        showLabel
        resolveUrl
        wrapperClassName="hero-banner-slide__media"
        className="hero-banner-slide__placeholder"
        imgClassName="hero-banner-slide__img"
      />
    </div>
  );
}

export function HeroBannerSlide({ slide, priority = false }: HeroBannerSlideProps) {
  const desktopSrc = slide.desktopImageUrl;
  const mobileSrc = slide.mobileImageUrl ?? slide.desktopImageUrl;
  const hasDesktop = isValidMediaSrc(desktopSrc);
  const hasMobile = isValidMediaSrc(mobileSrc);
  const useSplitLayout =
    hasDesktop && hasMobile && desktopSrc && mobileSrc && desktopSrc !== mobileSrc;
  const fallbackSrc = hasMobile ? mobileSrc : hasDesktop ? desktopSrc : null;

  const alt = slide.subtitle
    ? `${slide.title} — ${slide.subtitle}`
    : slide.title || "Homepage banner";

  const content = (
    <div
      className={`hero-banner-slide${slide.isEmpty ? " hero-banner-slide--empty" : ""}${!fallbackSrc ? " hero-banner-slide--no-media" : ""}`}
    >
      {useSplitLayout ? (
        <>
          <BannerFrame
            src={desktopSrc}
            alt={alt}
            priority={priority}
            className="hero-banner-slide__frame--desktop"
          />
          <BannerFrame
            src={mobileSrc}
            alt={alt}
            priority={priority}
            className="hero-banner-slide__frame--mobile"
          />
        </>
      ) : (
        <BannerFrame src={fallbackSrc} alt={alt} priority={priority} />
      )}

      {(slide.title || slide.subtitle) && (
        <div className="hero-banner-slide__caption">
          {slide.title ? (
            <p className="hero-banner-slide__title">{slide.title}</p>
          ) : null}
          {slide.subtitle ? (
            <p className="hero-banner-slide__subtitle">{slide.subtitle}</p>
          ) : null}
        </div>
      )}
    </div>
  );

  if (slide.href && slide.href !== "#" && !slide.isEmpty) {
    return (
      <Link href={slide.href} className="hero-banner-slide__link block w-full">
        {content}
      </Link>
    );
  }

  return content;
}
