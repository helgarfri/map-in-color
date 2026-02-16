// ShareOptionsModal.js
import React, { useEffect, useMemo, useState } from "react";
import { createPortal } from "react-dom";
import { BiCopy, BiLinkExternal } from "react-icons/bi";
import { FaXTwitter, FaFacebookF, FaLinkedinIn } from "react-icons/fa6";
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
}) {
  const [copyStatus, setCopyStatus] = useState(null); // "copied" | "error" | null
  const [copyEmbedStatus, setCopyEmbedStatus] = useState(null); // "copied" | "error" | null

  const title = mapData?.title || "Untitled Map";
  const pageUrl = typeof window !== "undefined" ? window.location.href : "";

  const shareText = useMemo(() => `${title} — made on Map in Color`, [title]);

  // ✅ Embed gating
  const canShowEmbed = !!isPro && (!!isPublic || !!isOwner);

  // ✅ Build embed URL
const embedUrl = useMemo(() => {
  if (!pageUrl || !mapData?.id) return "";
  try {
    const u = new URL(pageUrl);
    // build: https://yourdomain.com/embed/123
    return `${u.origin}/embed/${mapData.id}`;
  } catch {
    return "";
  }
}, [pageUrl, mapData?.id]);


  // ✅ iframe snippet
  const iframeCode = useMemo(() => {
    if (!embedUrl) return "";
    return `<iframe
  src="${embedUrl}"
  width="900"
  height="520"
  style="border:0;border-radius:16px;overflow:hidden"
  loading="lazy"
  referrerpolicy="no-referrer-when-downgrade"
  allowfullscreen
></iframe>`;
  }, [embedUrl]);

  // Reset on open
  useEffect(() => {
    if (!isOpen) return;
    setCopyStatus(null);
    setCopyEmbedStatus(null);
  }, [isOpen]);

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

  async function handleCopyEmbed() {
    try {
      await copyText(iframeCode);
      setCopyEmbedStatus("copied");
      setTimeout(() => setCopyEmbedStatus(null), 1600);
    } catch (e) {
      console.error(e);
      setCopyEmbedStatus("error");
      setTimeout(() => setCopyEmbedStatus(null), 2000);
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

  if (!isOpen) return null;

  return createPortal(
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

        {/* Body */}
        <div className={styles.body}>


                    {/* Social */}
                    <div className={styles.card}>
            <div className={styles.cardTitle}>Post</div>

            <div className={styles.socialGrid}>
              <button type="button" className={styles.socialBtn} onClick={openX} disabled={!pageUrl} aria-label="Share on X">
                <span className={styles.socialIcon}><FaXTwitter /></span>
                <span className={styles.socialLabel}>X</span>
              </button>

              <button type="button" className={styles.socialBtn} onClick={openFacebook} disabled={!pageUrl} aria-label="Share on Facebook">
                <span className={styles.socialIcon}><FaFacebookF /></span>
                <span className={styles.socialLabel}>Facebook</span>
              </button>

              <button type="button" className={styles.socialBtn} onClick={openLinkedIn} disabled={!pageUrl} aria-label="Share on LinkedIn">
                <span className={styles.socialIcon}><FaLinkedinIn /></span>
                <span className={styles.socialLabel}>LinkedIn</span>
              </button>
            </div>

            <div className={styles.hintMuted} style={{ marginTop: 10 }}>
              This shares the map page URL (OpenGraph preview). Image attaching is a separate flow.
            </div>


          </div>
          {/* Copy link */}
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




                    {/* ✅ Embed */}
                    <div className={styles.card}>
            <div className={styles.cardTitle}>Embed</div>

            {!isPro ? (
              <div className={styles.hintMuted}>
                Embedding is a <b>Pro</b> feature.
                {/* put your Upgrade button/CTA here */}
              </div>
            ) : !isPublic && !isOwner ? (
              <div className={styles.hintMuted}>
                You can only embed maps that are <b>public</b> or that you <b>own</b>.
              </div>
            ) : (
              <>
                <div className={styles.embedRow}>
                  <textarea
                    className={styles.embedBox}
                    value={iframeCode}
                    readOnly
                    spellCheck={false}
                  />
                  <button
                    type="button"
                    className={styles.copyBtn}
                    onClick={handleCopyEmbed}
                    disabled={!canShowEmbed || !iframeCode}
                  >
                    <BiCopy />
                    Copy
                  </button>
                </div>

                {copyEmbedStatus === "copied" && <div className={styles.hintOk}>Embed code copied ✓</div>}
                {copyEmbedStatus === "error" && <div className={styles.hintMuted}>Couldn’t copy. Try again.</div>}

                <button
                  type="button"
                  className={styles.openBtn}
                  onClick={() => embedUrl && safeOpen(embedUrl)}
                  disabled={!embedUrl}
                  title="Open the embed view in a new tab"
                >
                  <BiLinkExternal />
                  Preview embed
                </button>

                <div className={styles.hintMuted}>
                  Note: if the map is private, visitors on another site won’t see it unless you build a special “private embed token” system.
                </div>
              </>
            )}
          </div>

        </div>
      </div>
    </div>,
    document.body
  );
}
