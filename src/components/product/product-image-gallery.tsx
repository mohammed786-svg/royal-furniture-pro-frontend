"use client";

import { useCallback, useRef, useState } from "react";
import { ChevronLeft, ChevronRight, Share2 } from "lucide-react";
import { ProductWishlistButton } from "@/components/shop/product-wishlist-button";
import { MediaImage } from "@/components/ui/media-image";
import type { ProductItem } from "@/lib/constants/home-data";
import type { ProductDetail } from "@/lib/constants/product-details";

type ProductImageGalleryProps = {
  images: string[];
  alt: string;
  product?: ProductItem | ProductDetail;
  discount?: string;
  isNewArrival?: boolean;
  isOnlineExclusive?: boolean;
};

const LENS_SIZE = 140;
const ZOOM_SCALE = 2.4;

export function ProductImageGallery({
  images,
  alt,
  product,
  discount,
  isNewArrival,
  isOnlineExclusive,
}: ProductImageGalleryProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [zooming, setZooming] = useState(false);
  const [mainImageLoaded, setMainImageLoaded] = useState(true);
  const [lensPos, setLensPos] = useState({ x: 0, y: 0 });
  const [bgPos, setBgPos] = useState({ x: 50, y: 50 });
  const stageRef = useRef<HTMLDivElement>(null);

  const activeImage = images[activeIndex] ?? images[0];

  const selectImage = (index: number) => {
    setActiveIndex(index);
    setZooming(false);
    setMainImageLoaded(true);
  };

  const goPrev = (e: React.MouseEvent) => {
    e.stopPropagation();
    setActiveIndex((i) => (i === 0 ? images.length - 1 : i - 1));
    setZooming(false);
    setMainImageLoaded(true);
  };

  const goNext = (e: React.MouseEvent) => {
    e.stopPropagation();
    setActiveIndex((i) => (i === images.length - 1 ? 0 : i + 1));
    setZooming(false);
    setMainImageLoaded(true);
  };

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    const stage = stageRef.current;
    if (!stage) return;

    const rect = stage.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const maxX = rect.width - LENS_SIZE;
    const maxY = rect.height - LENS_SIZE;

    const lensX = Math.max(0, Math.min(x - LENS_SIZE / 2, maxX));
    const lensY = Math.max(0, Math.min(y - LENS_SIZE / 2, maxY));

    const percentX = ((lensX + LENS_SIZE / 2) / rect.width) * 100;
    const percentY = ((lensY + LENS_SIZE / 2) / rect.height) * 100;

    setLensPos({ x: lensX, y: lensY });
    setBgPos({ x: percentX, y: percentY });
  }, []);

  return (
    <div className="product-gallery">
      <ul className="product-gallery__thumbs" aria-label="Product thumbnails">
        {images.map((src, index) => (
          <li key={`${src}-${index}`}>
            <button
              type="button"
              className={`product-gallery__thumb${index === activeIndex ? " product-gallery__thumb--active" : ""}`}
              onClick={() => selectImage(index)}
              aria-label={`View image ${index + 1}`}
              aria-current={index === activeIndex}
            >
              <MediaImage
                src={src}
                alt=""
                fill
                fit="cover"
                placeholderSize="sm"
                resolveUrl
              />
            </button>
          </li>
        ))}
      </ul>

      <div className="product-gallery__stage-wrap">
        <div
          ref={stageRef}
          className="product-gallery__stage"
          onMouseEnter={() => setZooming(true)}
          onMouseLeave={() => setZooming(false)}
          onMouseMove={handleMouseMove}
        >
          <MediaImage
            key={activeImage}
            src={activeImage}
            alt={alt}
            fill
            fit="cover"
            loading="eager"
            placeholderSize="lg"
            resolveUrl
            imgClassName="product-gallery__main-image"
            onStatusChange={(status) => setMainImageLoaded(status === "loaded")}
          />

          {discount && <span className="product-gallery__discount">{discount}</span>}

          <div className="product-gallery__top-actions">
            {product && (
              <ProductWishlistButton
                product={product}
                className="product-gallery__icon-btn"
              />
            )}
            <button
              type="button"
              aria-label="Share product"
              className="product-gallery__icon-btn"
            >
              <Share2 className="h-4 w-4 text-[#555]" strokeWidth={2} />
            </button>
          </div>

          {(isNewArrival || isOnlineExclusive) && (
            <div className="product-gallery__badges">
              {isNewArrival && (
                <span className="product-gallery__badge product-gallery__badge--new">
                  New Arrival
                </span>
              )}
              {isOnlineExclusive && (
                <span className="product-gallery__badge product-gallery__badge--exclusive">
                  Online Exclusive
                </span>
              )}
            </div>
          )}

          {zooming && mainImageLoaded && (
            <span
              className="product-gallery__lens"
              style={{
                width: LENS_SIZE,
                height: LENS_SIZE,
                transform: `translate(${lensPos.x}px, ${lensPos.y}px)`,
              }}
              aria-hidden
            />
          )}

          <button
            type="button"
            className="product-gallery__nav product-gallery__nav--prev"
            aria-label="Previous image"
            onClick={goPrev}
          >
            <ChevronLeft className="h-5 w-5" strokeWidth={2} />
          </button>
          <button
            type="button"
            className="product-gallery__nav product-gallery__nav--next"
            aria-label="Next image"
            onClick={goNext}
          >
            <ChevronRight className="h-5 w-5" strokeWidth={2} />
          </button>
        </div>

        {zooming && mainImageLoaded && activeImage && (
          <div
            className="product-gallery__zoom-panel"
            style={{
              backgroundImage: `url(${activeImage})`,
              backgroundSize: `${ZOOM_SCALE * 100}%`,
              backgroundPosition: `${bgPos.x}% ${bgPos.y}%`,
            }}
            aria-hidden
          />
        )}
      </div>
    </div>
  );
}
