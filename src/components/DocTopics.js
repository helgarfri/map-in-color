// src/components/DocTopics.js
// Defines sections and content for each docs topic (v3).

import React from 'react';
import { Link } from 'react-router-dom';
import styles from './Docs.module.css';

const TableOfContents = ({ sections }) => {
  const [activeSection, setActiveSection] = React.useState('');

  React.useEffect(() => {
    const handleScroll = () => {
      let current = '';
      sections.forEach((section) => {
        const element = document.getElementById(section.id);
        if (element) {
          const rect = element.getBoundingClientRect();
          if (rect.top <= 100) current = section.id;
        }
      });
      setActiveSection(current);
    };
    window.addEventListener('scroll', handleScroll);
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, [sections]);

  const scrollToSection = (id) => {
    const element = document.getElementById(id);
    if (element) element.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return (
    <nav className={styles.tocContainer} aria-label="On this page">
      <ul className={styles.tocList}>
        {sections.map((section) => (
          <li
            key={section.id}
            className={`${styles.tocItem} ${activeSection === section.id ? styles.tocItemActive : ''}`}
            style={{
              paddingLeft:
                section.level === 2 ? '0' : section.level === 3 ? '12px' : section.level === 4 ? '24px' : '0',
            }}
          >
            <button type="button" className={styles.tocLink} onClick={() => scrollToSection(section.id)}>
              {section.title}
            </button>
          </li>
        ))}
      </ul>
    </nav>
  );
};

// ——— 1. Introduction ———
const introductionSections = [
  { id: 'what-is-mic', title: 'What is Map in Color?', level: 2 },
  { id: 'who-is-it-for', title: 'Who is it for?', level: 2 },
];

function IntroductionContent() {
  return (
    <>
      <h2 id="what-is-mic">What is Map in Color?</h2>
      <p>
        Map in Color is a web-based platform for creating interactive choropleth and categorical maps from structured data. It allows users to upload their own datasets, customize map design, and control how their maps are presented and shared.
      </p>
      <p>
        Users can adjust colors, define data ranges, add contextual information, and choose whether their maps are public or private. Maps can be downloaded as images, embedded on external websites, or shared directly within the platform.
      </p>
      <p>
        In addition to creation tools, Map in Color provides an explore space where users can discover, save, and interact with maps created by others.
      </p>
      <p>
        The goal of Map in Color is to provide a professional yet accessible mapping tool with a clean, intuitive interface.
      </p>
      <h2 id="who-is-it-for">Who is it for?</h2>
      <p>
        Map in Color is for researchers, educators, journalists, and anyone who needs to visualize geographic data. Whether you are presenting statistics, teaching regional patterns, or building a public dashboard, you can create and share maps without coding. The playground lets you try the tool without an account; signing up unlocks saving, publishing, and embedding.
      </p>
    </>
  );
}

// ——— 2. Getting Started ———
const gettingStartedSections = [
  { id: 'start-creating-immediately', title: 'Start Creating Immediately', level: 2 },
  { id: 'saving-your-map', title: 'Saving Your Map', level: 2 },
  { id: 'creating-an-account', title: 'Creating an Account', level: 2 },
];

function GettingStartedContent() {
  return (
    <>
      <h2 id="start-creating-immediately">Start Creating Immediately</h2>
      <p>
        You do not need an account to begin creating a map. Simply open the <Link to="/playground">Playground</Link> to access the map editor and start uploading your data. The playground allows you to explore all core creation features without signing in.
      </p>
      <h2 id="saving-your-map">Saving Your Map</h2>
      <p>To save, publish, download, or share a map, you must be logged in.</p>
      <p>
        If you create a map in the playground and later decide to sign up, your current map session will not be lost. Map in Color temporarily stores your map data locally. After signing in or <Link to="/signup">creating an account</Link>, you will be redirected to the <code>/create</code> session where your previous map configuration remains available. This ensures a seamless transition from exploration to ownership.
      </p>
      <h2 id="creating-an-account">Creating an Account</h2>
      <p>To <Link to="/signup">create an account</Link>, users must:</p>
      <ul>
        <li>Provide a valid email address</li>
        <li>Choose a unique username</li>
        <li>Create a password that meets security requirements</li>
        <li>Provide basic profile information (such as date of birth and location)</li>
        <li><span>Agree to the <Link to="/terms">Terms of Service</Link> and <Link to="/privacy">Privacy Policy</Link></span></li>
      </ul>
      <p>Once registration is complete:</p>
      <ul>
        <li>Users coming from the playground will be redirected to <code>/create</code> with their active session restored</li>
        <li>New users signing up directly will be redirected to the <code>/dashboard</code></li>
      </ul>
    </>
  );
}

// ——— 3. Creating Maps ———
const creatingMapsSections = [
  { id: 'map-types', title: 'Map Types', level: 2 },
  { id: 'choropleth-maps', title: 'Choropleth', level: 3 },
  { id: 'automatic-range-generation', title: 'Automatic Range Generation', level: 4 },
  { id: 'manual-range-control', title: 'Manual Range Control', level: 4 },
  { id: 'color-customization', title: 'Color Customization', level: 4 },
  { id: 'categorical-maps', title: 'Categorical', level: 3 },
  { id: 'creating-categories', title: 'Creating Categories', level: 4 },
  { id: 'handling-unassigned', title: 'Handling Unassigned Countries', level: 4 },
  { id: 'visual-control', title: 'Visual Control', level: 4 },
];

function CreatingMapsContent() {
  return (
    <>
      <h2 id="map-types">Map Types</h2>
      <p>
        Map in Color supports two types of maps: <strong>Choropleth</strong> and <strong>Categorical</strong>. The system automatically detects the appropriate type based on your data, but you can manually switch between them at any time.
      </p>
      <h3 id="choropleth-maps">Choropleth</h3>
      <p>Choropleth maps are used for numerical data. Examples:</p>
      <ul>
        <li>Internet usage (%)</li>
        <li>GDP per capita</li>
        <li>Population density</li>
        <li>Human Development Index (HDI)</li>
      </ul>
      <p>
        In a choropleth map, each country is assigned a numerical value. Countries are then grouped into value ranges, and each range is displayed using a different shade or color.
      </p>
      <h4 id="automatic-range-generation">Automatic Range Generation</h4>
      <p>
        Map in Color can automatically generate value ranges based on your dataset.
      </p>
      <p>The system:</p>
      <ul>
        <li>Analyzes the distribution of your numeric values</li>
        <li>Determines an appropriate number of ranges</li>
        <li>Creates balanced or evenly spaced bins depending on the data</li>
        <li>Rounds boundaries to clean, human-readable numbers</li>
      </ul>
      <p>
        This ensures that ranges reflect the structure of your data while remaining visually clear and easy to interpret.
      </p>
      <p>If all values are identical, a single range is generated.</p>
      <h4 id="manual-range-control">Manual Range Control</h4>
      <p>Users can add new ranges, remove ranges, edit lower and upper bounds manually, rename ranges, and adjust colors for each range. Countries are assigned to ranges based on their numerical value—if a value falls within a defined lower and upper bound, it will automatically appear in that range. By default, range labels are numeric (e.g., 0.1 – 0.5), but users can define custom range names.</p>
      <h4 id="color-customization">Color Customization</h4>
      <p>
        For choropleth maps, users can choose a base color (which automatically generates a light-to-dark gradient), select from predefined Map in Color themes, or manually set custom colors for each range. The gradient system ensures that lower values appear lighter and higher values appear darker, creating a clear visual hierarchy.
      </p>
      <h3 id="categorical-maps">Categorical</h3>
      <p>Categorical maps are used for classification data. Examples:</p>
      <ul>
        <li>World Cup winners</li>
        <li>EU membership</li>
        <li>Driving side (left/right)</li>
        <li>Income level groups</li>
      </ul>
      <p>Instead of numerical ranges, categorical maps assign countries to named groups.</p>
      <img
        src="/assets/3-0/france-preview.png"
        alt="Example of a categorical map: FIFA World Cup winners"
        className={styles.docImage}
      />
      <p className={styles.docCaption}>Example of a categorical map: FIFA World Cup winners.</p>
      <h4 id="creating-categories">Creating Categories</h4>
      <p>
        Users create categories by adding entries to the category table. Each category includes a custom name and a custom color. Countries can then be manually assigned to any category.
      </p>
      <h4 id="handling-unassigned">Handling Unassigned Countries</h4>
      <p>
        Users can optionally create a category for unassigned countries. This is useful when only part of the dataset belongs to a defined group and the remaining countries should share a common classification (e.g., &quot;Not Applicable&quot; or &quot;Never Won&quot;).
      </p>
      <h4 id="visual-control">Visual Control</h4>
      <p>
        Each category has a fixed color. Unlike choropleth maps, categorical maps do not use gradients—they use distinct color blocks to represent discrete groups. This makes categorical maps ideal for binary or multi-group classifications.
      </p>
    </>
  );
}

// ——— 4. Data Import ———
const dataImportSections = [
  { id: 'data-format-guide', title: 'Data Format Guide', level: 2 },
  { id: 'smart-upload', title: 'Smart Upload Detection', level: 2 },
  { id: 'description-column', title: 'Optional Description Column', level: 2 },
  { id: 'supported-files', title: 'Supported File Types', level: 2 },
  { id: 'supported-country-coverage', title: 'Supported Country Coverage', level: 2 },
  { id: 'common-errors', title: 'Common Errors', level: 2 },
];

function DataImportContent() {
  return (
    <>
      <h2 id="data-format-guide">Data Format Guide</h2>
      <p>
        Map in Color includes a smart data uploader that analyzes your file, matches rows to countries, and automatically determines whether your data should be interpreted as a choropleth (numeric) or categorical (text) map.
      </p>
      <p>
        You can upload incomplete datasets. If some rows cannot be matched or parsed, Map in Color will skip invalid lines and import the rest, while showing warnings and errors in the import log.
      </p>
      <h2 id="smart-upload">Smart Upload Detection</h2>
      <p>When you upload a file, Map in Color performs these steps:</p>
      <p><strong>1) Read and normalize the data</strong></p>
      <p>Each cell is cleaned before processing: trims whitespace, removes BOM characters (common in exported files), handles quoted CSV values (including escaped quotes), and supports decimal commas (&quot;12,5&quot; → 12.5).</p>
      <p><strong>2) Parse the file format</strong></p>
      <p>The uploader automatically parses CSV (including semicolon-separated, common in European exports), TSV (tab-separated), and Excel (first sheet converted to rows). Comment lines starting with <code>#</code> are ignored.</p>
      <p><strong>3) Match rows to countries (smart country detection)</strong></p>
      <p>Each row is matched against the Map in Color country dataset using 2-letter ISO codes (e.g. US, IS, DE), 3-letter ISO codes (e.g. USA, ISL, DEU — common in World Bank and many international datasets), country names, and aliases (alternate spellings and official names). For example, Turkey matches: Türkiye, Republic of Türkiye, Turkiye.</p>
      <p><strong>4) Detect the file structure</strong></p>
      <p>Map in Color supports a variety of data layouts, including:</p>
      <p><strong>A) Simple 2-column layout</strong></p>
      <p>Column 1 — country name or code; Column 2 — numeric value or category label.</p>
      <pre className={styles.codeBlock}>
        {`Country,Value
Iceland,99.3
Spain,95.1
Brazil,89.7`}
      </pre>
      <p><strong>B) Wide &quot;year columns&quot; layout (World Bank / WDI-style)</strong></p>
      <p>Map in Color detects header rows with &quot;Country Code&quot; and year columns. A &quot;Country Name&quot; column is optional: files with only &quot;Country Code&quot; and year columns (e.g. 3-letter codes like AFG, COD, KOR) are supported. It picks the most recent available numeric value per country.</p>
      <p>Example (code-only with year columns):</p>
      <pre className={styles.codeBlock}>
        {`Country Code,Indicator,1990,2000,2010,2020
AFG,Inflation (%),,,5.2,6.1
ALB,Inflation (%),2.1,3.4,4.0,4.2
USA,Inflation (%),5.4,3.4,1.6,1.2`}
      </pre>
      <h2 id="description-column">Optional Description Column</h2>
      <p>You can include a third column to attach a short description to each country. The uploader looks for a column whose header contains or equals one of: <code>description</code>, <code>desc</code>, <code>notes</code>, <code>note</code>, <code>comment</code>, <code>details</code>, <code>detail</code>, <code>info</code>, or <code>text</code>. If present, that column&apos;s value is stored as the per-country description and can be shown on the map (e.g. in tooltips). Without a header row, the third column is treated as the description column.</p>
      <p>Example with a description column:</p>
      <pre className={styles.codeBlock}>
        {`Country,Value,Description
Iceland,99.3,Highest renewable share in Europe
Spain,95.1,Strong solar and wind growth
Brazil,89.7,Hydropower-dominated grid`}
      </pre>
      <p><strong>Automatic Map Type Detection</strong></p>
      <p>If the value column is numeric → Choropleth; if text → Categorical. When mixed data is detected, the import modal shows an &quot;Interpret as&quot; selector so you can override.</p>
      <h2 id="supported-files">Supported File Types</h2>
      <ul>
        <li>CSV (.csv)</li>
        <li>TSV (.tsv)</li>
        <li>Excel (.xlsx, .xls)</li>
        <li>Plain text (.txt, treated like CSV/TSV)</li>
      </ul>
      <h2 id="supported-country-coverage">Supported Country Coverage</h2>
      <p>Map in Color&apos;s world map aligns with the World Bank country dataset (WDI standard).</p>
      <p>This includes:</p>
      <ul>
        <li>Sovereign states</li>
        <li>Select statistical territories commonly used in international datasets</li>
      </ul>
      <p>Certain minor or uninhabited territories are not included as independent entities. Examples include:</p>
      <ul>
        <li>British Indian Ocean Territory</li>
        <li>Christmas Island</li>
        <li>Cocos Islands</li>
        <li>French Southern Territories</li>
        <li>Heard Island and McDonald Island</li>
        <li>Norfolk Island</li>
        <li>Pitcairn Islands</li>
        <li>South Georgia and the South Sandwich Islands</li>
        <li>Tokelau</li>
        <li>Wallis and Futuna</li>
      </ul>
      <p>These territories are either:</p>
      <ul>
        <li>Not treated as standalone statistical units in major global datasets</li>
        <li>Administratively grouped under another country</li>
        <li>Uninhabited</li>
      </ul>
      <p>If your dataset includes one of these, the uploader will skip the row and display a warning in the import log.</p>
      <h2 id="common-errors">Common Errors</h2>
      <p>During import, Map in Color displays an import log. Common warnings and errors include:</p>
      <ul>
        <li><strong>Country not found</strong> — Invalid name or code; check spelling, extra spaces, and punctuation.</li>
        <li><strong>Missing value</strong> — Empty or missing value in the second column.</li>
        <li><strong>No numeric values found</strong> — For choropleth imports, the value column must contain numbers.</li>
        <li><strong>Rows skipped</strong> — Parsing problems (e.g., encoding, malformed CSV).</li>
      </ul>
      <p>Recommended: use ISO codes — 2-letter (e.g. IS, DE, BR) or 3-letter (e.g. ISL, DEU, BRA) — and standard English country names. Local spellings and aliases are supported when available. Invalid rows are skipped; the remainder is imported successfully.</p>
    </>
  );
}

