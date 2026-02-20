// src/components/FAQ.js

import React from 'react';
import { Link } from 'react-router-dom';
import HomeHeader from './HomeHeader';
import HomeFooter from './HomeFooter';
import styles from './Docs.module.css';

export default function FAQ() {
  return (
    <div className={styles.documentationContainer}>
      <HomeHeader />
      <div className={styles.docsBody}>
        <div className={styles.docsWrapper}>
        <main className={styles.docsMain} style={{ maxWidth: '720px', margin: '0 auto' }}>
          <h1 id="faq">FAQ</h1>
          <p>
            <strong>1. Do I need an account to create a map?</strong><br />
            No. You can start creating immediately in the playground. An account is only required to save, publish, download, or embed your map.
          </p>
          <p>
            <strong>2. What file formats are supported?</strong><br />
            Map in Color supports CSV, TSV, XLSX, and XLS. The uploader automatically analyzes your file and matches rows to countries.
          </p>
          <p>
            <strong>3. What happens if some rows in my file are invalid?</strong><br />
            Invalid rows are skipped during import. You can review warnings and errors in the import log to fix issues if needed.
          </p>
          <p>
            <strong>4. How does Map in Color detect map type?</strong><br />
            If your values are numeric, the map is treated as a choropleth. If your values are text-based, it is treated as categorical. If mixed data is detected, you can manually choose the interpretation.
          </p>
          <p>
            <strong>5. Can I edit my map after publishing?</strong><br />
            Yes. Maps can be edited at any time by their creator.
          </p>
          <p>
            <strong>6. What is the difference between public and private maps?</strong><br />
            Public maps are visible to everyone and can appear in Explore. Private maps are only visible to the creator.
          </p>
          <p>
            <strong>7. Can I embed maps on my own website?</strong><br />
            Yes. Public maps can be embedded directly. Private embeds require a valid access token (Pro feature).
          </p>
          <p>
            <strong>8. How are trending maps calculated?</strong><br />
            Trending maps are based on the number of stars received within the past 3 days.
          </p>
          <p>
            <strong>9. Can I use Map in Color for commercial purposes?</strong><br />
            Yes, depending on your usage and subscription level. Refer to the <Link to="/terms">Terms of Service</Link> for full details.
          </p>
          <p>
            <strong>10. Is my data stored when I use the playground?</strong><br />
            Maps created in the playground are temporarily stored locally in your session. They are only permanently saved once you <Link to="/signup">create an account</Link> and choose to save them.
          </p>
          <p>
            <Link to="/docs">← Back to Docs</Link>
          </p>
        </main>
        </div>
      </div>
      <HomeFooter />
    </div>
  );
}
