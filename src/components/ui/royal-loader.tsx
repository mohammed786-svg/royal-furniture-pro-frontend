"use client";

import Image from "next/image";
import { siteConfig } from "@/config/seo/metadata.config";

type RoyalLoaderProps = {
  /** Full viewport overlay vs inline */
  fullScreen?: boolean;
  label?: string;
};

export function RoyalLoader({
  fullScreen = true,
  label = "Loading",
}: RoyalLoaderProps) {
  return (
    <div
      className={`royal-loader${fullScreen ? " royal-loader--fullscreen" : ""}`}
      role="status"
      aria-live="polite"
      aria-label={label}
    >
      <div className="royal-loader__backdrop" aria-hidden />
      <div className="royal-loader__card">
        <div className="royal-loader__rings" aria-hidden>
          <span className="royal-loader__ring royal-loader__ring--outer" />
          <span className="royal-loader__ring royal-loader__ring--mid" />
          <span className="royal-loader__ring royal-loader__ring--inner" />
        </div>
        <div className="royal-loader__logo">
          <Image
            src={siteConfig.logoSrc}
            alt={siteConfig.name}
            width={280}
            height={105}
            className="royal-loader__logo-img"
            priority
          />
        </div>
        <div className="royal-loader__shimmer" aria-hidden />
        <p className="royal-loader__label">{label}</p>
        <div className="royal-loader__dots" aria-hidden>
          <span />
          <span />
          <span />
        </div>
      </div>
    </div>
  );
}