// ——— 5. Ownership & Sharing ———
const ownershipSharingSections = [
  { id: 'map-ownership', title: 'Map Ownership', level: 2 },
  { id: 'public-vs-private', title: 'Public vs Private', level: 2 },
  { id: 'embedding-maps', title: 'Embedding Maps', level: 2 },
  { id: 'profile-privacy-settings', title: 'Profile Privacy Settings', level: 2 },
];

function OwnershipSharingContent() {
  return (
    <>
      <h2 id="map-ownership">Map Ownership</h2>
      <p>Every saved map belongs to its creator. The creator can edit the map at any time, change its visibility (public or private), and delete the map. Map ownership is tied to the user account that created it.</p>
      <h2 id="public-vs-private">Public vs Private</h2>
      <p><strong>Public Maps</strong> — Visible to all users. Others can view the map, share the link, embed it (if enabled), and download exported versions. Public maps may appear in search and explore.</p>
      <p><strong>Private Maps</strong> — Visible only to the creator. They do not appear in search or explore and cannot be viewed by other users; the creator can still export them.</p>
      <h2 id="embedding-maps">Embedding Maps</h2>
      <p>Maps can be embedded on external websites using an iframe. <strong>Public embeds</strong>: public maps can be embedded directly. <strong>Private embeds (Pro Feature)</strong>: embedding a private map requires a valid access token in the iframe URL. If the token is missing or invalid, the embedded map will not be displayed.</p>
      <p><strong>Example: Map embed in a website layout</strong></p>
      <img
        src="/assets/3-0/steps4.png"
        alt="Example of a Map in Color embed in a fake website layout"
        className={styles.docImage}
      />
      <p className={styles.docCaption}>Example of a Map in Color embed in a fake website layout.</p>
      <h2 id="profile-privacy-settings">Profile Privacy Settings</h2>
      <p>Users can control what appears on their public profile under Privacy Settings:</p>
      <ul>
        <li><strong>Profile Visibility</strong> — Control who can view your profile. &quot;Only Me&quot; disables all public profile display options.</li>
        <li><strong>Show Saved Maps</strong> — Allow others to see the maps you have saved.</li>
        <li><strong>Show Activity Feed</strong> — Display your recent activity (created maps or interactions).</li>
        <li><strong>Show Location</strong> — Display your location on your profile.</li>
        <li><strong>Show Date of Birth</strong> — Display your date of birth on your profile.</li>
        <li><strong>Star Notifications</strong> — Notify others when you star a map.</li>
      </ul>
    </>
  );
}

