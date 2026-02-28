// ShareOptionsModal.js
import React, { useEffect, useMemo, useState } from "react";
import { createPortal } from "react-dom";
import { BiCopy, BiLinkExternal, BiLink, BiKey, BiSun, BiMoon } from "react-icons/bi";
import { FaXTwitter, FaFacebookF, FaLinkedinIn } from "react-icons/fa6";
import UpgradeProModal from "./UpgradeProModal";
import Map from "./Map";
import { normalizeMapForPreview } from "../utils/mapPreviewUtils";
import { generateEmbedToken } from "../api";
import styles from "./ShareOptionsModal.module.css";

function safeOpen(url) {
  window.open(url, "_blank", "noopener,noreferrer");
}

async function copyText(txt) {
  await navigator.clipboard.writeText(txt);
}

export default function ShareOptionsModal({
  isOpen,
  onClose,
  mapData,
  isPublic,

  // ✅ new props
  isPro,
  isOwner,
  onUpgradeToPro,
  // Optional: from mapData or parent for unbranded embed
  embedToken = null,
  onGenerateUnbrandedEmbed,
  // Optional: for Paddle checkout (logged-in user)
  passthroughUserId,
  passthroughEmail,
  onProfileRefresh,
}) {
  const [copyStatus, setCopyStatus] = useState(null); // "copied" | "error" | null
  const [copyEmbedStatus, setCopyEmbedStatus] = useState(null); // "copied" | "error" | null
  const [upgradeProModalOpen, setUpgradeProModalOpen] = useState(false);
  // Branding: show or hide Map in Color watermark. Default branded; unbranded is pro-only.
  const [embedBranding, setEmbedBranding] = useState("branded"); // "branded" | "unbranded"
  const [generatedToken, setGeneratedToken] = useState(null);
  const [generatingToken, setGeneratingToken] = useState(false);
  const [generateTokenError, setGenerateTokenError] = useState(null);

  // Embed display options (theme, legend, interactive)
  const [embedTheme, setEmbedTheme] = useState("light"); // "light" | "dark"
  const [embedLegend, setEmbedLegend] = useState(true);
  const [embedInteractive, setEmbedInteractive] = useState(true);

  const title = mapData?.title || "Untitled Map";
  const pageUrl = typeof window !== "undefined" ? window.location.href : "";

  const shareText = useMemo(() => `${title} — made on Map in Color`, [title]);

  // Token from parent (prop) or generated. Required when map is private OR branding is unbranded.
  const effectiveToken = embedToken ?? generatedToken;
  const needsToken = !isPublic || embedBranding === "unbranded";
  const hasToken = !!effectiveToken;
  const canShowEmbedContent = !needsToken || hasToken;

  // Single embed URL: token when needed, branding from embedBranding
  const currentEmbedUrl = useMemo(() => {
    if (!pageUrl || !mapData?.id) return "";
    if (needsToken && !effectiveToken) return "";
    try {
      const u = new URL(pageUrl);
      const base = `${u.origin}/embed/${mapData.id}`;
      const params = new URLSearchParams();
      if (effectiveToken) params.set("token", effectiveToken);
      params.set("theme", embedTheme);
      params.set("branding", embedBranding === "branded" ? "1" : "0");
      params.set("legend", embedLegend ? "1" : "0");
      params.set("interactive", embedInteractive ? "1" : "0");
      return `${base}?${params.toString()}`;
    } catch {
      return "";
    }
  }, [pageUrl, mapData?.id, needsToken, effectiveToken, embedTheme, embedBranding, embedLegend, embedInteractive]);

  const currentIframeCode = useMemo(() => {
    if (!currentEmbedUrl) return "";
    return `<iframe src="${currentEmbedUrl}" width="900" height="520"></iframe>`;
  }, [currentEmbedUrl]);

  // Fake preview: same map props as MapEmbed (no theme-based color overrides so no-data grey matches embed)
  const normalizedMap = useMemo(() => normalizeMapForPreview(mapData), [mapData]);
  const previewMapProps = useMemo(() => (normalizedMap ? { ...normalizedMap } : null), [normalizedMap]);

  function renderEmbedPreview(openUrl) {
    return (
      <>
        <div className={styles.embedPreviewMapStage}>
          {previewMapProps ? (
            <div className={styles.embedPreviewMapCenter}>
              <Map
              groups={previewMapProps.groups}
              data={previewMapProps.data}
              selected_map={previewMapProps.selectedMap}
              mapDataType={previewMapProps.mapDataType}
              custom_ranges={previewMapProps.customRanges}
              mapTitleValue={previewMapProps.title}
              ocean_color={previewMapProps.ocean_color}
              unassigned_color={previewMapProps.unassigned_color}
              font_color={previewMapProps.font_color}
              is_title_hidden={previewMapProps.is_title_hidden}
              showNoDataLegend={false}
              titleFontSize={previewMapProps.titleFontSize}
              legendFontSize={previewMapProps.legendFontSize}
              strokeMode="thin"
              theme={embedTheme}
              />
            </div>
          ) : (
            <span className={styles.embedPreviewPlaceholder}>Preview</span>
          )}
        </div>
        {embedLegend && previewMapProps && (
          <div className={styles.embedPreviewLegend} aria-hidden="true">
            <div className={styles.embedPreviewLegendTitle}>{previewMapProps.title || "Legend"}</div>
          </div>
        )}
        {embedBranding === "branded" && previewMapProps && (
          <div className={styles.embedPreviewWatermark} aria-hidden="true">
            <div className={styles.embedPreviewWatermarkText}>Made with</div>
            <img
              className={styles.embedPreviewWatermarkLogo}
              src="/assets/3-0/mic-logo-2-5-text-cropped.png"
              alt=""
              draggable={false}
            />
          </div>
        )}
        <span className={styles.embedPreviewOverlay}>Click to open</span>
      </>
    );
  }

  // Reset on open. Branding: unbranded only for Pro + owner; non-owners must use branded.
  useEffect(() => {
    if (!isOpen) return;
    setCopyStatus(null);
    setCopyEmbedStatus(null);
    setGenerateTokenError(null);
    setEmbedBranding(isOwner && isPro ? "unbranded" : "branded");
    setEmbedTheme("light");
    setEmbedLegend(true);
    setEmbedInteractive(true);
  }, [isOpen, isPro, isOwner]);

  // ESC close
  useEffect(() => {
    if (!isOpen) return;
    const onKeyDown = (e) => {
      if (e.key === "Escape") onClose?.();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [isOpen, onClose]);

  async function handleCopyLink() {
    try {
      await copyText(pageUrl);
      setCopyStatus("copied");
      setTimeout(() => setCopyStatus(null), 1600);
    } catch (e) {
      console.error(e);
      setCopyStatus("error");
      setTimeout(() => setCopyStatus(null), 2000);
    }
  }

  async function handleCopyEmbed(code) {
    const toCopy = code ?? currentIframeCode;
    try {
      await copyText(toCopy);
      setCopyEmbedStatus("copied");
      setTimeout(() => setCopyEmbedStatus(null), 1600);
    } catch (e) {
      console.error(e);
      setCopyEmbedStatus("error");
      setTimeout(() => setCopyEmbedStatus(null), 2000);
    }
  }

  async function handleGenerateEmbedToken() {
    if (generatingToken || !mapData?.id) return;
    setGeneratingToken(true);
    setGenerateTokenError(null);
    try {
      if (typeof onGenerateUnbrandedEmbed === "function") {
        const token = await Promise.resolve(onGenerateUnbrandedEmbed(mapData.id));
        if (token) setGeneratedToken(token);
      } else {
        const res = await generateEmbedToken(mapData.id, {
          allowsUnbranded: embedBranding === "unbranded",
        });
        const token = res?.data?.token;
        if (token) setGeneratedToken(token);
      }
    } catch (err) {
      const msg = err?.response?.data?.msg || err?.message || "Could not generate link";
      setGenerateTokenError(msg);
      if (err?.response?.status === 403) {
        setUpgradeProModalOpen(true);
      }
    } finally {
      setGeneratingToken(false);
    }
  }

  function openX() {
    const u = new URL("https://twitter.com/intent/tweet");
    u.searchParams.set("text", shareText);
    u.searchParams.set("url", pageUrl);
    safeOpen(u.toString());
  }

  function openFacebook() {
    const u = new URL("https://www.facebook.com/sharer/sharer.php");
    u.searchParams.set("u", pageUrl);
    safeOpen(u.toString());
  }

  function openLinkedIn() {
    const u = new URL("https://www.linkedin.com/sharing/share-offsite/");
    u.searchParams.set("url", pageUrl);
    safeOpen(u.toString());
  }

  if (!isOpen && !upgradeProModalOpen) return null;

  const shareModalContent = (
    <div className={styles.overlay} role="dialog" aria-modal="true" onClick={() => onClose?.()}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        {/* Top bar */}
        <div className={styles.topRow}>
          <div className={styles.titleWrap}>
            <div className={styles.title}>Share</div>
            <div className={styles.sub}>
              {title}
              <span className={styles.dot}>•</span>
              {isPublic ? "Public" : "Private"}
            </div>
          </div>

          <button type="button" className={styles.closeBtn} onClick={() => onClose?.()} aria-label="Close">
            ×
          </button>
        </div>

        {/* Body: Embed first, then Link, then small social strip */}
        <div className={styles.body}>

          {/* Embed — main focus */}
          <div className={styles.card}>
            <div className={styles.embedCardHeader}>
              <div className={styles.cardTitle}>Embed</div>
              <span className={styles.embedTypeBadge} aria-label={isPublic ? "Public map" : "Private map"}>
                {isPublic ? "Public map" : "Private map"}
              </span>
            </div>

            {/* Free user + private map: only message + Upgrade to Pro */}
            {!isPro && !isPublic && (
              <div className={styles.embedPrivateOnly}>
                <p className={styles.embedPrivateOnlyText}>
                  Public embed is not available for private maps.
                  <br />
                  Make your map public, or upgrade to Pro to embed it privately.
                </p>
                <button type="button" className={styles.embedPrivateUpgradeBtn} onClick={() => setUpgradeProModalOpen(true)}>
                  Upgrade to Pro
                </button>
              </div>
            )}

            {/* Pro + private map: generate token first, then branding + options */}
            {isPro && !isPublic && !hasToken && (
              <>
                <button type="button" className={styles.generateTokenBtn} onClick={handleGenerateEmbedToken} disabled={generatingToken}>
                  {generatingToken ? "Generating…" : "Generate private embed"}
                </button>
                {generateTokenError && <div className={styles.hintMuted}>{generateTokenError}</div>}
              </>
            )}

            {/* Single row: Theme, Branding, Legend, Interactive — when public OR pro with private + token */}
            {((isPublic) || (isPro && !isPublic && hasToken)) && (
              <>
                <div className={styles.embedControlsRow}>
                  <div className={styles.embedOptionBox}>
                    <span className={styles.embedOptionLabel}>Theme</span>
                    <div className={styles.embedRowToggle} role="group" aria-label="Embed theme">
                      <button
                        type="button"
                        className={`${styles.embedRowToggleBtn} ${embedTheme === "light" ? styles.embedRowToggleBtnActive : ""}`}
                        onClick={() => setEmbedTheme("light")}
                        aria-pressed={embedTheme === "light"}
                        aria-label="Light"
                      >
                        <BiSun className={styles.embedRowToggleIcon} aria-hidden />
                        <span>Light</span>
                      </button>
                      <button
                        type="button"
                        className={`${styles.embedRowToggleBtn} ${embedTheme === "dark" ? styles.embedRowToggleBtnActive : ""}`}
                        onClick={() => setEmbedTheme("dark")}
                        aria-pressed={embedTheme === "dark"}
                        aria-label="Dark"
                      >
                        <BiMoon className={styles.embedRowToggleIcon} aria-hidden />
                        <span>Dark</span>
                      </button>
                    </div>
                  </div>
                  <div className={styles.embedOptionBox}>
                    <span className={styles.embedOptionLabel}>Branding</span>
                    <div className={styles.embedRowToggle} role="group" aria-label="Embed branding">
                      <button
                        type="button"
                        className={`${styles.embedRowToggleBtn} ${embedBranding === "branded" ? styles.embedRowToggleBtnActive : ""}`}
                        onClick={() => setEmbedBranding("branded")}
                        aria-pressed={embedBranding === "branded"}
                        aria-label="Branded"
                      >
                        <BiLink className={styles.embedRowToggleIcon} aria-hidden />
                        <span>Branded</span>
                      </button>
                      {isPro && isOwner ? (
                        <button
                          type="button"
                          className={`${styles.embedRowToggleBtn} ${embedBranding === "unbranded" ? styles.embedRowToggleBtnActive : ""}`}
                          onClick={() => setEmbedBranding("unbranded")}
                          aria-pressed={embedBranding === "unbranded"}
                          aria-label="Unbranded"
                        >
                          <BiKey className={styles.embedRowToggleIcon} aria-hidden />
                          <span>Unbranded</span>
                          {!isPro && <img className={styles.embedRowToggleProBadge} src="/assets/3-0/PRO-label.png" alt="Pro" />}
                        </button>
                      ) : isPro && !isOwner ? (
                        <span className={styles.embedToggleBtnWrap}>
                          <button type="button" className={`${styles.embedRowToggleBtn} ${styles.embedToggleBtnDisabled}`} disabled aria-label="Unbranded (maps you own)">
                            <BiKey className={styles.embedRowToggleIcon} aria-hidden />
                            <span>Unbranded</span>
                            {!isPro && <img className={styles.embedRowToggleProBadge} src="/assets/3-0/PRO-label.png" alt="Pro" />}
                          </button>
                          <span className={styles.embedTooltip} role="tooltip">Unbranded is available for maps you own.</span>
                        </span>
                      ) : (
                        <button
                          type="button"
                          className={`${styles.embedRowToggleBtn} ${embedBranding === "unbranded" ? styles.embedRowToggleBtnActive : ""}`}
                          onClick={() => { setUpgradeProModalOpen(true); setEmbedBranding("branded"); }}
                          aria-label="Unbranded (Pro)"
                        >
                          <BiKey className={styles.embedRowToggleIcon} aria-hidden />
                          <span>Unbranded</span>
                          {!isPro && <img className={styles.embedRowToggleProBadge} src="/assets/3-0/PRO-label.png" alt="Pro" />}
                        </button>
                      )}
                    </div>
                  </div>
                  <label className={styles.embedOptionBox}>
                    <span className={styles.embedOptionLabel}>Legend</span>
                    <input type="checkbox" className={styles.embedOptionCheckSmall} checked={embedLegend} onChange={(e) => setEmbedLegend(e.target.checked)} aria-label="Show legend" />
                  </label>
                  <label className={styles.embedOptionBox}>
                    <span className={styles.embedOptionLabel}>Interactive</span>
                    <input type="checkbox" className={styles.embedOptionCheckSmall} checked={embedInteractive} onChange={(e) => setEmbedInteractive(e.target.checked)} aria-label="Interactive map" />
                  </label>
                </div>
                {isPublic && needsToken && !hasToken && isPro && isOwner && (
                  <>
                    <button type="button" className={styles.generateTokenBtn} onClick={handleGenerateEmbedToken} disabled={generatingToken}>
                      {generatingToken ? "Generating…" : "Generate embed link"}
                    </button>
                    {generateTokenError && <div className={styles.hintMuted}>{generateTokenError}</div>}
                  </>
                )}
              </>
            )}

            {canShowEmbedContent && (isPublic || isPro) && (
              <>
                <div className={styles.embedPreviewRow}>
                  <button
                    type="button"
                    className={`${styles.embedPreviewThumb} ${embedTheme === "dark" ? styles.embedPreviewThumbDark : ""}`}
                    onClick={() => currentEmbedUrl && safeOpen(currentEmbedUrl)}
                    disabled={!currentEmbedUrl}
                    title="Open preview in new tab"
                  >
                    {renderEmbedPreview(currentEmbedUrl)}
                  </button>
                  <div className={styles.embedCodeWrap}>
                    <textarea
                      className={styles.embedBox}
                      value={currentIframeCode}
                      readOnly
                      disabled
                      spellCheck={false}
                    />
                    <button
                      type="button"
                      className={styles.copyBtn}
                      onClick={() => handleCopyEmbed(currentIframeCode)}
                      disabled={!currentEmbedUrl}
                    >
                      <BiCopy />
                      Copy
                    </button>
                  </div>
                </div>
                {copyEmbedStatus === "copied" && <div className={styles.hintOk}>Copied ✓</div>}
                {copyEmbedStatus === "error" && <div className={styles.hintMuted}>Couldn’t copy. Try again.</div>}
              </>
            )}

          </div>

          {/* Link */}
          <div className={styles.card}>
            <div className={styles.cardTitle}>Link</div>
            <div className={styles.linkRow}>
              <div className={styles.linkBox} title={pageUrl}>
                {pageUrl || "—"}
              </div>
              <button type="button" className={styles.copyBtn} onClick={handleCopyLink} disabled={!pageUrl}>
                <BiCopy />
                Copy
              </button>
            </div>
            {copyStatus === "copied" && <div className={styles.hintOk}>Copied ✓</div>}
            {copyStatus === "error" && <div className={styles.hintMuted}>Couldn’t copy. Try again.</div>}
          </div>

          {/* Social — small, centered, no box */}
          <div className={styles.socialStrip}>
            <button type="button" className={styles.socialBtnSmall} onClick={openX} disabled={!pageUrl} aria-label="Share on X">
              <FaXTwitter />
            </button>
            <button type="button" className={styles.socialBtnSmall} onClick={openFacebook} disabled={!pageUrl} aria-label="Share on Facebook">
              <FaFacebookF />
            </button>
            <button type="button" className={styles.socialBtnSmall} onClick={openLinkedIn} disabled={!pageUrl} aria-label="Share on LinkedIn">
              <FaLinkedinIn />
            </button>
          </div>

        </div>
      </div>
    </div>
  );

  return (
    <>
      {isOpen && createPortal(shareModalContent, document.body)}
      {upgradeProModalOpen && createPortal(
        <UpgradeProModal
          isOpen={true}
          onClose={() => setUpgradeProModalOpen(false)}
          onUpgrade={() => {
            setUpgradeProModalOpen(false);
            onUpgradeToPro?.();
          }}
          passthroughUserId={passthroughUserId}
          passthroughEmail={passthroughEmail}
          onProfileRefresh={onProfileRefresh}
        />,
        document.body
      )}
    </>
  );
}
