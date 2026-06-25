"use client";

import { useEffect, useState } from "react";
import { ImageIcon, ImageOff } from "lucide-react";
import { isValidMediaSrc, resolveMediaUrl } from "@/lib/media/resolve-url";

export type MediaImageStatus = "empty" | "loading" | "loaded" | "error";

export type MediaImagePlaceholderProps = {
  variant: "empty" | "error";
  width?: number;
  height?: number;
  fill?: boolean;
  size?: "xs" | "sm" | "md" | "lg";
  rounded?: "none" | "md" | "full";
  showLabel?: boolean;
  className?: string;
  label?: string;
};

export type MediaImageProps = {
  src?: string | null;
  alt?: string;
  width?: number;
  height?: number;
  fill?: boolean;
  className?: string;
  wrapperClassName?: string;
  imgClassName?: string;
  fit?: "cover" | "contain";
  loading?: "lazy" | "eager";
  /** Resolve relative / upload paths via API/CDN base (default true). */
  resolveUrl?: boolean;
  rounded?: "none" | "md" | "full";
  placeholderSize?: "xs" | "sm" | "md" | "lg";
  showLabel?: boolean;
  onStatusChange?: (status: MediaImageStatus) => void;
};

function cn(...parts: Array<string | false | null | undefined>) {
  return parts.filter(Boolean).join(" ");
}

export function MediaImagePlaceholder({
  variant,
  width,
  height,
  fill = false,
  size = "md",
  rounded = "none",
  showLabel = false,
  className,
  label,
}: MediaImagePlaceholderProps) {
  const Icon = variant === "error" ? ImageOff : ImageIcon;
  const defaultLabel = variant === "error" ? "Image error" : "No image";

  return (
    <span
      className={cn(
        "media-image-placeholder",
        `media-image-placeholder--${variant}`,
        `media-image-placeholder--${size}`,
        rounded !== "none" && `media-image-placeholder--rounded-${rounded}`,
        fill && "media-image-placeholder--fill",
        className,
      )}
      style={!fill && width && height ? { width, height } : undefined}
      role="img"
      aria-label={label ?? defaultLabel}
    >
      <Icon className="media-image-placeholder__icon" strokeWidth={1.75} aria-hidden />
      {showLabel ? (
        <span className="media-image-placeholder__label">{label ?? defaultLabel}</span>
      ) : null}
    </span>
  );
}

export function MediaImage({
  src,
  alt = "",
  width,
  height,
  fill = false,
  className,
  wrapperClassName,
  imgClassName,
  fit = "cover",
  loading = "lazy",
  resolveUrl = true,
  rounded = "none",
  placeholderSize,
  showLabel,
  onStatusChange,
}: MediaImageProps) {
  const resolved = resolveUrl
    ? resolveMediaUrl(src)
    : isValidMediaSrc(src)
      ? String(src).trim()
      : null;
  const hasSource = isValidMediaSrc(resolved);
  const [status, setStatus] = useState<MediaImageStatus>(
    hasSource ? "loading" : "empty",
  );

  useEffect(() => {
    setStatus(hasSource ? "loading" : "empty");
  }, [resolved, hasSource]);

  useEffect(() => {
    onStatusChange?.(status);
  }, [status, onStatusChange]);

  const placeholderProps = {
    width,
    height,
    fill,
    size: placeholderSize ?? inferPlaceholderSize(width, height, fill),
    rounded,
    showLabel: showLabel ?? shouldShowLabel(width, height, fill),
    className,
  };

  if (!hasSource) {
    return <MediaImagePlaceholder variant="empty" {...placeholderProps} />;
  }

  if (status === "error") {
    return <MediaImagePlaceholder variant="error" {...placeholderProps} />;
  }

  return (
    <span
      className={cn(
        "media-image",
        fill && "media-image--fill",
        rounded !== "none" && `media-image--rounded-${rounded}`,
        wrapperClassName,
      )}
      style={!fill && width && height ? { width, height } : undefined}
    >
      {status === "loading" ? (
        <MediaImagePlaceholder
          variant="empty"
          {...placeholderProps}
          className={cn("media-image__placeholder", className)}
        />
      ) : null}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={resolved!}
        alt={alt}
        width={fill ? undefined : width}
        height={fill ? undefined : height}
        loading={loading}
        className={cn(
          "media-image__img",
          `media-image__img--${fit}`,
          status === "loaded" && "media-image__img--visible",
          imgClassName,
        )}
        onLoad={() => setStatus("loaded")}
        onError={() => setStatus("error")}
      />
    </span>
  );
}

function inferPlaceholderSize(
  width?: number,
  height?: number,
  fill?: boolean,
): "xs" | "sm" | "md" | "lg" {
  if (fill) return "md";
  const max = Math.max(width ?? 0, height ?? 0);
  if (max <= 48) return "xs";
  if (max <= 96) return "sm";
  if (max <= 160) return "md";
  return "lg";
}

function shouldShowLabel(width?: number, height?: number, fill?: boolean): boolean {
  if (fill) return true;
  return Math.max(width ?? 0, height ?? 0) >= 96;
}
