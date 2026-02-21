/**
 * Shared viewBox/insets math for download crop.
 * Crop is stored as percentage insets from each edge (0–100).
 */

export const VBW = 2000;
export const VBH = 857;

function clamp(x, a, b) {
  return Math.max(a, Math.min(b, x));
}

function clamp01(x) {
  return clamp(x, 0, 1);
}

/** Convert percentage insets { top, right, bottom, left } to viewBox { x, y, w, h }. */
export function viewBoxFromInsets(insets) {
  const l = clamp01((insets?.left ?? 0) / 100);
  const r = clamp01((insets?.right ?? 0) / 100);
  const t = clamp01((insets?.top ?? 0) / 100);
  const b = clamp01((insets?.bottom ?? 0) / 100);

  let x = VBW * l;
  let y = VBH * t;
  let w = VBW * (1 - l - r);
  let h = VBH * (1 - t - b);

  const MIN = 1;
  if (w < MIN) w = MIN;
  if (h < MIN) h = MIN;

  x = clamp(x, 0, VBW - w);
  y = clamp(y, 0, VBH - h);

  return { x, y, w, h };
}

/** Convert viewBox { x, y, w, h } to percentage insets { top, right, bottom, left }. */
export function insetsFromViewBox(vb) {
  const left = (vb.x / VBW) * 100;
  const top = (vb.y / VBH) * 100;
  const right = ((VBW - (vb.x + vb.w)) / VBW) * 100;
  const bottom = ((VBH - (vb.y + vb.h)) / VBH) * 100;

  const round = (n) => Math.round(n * 10) / 10;

  return {
    left: round(clamp(left, 0, 100)),
    top: round(clamp(top, 0, 100)),
    right: round(clamp(right, 0, 100)),
    bottom: round(clamp(bottom, 0, 100)),
  };
}
