// mapExport.js
// Goal: share the exact same raster export pipeline between DownloadOptionsModal + ShareOptionsModal.

// ✅ You will move/copy these from DownloadOptionsModal:
// - exportFromSvg (the function that returns { blob, url, fmt })
// - any helpers it depends on (loadImage, canvasToBlob, viewBoxFromInsets, etc.)
// - it should accept the same "params" you already use: crop, legendOn, legendPos, legendSize, etc.

export async function exportMapRaster({
  format = "png",              // "png" | "jpg"
  params = {},                 // { legendOn, crop, legendPos, legendWidthPx, legendSize, ... }
  renderStageEl,               // a DOM node containing the MapView svg (same as your renderStageRef.current)
}) {
  if (!renderStageEl) throw new Error("renderStageEl missing");

  // ✅ In your DownloadOptionsModal you already query:
  // const svg = renderStageRef.current?.querySelector("svg");
  const svg = renderStageEl.querySelector("svg");
  if (!svg) throw new Error("Could not find SVG to export");

  // ------------------------------------------------------------
  // 🔥 IMPORTANT:
  // Replace this call with YOUR existing exportFromSvg code moved here.
  // That code already handles:
  // - crop -> viewBox
  // - drawing to canvas
  // - legend overlay (if enabled)
  // - watermark / pro toggles
  // - output blob + blob url
  //
  // You want it to return:
  // { blob, url, fmt: "png"|"jpg" }
  // ------------------------------------------------------------

  // Placeholder:
  throw new Error(
    "exportMapRaster() not wired: move exportFromSvg + helpers from DownloadOptionsModal into mapExport.js"
  );
}
