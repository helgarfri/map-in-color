import React, { useState, useContext } from "react";
import styles from "./ProPage.module.css";
import ComingSoonProModal from "./ComingSoonProModal";
import { UserContext } from "../context/UserContext";
import { fetchUserProfile } from "../api";
import { openProCheckout } from "../utils/paddleCheckout";

const PRO_LOGO_SRC = "/assets/3-0/PRO-logo.png";
const PRO_PRICE = "4.99";

const BENEFITS = [
  "Remove the Map in Color watermark",
  "High-quality exports (max JPG quality)",
  "Transparent PNG exports",
  "SVG export (scalable vector)",
  "Interactive embeds without branding",
  "Embeds show your map even when it's private",
  "Priority feature updates",
];

export default function ProPage() {
  const [showComingSoon, setShowComingSoon] = useState(false);
  const { profile, setProfile } = useContext(UserContext);

  const handleUpgrade = async () => {
    const refetch = () => fetchUserProfile().then((r) => setProfile(r.data));
    const result = await openProCheckout(profile?.id, profile?.email, refetch).catch(() => ({ opened: false }));
    if (result.opened === false && result.reason === "not_configured") {
      setShowComingSoon(true);
    }
  };

  return (
    <div className={styles.wrap}>
      <div className={styles.inner}>
        <header className={styles.hero}>
          <img
            className={styles.logo}
            src={PRO_LOGO_SRC}
            alt="Map in Color Pro"
          />
          <h1 className={styles.title}>Map in Color Pro</h1>
          <p className={styles.subtitle}>
            For creators who need clean exports, custom embeds, and full flexibility.
          </p>
        </header>

        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>What is Pro?</h2>
          <p className={styles.bodyText}>
            Pro is a subscription that unlocks professional-grade map creation and sharing. Whether you're a creator publishing data stories or a business embedding maps in dashboards and reports, Pro gives you the tools and quality you need without Map in Color branding on your work.
          </p>
        </section>

        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>What Pro unlocks</h2>
          <ul className={styles.benefitsList}>
            {BENEFITS.map((text, i) => (
              <li key={i} className={styles.benefitItem}>
                <span className={styles.check} aria-hidden="true">✔</span>
                {text}
              </li>
            ))}
          </ul>
        </section>

        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>Why you need it</h2>
          <div className={styles.audienceGrid}>
            <div className={styles.audienceCard}>
              <h3 className={styles.audienceTitle}>For creators</h3>
              <p className={styles.audienceText}>
                Publish maps without watermarks. Export in high quality (JPG, PNG, SVG) for articles, social, and presentations. Embed interactive maps on your site with no “Made with Map in Color” branding—your work, your brand.
              </p>
            </div>
            <div className={styles.audienceCard}>
              <h3 className={styles.audienceTitle}>For business</h3>
              <p className={styles.audienceText}>
                Use maps in reports, dashboards, and internal tools. Private maps can still be embedded (Pro-only), so you keep data internal while sharing a polished map with stakeholders. Scalable SVG and high-res exports look sharp in any format.
              </p>
            </div>
          </div>
        </section>

        <section className={styles.ctaSection}>
          <p className={styles.value}>Less than a coffee per month.</p>
          <p className={styles.trust}>No contracts. Cancel anytime.</p>
          <button type="button" className={styles.upgradeBtn} onClick={handleUpgrade}>
            Upgrade to Pro
          </button>
          <p className={styles.priceNote}>${PRO_PRICE}/month</p>
        </section>
      </div>

      <ComingSoonProModal
        isOpen={showComingSoon}
        onClose={() => setShowComingSoon(false)}
      />
    </div>
  );
}