// ——— 6. Explore & Community ———
const exploreCommunitySections = [
  { id: 'browsing', title: 'Browsing', level: 2 },
  { id: 'interactions', title: 'Interactions', level: 2 },
  { id: 'search-and-tags', title: 'Search & Tags', level: 2 },
  { id: 'trending', title: 'Trending', level: 2 },
];

function ExploreCommunityContent() {
  return (
    <>
      <h2 id="browsing">Browsing</h2>
      <p>Anyone can explore public maps without signing in. Unsigned visitors can view public maps, see map details and descriptions, view discussions and comments, browse tags, search for maps, and sort maps. Certain actions require an account.</p>
      <h2 id="interactions">Interactions</h2>
      <p>To interact with maps, users must be signed in. Signed-in users can star maps, download maps (if allowed), embed maps on external websites, comment on maps, and reply to other comments.</p>
      <p>All users are expected to follow our <Link to="/terms">Terms of Service</Link>. Violations may result in content removal, account suspension, or removal from the platform.</p>
      <h2 id="search-and-tags">Search & Tags</h2>
      <p>The Explore page includes:</p>
      <ul>
        <li><strong>Tags</strong> — Maps can include tags. Users can filter maps by selecting specific tags.</li>
        <li><strong>Search</strong> — Users can search maps by title, description, tags, and creator username.</li>
      </ul>
      <h2 id="trending">Trending</h2>
      <p>Maps can be sorted by <em>Newest</em> (recently published), <em>Most Starred</em> (highest total star count), and <em>Trending</em> (highest number of stars received in the past 3 days). Trending highlights recently popular maps based on short-term activity.</p>
    </>
  );
}

export const DOC_TOPICS = {
  introduction: {
    title: 'Introduction',
    sections: introductionSections,
    Content: IntroductionContent,
  },
  'getting-started': {
    title: 'Getting Started',
    sections: gettingStartedSections,
    Content: GettingStartedContent,
  },
  'creating-maps': {
    title: 'Creating Maps',
    sections: creatingMapsSections,
    Content: CreatingMapsContent,
  },
  'data-import': {
    title: 'Data Import',
    sections: dataImportSections,
    Content: DataImportContent,
  },
  'ownership-sharing': {
    title: 'Ownership & Sharing',
    sections: ownershipSharingSections,
    Content: OwnershipSharingContent,
  },
  'explore-community': {
    title: 'Explore & Community',
    sections: exploreCommunitySections,
    Content: ExploreCommunityContent,
  },
};

export { TableOfContents };
