/**
 * Shared email layout matching pro-announcement style.
 * Use for verify account, password reset, report confirmations, etc.
 *
 * @param {string} contentHtml - HTML for the main content area (paragraphs, buttons, etc.)
 * @param {{ footerLine2?: string }} options - Optional footer second line (e.g. unsubscribe text). Omit for transactional emails.
 * @returns {string} Full HTML document
 */
function wrapEmailBody(contentHtml, options = {}) {
  const { footerLine2 } = options;
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <!--[if mso]>
  <noscript>
    <xml>
      <o:OfficeDocumentSettings>
        <o:PixelsPerInch>96</o:PixelsPerInch>
      </o:OfficeDocumentSettings>
    </xml>
  </noscript>
  <![endif]-->
  <style type="text/css">
    @import url('https://fonts.googleapis.com/css2?family=Open+Sans:wght@400;700&display=swap');
    .email-body { background-color: #e8f4f5; }
    .email-container { max-width: 560px; width: 100%; }
    @media only screen and (max-width: 600px) {
      .email-container { width: 100% !important; max-width: 100% !important; }
      .mobile-pad { padding-left: 16px !important; padding-right: 16px !important; }
      .outer-pad { padding-left: 0 !important; padding-right: 0 !important; }
    }
  </style>
</head>
<body class="email-body" style="margin: 0; padding: 0; font-family: 'Open Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', Arial, sans-serif; font-size: 16px; line-height: 1.6; color: rgba(15, 23, 42, 0.9); -webkit-font-smoothing: antialiased;">
  <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="background-color: #e8f4f5;">
    <tr>
      <td align="center" class="outer-pad" style="padding: 32px 0 40px;">
        <table role="presentation" class="email-container" cellpadding="0" cellspacing="0" border="0" width="100%" style="max-width: 560px; width: 100%; background-color: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 24px rgba(15, 23, 42, 0.08);">
          <tr>
            <td class="mobile-pad" style="padding: 28px 40px 24px; border-bottom: 1px solid rgba(20, 24, 40, 0.08);">
              <a href="https://mapincolor.com" target="_blank" style="text-decoration: none;">
                <img src="https://mapincolor.com/assets/3-0/MIC-logo-transparent.png" alt="Map In Color" width="40" height="40" style="display: block; width: 40px; height: auto;" />
              </a>
            </td>
          </tr>
          <tr>
            <td class="mobile-pad" style="padding: 32px 40px 24px;">
${contentHtml}
            </td>
          </tr>
          <tr>
            <td class="mobile-pad" style="padding: 24px 40px 32px; border-top: 1px solid rgba(20, 24, 40, 0.08); background-color: rgba(246, 247, 251, 0.5);">
              <p style="margin: 0 0 8px; font-size: 15px; font-weight: 600; color: rgba(15, 23, 42, 0.75);">The Map in Color team</p>
${footerLine2 ? `<p style="margin: 0; font-size: 13px; color: rgba(15, 23, 42, 0.55);">${footerLine2}</p>` : ''}
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}

/** Reusable CTA button HTML (same style as pro-announcement). */
function emailCtaButton(href, label) {
  return `<table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%">
  <tr>
    <td align="center" style="padding: 8px 0 24px;">
      <a href="${href}" target="_blank" style="display: inline-block; padding: 14px 28px; background: linear-gradient(135deg, #28a8e1 0%, #14a9af 100%); background-color: #14a9af; color: #ffffff; font-size: 15px; font-weight: 700; text-decoration: none; border-radius: 999px; box-shadow: 0 14px 26px rgba(40, 168, 225, 0.25);">${label}</a>
    </td>
  </tr>
</table>`;
}

function escapeHtml(str) {
  if (str == null) return '';
  const s = String(str);
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

const P = {
  /** Paragraph with default spacing */
  p: (html) => `<p style="margin: 0 0 20px; font-size: 16px; color: rgba(15, 23, 42, 0.88);">${html}</p>`,
  /** Greeting line */
  greeting: (name) => `<p style="margin: 0 0 24px; font-size: 16px; color: rgba(15, 23, 42, 0.9);">Hello ${escapeHtml(name || 'there')},</p>`,
  /** Muted smaller text */
  small: (html) => `<p style="margin: 0 0 16px; font-size: 14px; color: rgba(15, 23, 42, 0.7);">${html}</p>`,
  /** Link in brand color */
  link: (href, text) => `<a href="${escapeHtml(href)}" style="color: #14a9af; font-weight: 600; text-decoration: none;">${escapeHtml(text)}</a>`,
};

module.exports = { wrapEmailBody, emailCtaButton, P, escapeHtml };
