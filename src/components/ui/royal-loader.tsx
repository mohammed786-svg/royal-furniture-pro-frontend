"use client";

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
          <span className="royal-loader__crown">♛</span>
          <span className="royal-loader__royal">ROYAL</span>
          <span className="royal-loader__sub">FURNITURE PRO</span>
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
