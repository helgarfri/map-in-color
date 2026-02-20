// src/components/Docs.js

import React, { useState, useEffect } from 'react';
import { Outlet, Link, useParams, Navigate } from 'react-router-dom';
import HomeHeader from './HomeHeader';
import HomeFooter from './HomeFooter';
import styles from './Docs.module.css';
import { DOC_TOPICS, TableOfContents as DocTopicTOC } from './DocTopics';
import countryCodes from '../world-countries.json';
import usStatesCodes from '../united-states.json';
import euCodes from '../european-countries.json';

const DOC_VERSIONS = [
  { id: 'v3', label: 'MIC v3.0.0', active: true },
  { id: 'v2', label: 'MIC MVP Release v2.0.0', active: false },
];

const downloadTemplate = (mapType) => {
  let csvContent = 'data:text/csv;charset=utf-8,';
  let dataSourceLocal;

  switch (mapType) {
    case 'europe':
      dataSourceLocal = euCodes;
      break;
    case 'usa':
      dataSourceLocal = usStatesCodes;
      break;
    default:
      dataSourceLocal = countryCodes;
      break;
  }

  // Build a CSV with just "Name," as a starter
  dataSourceLocal.forEach((item) => {
    // If the name has commas, wrap it in quotes
    const name = item.name.includes(',') ? `"${item.name}"` : item.name;
    csvContent += `${name},\n`;
  });

  const encodedUri = encodeURI(csvContent);
  const fileName =
    mapType === 'europe'
      ? 'european_countries_template.csv'
      : mapType === 'usa'
      ? 'us_states_template.csv'
      : 'countries_template.csv';

  const link = document.createElement('a');
  link.setAttribute('href', encodedUri);
  link.setAttribute('download', fileName);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

// New function to download the JSON data
const downloadJson = (mapType) => {
  let dataSourceLocal;

  switch (mapType) {
    case 'europe':
      dataSourceLocal = euCodes;
      break;
    case 'usa':
      dataSourceLocal = usStatesCodes;
      break;
    default:
      dataSourceLocal = countryCodes;
      break;
  }

  // Convert to a nicely formatted JSON string
  const jsonString = JSON.stringify(dataSourceLocal, null, 2);

  // Create a Blob and a URL for it
  const blob = new Blob([jsonString], { type: 'application/json' });
  const url = URL.createObjectURL(blob);

  // Pick a filename depending on the map type
  const fileName =
    mapType === 'europe'
      ? 'european_countries.json'
      : mapType === 'usa'
      ? 'united_states.json'
      : 'world_countries.json';

  // Create a link to download
  const link = document.createElement('a');
  link.href = url;
  link.download = fileName;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

// Table of contents — v3 (MIC v3.0.0) — all headings h1–h4
const sectionsV3 = [
  { id: 'mic-v3', title: 'MIC v3.0.0', level: 1 },
  { id: 'introduction', title: 'What is Map in Color?', level: 2 },
  { id: 'getting-started', title: 'Getting Started', level: 2 },
  { id: 'start-creating-immediately', title: 'Start Creating Immediately', level: 3 },
  { id: 'saving-your-map', title: 'Saving Your Map', level: 3 },
  { id: 'creating-an-account', title: 'Creating an Account', level: 3 },
  { id: 'map-types', title: 'Map Types', level: 2 },
  { id: 'choropleth-maps', title: 'Choropleth Maps', level: 3 },
  { id: 'automatic-range-generation', title: 'Automatic Range Generation', level: 4 },
  { id: 'manual-range-control', title: 'Manual Range Control', level: 4 },
  { id: 'color-customization', title: 'Color Customization', level: 4 },
  { id: 'categorical-maps', title: 'Categorical Maps', level: 3 },
  { id: 'creating-categories', title: 'Creating Categories', level: 4 },
  { id: 'handling-unassigned-countries', title: 'Handling Unassigned Countries', level: 4 },
  { id: 'visual-control', title: 'Visual Control', level: 4 },
  { id: 'map-types-summary', title: 'Summary', level: 3 },
  { id: 'data-format-guide', title: 'Data Format Guide', level: 2 },
  { id: 'smart-upload', title: 'How the Smart Upload Works', level: 3 },
  { id: 'ownership-privacy-sharing', title: 'Ownership, Privacy, and Sharing', level: 2 },
  { id: 'map-ownership', title: 'Map Ownership', level: 3 },
  { id: 'map-visibility', title: 'Map Visibility', level: 3 },
  { id: 'embedding-maps', title: 'Embedding Maps', level: 3 },
  { id: 'profile-privacy-settings', title: 'Profile Privacy Settings', level: 3 },
  { id: 'explore-community', title: 'Explore & Community', level: 2 },
  { id: 'browsing-without-an-account', title: 'Browsing Without an Account', level: 3 },
  { id: 'features-that-require-login', title: 'Features That Require Login', level: 3 },
  { id: 'search-and-discovery', title: 'Search and Discovery', level: 3 },
  { id: 'faq', title: 'FAQ', level: 2 },
];

// Table of contents — v2 (legacy)
const sectionsV2 = [
  { id: 'introduction', title: 'Introduction', level: 2 },
  { id: 'quick-start', title: 'Quick Start (For Users)', level: 2 },
  { id: 'creating-your-first-map', title: 'Creating Your First Map', level: 3 },
  { id: 'data-integration', title: 'Data Integration', level: 3 },
  { id: 'saving-and-sharing', title: 'Saving and Sharing', level: 3 },
  { id: 'how-to-create-and-edit-maps', title: 'How to Create and Edit Maps', level: 2 },
  { id: 'csv-template', title: 'CSV Template', level: 3 },
  { id: 'error-handling', title: 'Error Handling', level: 3 },
  { id: 'defining-ranges', title: 'Defining Ranges', level: 3 },
  { id: 'naming-and-coloring', title: 'Naming and Coloring', level: 3 },
  { id: 'theme-and-final-settings', title: 'Theme and Final Settings', level: 3 },
  { id: 'setup-installation', title: 'Setup & Installation (For devs)', level: 2 },
  { id: 'project-structure', title: 'Project Structure', level: 3 },
  { id: 'prerequisites', title: 'Prerequisites', level: 3 },
  { id: 'cloning-the-repository', title: 'Cloning the Repository', level: 3 },
  { id: 'environment-variables', title: 'Environment Variables', level: 3 },
  { id: 'backend-setup', title: 'Backend Setup', level: 3 },
  { id: 'frontend-setup', title: 'Frontend Setup', level: 3 },
];

const TableOfContents = ({ sections }) => {
  const [activeSection, setActiveSection] = useState('');

  const handleScroll = () => {
    let current = '';
    sections.forEach((section) => {
      const element = document.getElementById(section.id);
      if (element) {
        const rect = element.getBoundingClientRect();
        if (rect.top <= 100) {
          current = section.id;
        }
      }
    });
    setActiveSection(current);
  };

  useEffect(() => {
    window.addEventListener('scroll', handleScroll);
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (id) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
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
                section.level === 2 ? '0' :
                section.level === 3 ? '12px' :
                section.level === 4 ? '24px' : '0',
            }}
          >
            <button
              type="button"
              className={styles.tocLink}
              onClick={() => scrollToSection(section.id)}
            >
              {section.title}
            </button>
          </li>
        ))}
      </ul>
    </nav>
  );
};

function DocContentV3() {
  return (
    <>
      <h1 id="mic-v3">MIC v3.0.0</h1>

      <h2 id="introduction">What is Map in Color?</h2>
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

      <h2 id="getting-started">Getting Started</h2>
      <h3 id="start-creating-immediately">Start Creating Immediately</h3>
      <p>
        You do not need an account to begin creating a map. Simply open the <Link to="/playground">Playground</Link> to access the map editor and start uploading your data. The playground allows you to explore all core creation features without signing in.
      </p>
      <h3 id="saving-your-map">Saving Your Map</h3>
      <p>
        To save, publish, download, or share a map, you must be logged in.
      </p>
      <p>
        If you create a map in the playground and later decide to sign up, your current map session will not be lost. Map in Color temporarily stores your map data locally. After signing in or <Link to="/signup">creating an account</Link>, you will be redirected to the <code>/create</code> session where your previous map configuration remains available. This ensures a seamless transition from exploration to ownership.
      </p>
      <h3 id="creating-an-account">Creating an Account</h3>
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

      <h2 id="map-types">Map Types</h2>
      <p>
        Map in Color supports two types of maps: <strong>Choropleth</strong> and <strong>Categorical</strong>. The system automatically detects the appropriate type based on your data, but you can manually switch between them at any time.
      </p>

      <h3 id="choropleth-maps">Choropleth Maps</h3>
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
        Map in Color includes a built-in system for automatically generating data ranges based on the distribution of your dataset. The algorithm:
      </p>
      <ul>
        <li>Extracts all valid numeric values and sorts the data</li>
        <li>Determines an appropriate number of bins using the Freedman–Diaconis rule (based on interquartile range and dataset size), with Sturges&apos; formula as a fallback baseline</li>
        <li>Clamps the number of ranges to a sensible UI range (typically 3–9 bins)</li>
        <li>Chooses between quantile-based bins (balanced counts per range) when values are highly duplicated or uneven, and equal-width bins when the distribution is more continuous</li>
        <li>Applies &quot;nice&quot; rounding to create human-friendly boundaries (e.g., 0–10 instead of 0–9.8732)</li>
      </ul>
      <p>
        This ensures that automatically generated ranges reflect the actual distribution of the data, avoid overly narrow or unusable bins, and produce readable legend labels. If all values are equal, a single range is generated.
      </p>
      <h4 id="manual-range-control">Manual Range Control</h4>
      <p>Users can add new ranges, remove ranges, edit lower and upper bounds manually, rename ranges, and adjust colors for each range. Countries are assigned to ranges based on their numerical value—if a value falls within a defined lower and upper bound, it will automatically appear in that range. By default, range labels are numeric (e.g., 0.1 – 0.5), but users can define custom range names.</p>
      <h4 id="color-customization">Color Customization</h4>
      <p>
        For choropleth maps, users can choose a base color (which automatically generates a light-to-dark gradient), select from predefined Map in Color themes, or manually set custom colors for each range. The gradient system ensures that lower values appear lighter and higher values appear darker, creating a clear visual hierarchy.
      </p>

      <h3 id="categorical-maps">Categorical Maps</h3>
      <p>Categorical maps are used for classification data. Examples:</p>
      <ul>
        <li>World Cup winners</li>
        <li>EU membership</li>
        <li>Driving side (left/right)</li>
        <li>Income level groups</li>
      </ul>
      <p>Instead of numerical ranges, categorical maps assign countries to named groups.</p>
      <h4 id="creating-categories">Creating Categories</h4>
      <p>
        Users create categories by adding entries to the category table. Each category includes a custom name and a custom color. Countries can then be manually assigned to any category.
      </p>
      <h4 id="handling-unassigned-countries">Handling Unassigned Countries</h4>
      <p>
        Users can optionally create a category for unassigned countries. This is useful when only part of the dataset belongs to a defined group and the remaining countries should share a common classification (e.g., &quot;Not Applicable&quot; or &quot;Never Won&quot;).
      </p>
      <h4 id="visual-control">Visual Control</h4>
      <p>
        Each category has a fixed color. Unlike choropleth maps, categorical maps do not use gradients—they use distinct color blocks to represent discrete groups. This makes categorical maps ideal for binary or multi-group classifications.
      </p>

      <h3 id="map-types-summary">Summary</h3>
      <ul>
        <li><strong>Choropleth</strong> → Best for numerical data and continuous values</li>
        <li><strong>Categorical</strong> → Best for classification and grouped data</li>
      </ul>
      <p>Map in Color automatically detects the appropriate type, but users retain full control over how their data is structured and displayed.</p>

      <h2 id="data-format-guide">Data Format Guide</h2>
      <p>
        Map in Color includes a smart data uploader that analyzes your file, matches rows to countries, and automatically determines whether your data should be interpreted as a choropleth (numeric) or categorical (text) map.
      </p>
      <p><strong>Supported file types:</strong></p>
      <ul>
        <li>CSV (.csv)</li>
        <li>TSV (.tsv)</li>
        <li>Excel (.xlsx, .xls)</li>
        <li>Plain text (.txt, treated like CSV/TSV)</li>
      </ul>
      <p>
        You can upload incomplete datasets. If some rows cannot be matched or parsed, Map in Color will skip invalid lines and import the rest, while showing warnings and errors in the import log.
      </p>

      <h3 id="smart-upload">How the Smart Upload Works</h3>
      <p>When you upload a file, Map in Color performs these steps:</p>
      <p><strong>1) Read and normalize the data</strong></p>
      <p>Each cell is cleaned before processing: trims whitespace, removes BOM characters (common in exported files), handles quoted CSV values (including escaped quotes), and supports decimal commas (&quot;12,5&quot; → 12.5).</p>
      <p><strong>2) Parse the file format</strong></p>
      <p>The uploader automatically parses CSV (including semicolon-separated, common in European exports), TSV (tab-separated), and Excel (first sheet converted to rows). Comment lines starting with <code>#</code> are ignored.</p>
      <p><strong>3) Match rows to countries (smart country detection)</strong></p>
      <p>Each row is matched against the Map in Color country dataset using ISO country codes (e.g., US, IS, DE), country names, and aliases (alternate spellings and official names). For example, Turkey matches: Türkiye, Republic of Türkiye, Turkiye. This allows the uploader to handle real-world datasets where country naming varies.</p>
      <p><strong>4) Detect the file structure</strong></p>
      <p>Map in Color supports two common data layouts:</p>
      <p><strong>A) Simple 2-column layout (most common)</strong></p>
      <p>The uploader expects at least two columns: Column 1 — country name or code; Column 2 — numeric value or category label.</p>
      <p>Example (numeric → choropleth):</p>
      <pre className={styles.codeBlock}>
        {`Country,Value
Iceland,99.3
Spain,95.1
Brazil,89.7`}
      </pre>
      <p>Example (text → categorical):</p>
      <pre className={styles.codeBlock}>
        {`Country,Category
Brazil,Winner
Spain,Winner
Iceland,Never won`}
      </pre>
      <p><strong>B) Wide &quot;year columns&quot; layout (World Bank / WDI-style)</strong></p>
      <p>Some datasets include many year columns. Map in Color detects this by looking for a header row with &quot;Country Name&quot;, &quot;Country Code&quot;, and one or more year columns (e.g., 1960, …, 2024). In wide format files, Map in Color will match each row to a country, scan from the latest year backwards, pick the most recent available numeric value for that country, and store the chosen year internally. This makes it possible to upload World Bank indicator files directly without manually filtering to a single year.</p>
      <p><strong>Automatic Map Type Detection</strong></p>
      <p>After parsing, Map in Color determines the map type: if the value column is numeric → Choropleth; if the value column is text → Categorical. If the file contains mixed numeric and text rows, Map in Color defaults to choropleth and allows a manual switch. When mixed data is detected, the import modal shows an &quot;Interpret as&quot; selector so you can override the automatic decision.</p>
      <p><strong>Import Log, Warnings, and Errors</strong></p>
      <p>During import, Map in Color displays an import log showing file reading, matches, detection, and results. Common warnings and errors include: country not found (invalid name or code), missing value in the second column, no numeric values found (for choropleth imports), and rows skipped due to parsing problems. Even when errors occur, Map in Color will still import valid rows and report how many lines were ignored.</p>
      <p><strong>Country Naming Tips</strong></p>
      <p>Recommended: ISO codes (e.g., IS, DE, BR) and standard English country names. Also supported: local spellings and alternate forms (aliases) when available. If a row fails to match, check spelling, extra spaces, punctuation, and whether the name is a common alternate form.</p>
      <p><strong>Notes</strong></p>
      <p>Map in Color currently supports the world map dataset. Import behavior is designed to be fault-tolerant: invalid rows are skipped, and the remainder is imported successfully.</p>
  
      <h2 id="ownership-privacy-sharing">Ownership, Privacy, and Sharing</h2>
      <p>Map in Color gives creators full control over their maps and profile visibility.</p>
      <h3 id="map-ownership">Map Ownership</h3>
      <p>Every saved map belongs to its creator. The creator can edit the map at any time, change its visibility (public or private), and delete the map. Map ownership is tied to the user account that created it.</p>
      <h3 id="map-visibility">Map Visibility</h3>
      <p><strong>Public Maps</strong> — Public maps are visible to all users on Map in Color. Other users can view the map, share the map link, embed the map (if embedding is enabled), and download exported versions (if available). Public maps may also appear in search and explore sections.</p>
      <p><strong>Private Maps</strong> — Private maps are visible only to the creator. They do not appear in search or explore, cannot be viewed by other users, and can still be exported by the creator.</p>
      <h3 id="embedding-maps">Embedding Maps</h3>
      <p>Maps can be embedded on external websites using an iframe. <strong>Public embeds</strong>: public maps can be embedded directly. <strong>Private embeds (Pro Feature)</strong>: embedding a private map requires a valid access token in the iframe URL. If the token is missing or invalid, the embedded map will not be displayed. This ensures that private maps remain secure while still allowing controlled external use.</p>
      <h3 id="profile-privacy-settings">Profile Privacy Settings</h3>
      <p>Users can control what appears on their public profile under Privacy Settings:</p>
      <ul>
        <li><strong>Profile Visibility</strong> — Control who can view your profile. Setting visibility to &quot;Only Me&quot; disables all public profile display options.</li>
        <li><strong>Show Saved Maps</strong> — Allow others to see the maps you have saved.</li>
        <li><strong>Show Activity Feed</strong> — Display your recent activity (such as created maps or interactions).</li>
        <li><strong>Show Location</strong> — Display your location on your profile.</li>
        <li><strong>Show Date of Birth</strong> — Display your date of birth on your profile.</li>
        <li><strong>Star Notifications</strong> — Notify others when you star a map.</li>
      </ul>
      <p>These settings allow users to balance visibility and privacy according to their preferences.</p>

      <h2 id="explore-community">Explore & Community</h2>
      <p>Map in Color includes a public explore space where users can discover and interact with maps created by others.</p>
      <h3 id="browsing-without-an-account">Browsing Without an Account</h3>
      <p>Anyone can explore public maps without signing in. Unsigned visitors can view public maps, see map details and descriptions, view discussions and comments, browse tags, search for maps, and sort maps. However, certain actions require an account.</p>
      <h3 id="features-that-require-login">Features That Require Login</h3>
      <p>To interact with maps, users must be signed in. Signed-in users can star maps, download maps (if allowed), embed maps on external websites, comment on maps, and reply to other comments. This ensures meaningful engagement while keeping exploration open.</p>
      <h3 id="search-and-discovery">Search and Discovery</h3>
      <p>The Explore page includes:</p>
      <ul>
        <li><strong>Tags</strong> — Maps can include tags. Users can filter maps by selecting specific tags.</li>
        <li><strong>Search</strong> — Users can search maps by title, description, tags, and creator username.</li>
        <li><strong>Sorting</strong> — Maps can be sorted by <em>Newest</em> (recently published), <em>Most Starred</em> (highest total star count), and <em>Trending</em> (highest number of stars received in the past 3 days). Trending highlights recently popular maps based on short-term activity.</li>
      </ul>

      <h2 id="faq">FAQ</h2>
      <p><strong>1. Do I need an account to create a map?</strong><br />No. You can start creating immediately in the playground. An account is only required to save, publish, download, or embed your map.</p>
      <p><strong>2. What file formats are supported?</strong><br />Map in Color supports CSV, TSV, XLSX, and XLS. The uploader automatically analyzes your file and matches rows to countries.</p>
      <p><strong>3. What happens if some rows in my file are invalid?</strong><br />Invalid rows are skipped during import. You can review warnings and errors in the import log to fix issues if needed.</p>
      <p><strong>4. How does Map in Color detect map type?</strong><br />If your values are numeric, the map is treated as a choropleth. If your values are text-based, it is treated as categorical. If mixed data is detected, you can manually choose the interpretation.</p>
      <p><strong>5. Can I edit my map after publishing?</strong><br />Yes. Maps can be edited at any time by their creator.</p>
      <p><strong>6. What is the difference between public and private maps?</strong><br />Public maps are visible to everyone and can appear in Explore. Private maps are only visible to the creator.</p>
      <p><strong>7. Can I embed maps on my own website?</strong><br />Yes. Public maps can be embedded directly. Private embeds require a valid access token (Pro feature).</p>
      <p><strong>8. How are trending maps calculated?</strong><br />Trending maps are based on the number of stars received within the past 3 days.</p>
      <p><strong>9. Can I use Map in Color for commercial purposes?</strong><br />Yes, depending on your usage and subscription level. Refer to the <Link to="/terms">Terms of Service</Link> for full details.</p>
      <p><strong>10. Is my data stored when I use the playground?</strong><br />Maps created in the playground are temporarily stored locally in your session. They are only permanently saved once you <Link to="/signup">create an account</Link> and choose to save them.</p>
    </>
  );
}

function DocContentV2() {
  return (
    <>
          {/* Title */}
          <h1>MIC MVP Release v2.0.0</h1>

          {/* Introduction */}
          <h2 id="introduction">Introduction</h2>
          <p>
          Map in Color (MIC) is an open-source platform designed to transform your geographical data into dynamic choropleth maps. Whether you’re a researcher, a data journalist, or simply curious about geographical patterns, MIC enables you to upload CSV files, define ranges, and create color-coded maps of the World, the United States, or Europe in just a few steps.
          </p>
          <p>
          Beyond visualization, MIC offers a built-in sharing platform that encourages collaboration and community engagement. By setting your map to public, you can showcase it on our Explore page for others to discover, star, and comment on—fostering new insights and conversations around the data. If you prefer to work privately, you can keep your maps hidden from the public eye and still enjoy all the core features.
          </p>
          <p>This MVP release features:</p>
          <ul>
            <li>
              A <em>set of three maps</em> (World Map, United States, and
              Europe) – with more to be added over time.
            </li>
            <li>
              The ability to <em>instantly generate data ranges</em> with
              ease (either suggested or manually defined).
            </li>
            <li>
              A <em>sharing platform</em> with tags for potential future
              data collection across diverse subjects, browsable via an <em>explore</em> page.
            </li>
            <li>
              <em>Public or private</em> map settings for each user’s
              preference.
            </li>
            <li>
              User profiles that allow <em>personal info</em>, <em>stars</em>,
              and <em>comments</em> on maps.
            </li>
          </ul>

          <h2 id="quick-start">Quick Start (For Users)</h2>
          <p>
            To get started, go to{' '}
            <a
              href="https://mapincolor.com/signup"
              target="_blank"
              rel="noopener noreferrer"
            >
              mapincolor.com/signup
            </a>{' '}
            and sign up for an account. Fill in your details, create a secure
            password, and complete the registration process. Once your account
            is successfully created, you will be taken to the Dashboard for the
            first time.
          </p>

          <h3 id="creating-your-first-map">Creating Your First Map</h3>
          <p>
            To create your first map, navigate through either the sidebar or the
            header and click "Create New Map." This will bring up a selection of
            different map templates. You can choose between a world map, a USA
            state map, or a European country map. Select the one that best suits
            your data and click "Create." This will take you to the Data
            Integration page, where you will upload your CSV file and begin
            customizing your visualization.
          </p>

          <h3 id="data-integration">Data Integration</h3>
          <p>
            At this stage, you will need to upload your prepared CSV file (see
            formatting details below). The system will read your data and allow
            you to define ranges—either by manually entering values or using the
            "Suggest Range" feature to generate them automatically. Once your
            ranges are set, you can assign names to them, such as "Low,"
            "Medium," and "High," or any other categories relevant to your data.
            You will also be able to customize the map’s colors by selecting
            individual shades for each range or using pre-defined color
            palettes.
          </p>
          <p>
            In addition to setting ranges, you can fine-tune the visual aspects
            of your map. Adjust the theme by modifying the ocean color,
            unassigned state color, and other stylistic elements to make your
            map more visually appealing.
          </p>
          <p>
            The final step in this section is filling out the map details. You
            can add a title, a description explaining what your data represents,
            relevant tags to categorize your map, and references to credit the
            data sources.
          </p>

          <h3 id="saving-and-sharing">Saving and Sharing</h3>
          <p>
            Once your map is complete, you can choose whether to keep it private
            or make it public. Private maps will only be visible to you and will
            not appear on your profile or in the explore section. Public maps,
            on the other hand, can be viewed by other users, who will be able to
            interact with, star, and comment on them.
          </p>
          <p>
            When you’re ready, click “Save Map.” Your map will be added to your
            collection, where you can access it anytime to make edits or
            updates. From there, you can explore other users' maps, save your
            favorites, and engage with the community by leaving comments and
            feedback.
          </p>

          {/* How to Create and Edit Maps */}
          <h2 id="how-to-create-and-edit-maps">How to Create and Edit Maps</h2>

          <h3 id="csv-template">CSV Template</h3>

          <p>
            When you navigate to the Data Integration page,
            have your CSV file ready. It must contain{' '}
            <strong>exactly two columns</strong>:
          </p>

          <p>Example:</p>
          <pre className={styles.codeBlock}>
            {`Country/State Name,Value
State1,Value1
State2,Value2
...`}
          </pre>

          <small>If value of a row is missing, the state will be ignored.</small>
          <p>
            We support <em>case-insensitive</em> matching and also recognize
            a variety of <em>aliases</em>. This means your CSV entries do not
            have to match the exact casing or single “official” name; for
            instance, <code>Holland</code>, <code>the netherlands</code>, or 
            <code> NL</code> will all correctly map to the Netherlands.
          </p>

          <p>
            For convenience and accuracy, you can still download a starter CSV
            template (which uses one possible uppercase variant) below. 
          </p> 

          <ul>
            <li>
              <button onClick={() => downloadTemplate('world')}>
                Download World Map CSV Template
              </button>
            </li>

            <li>
            <button onClick={() => downloadTemplate('usa')}>
                Download USA Map CSV Template
              </button>
            </li>

            <li>
            <button onClick={() => downloadTemplate('europe')}>
                Download Europe Map CSV Template
              </button>
            </li>
          </ul>

          <p>
            You may
            also wish to download the JSON files to see all
            known codes and aliases if you need more flexibility in naming.
          </p>

          <ul>
            <li>
              
              <button onClick={() => downloadJson('world')}>
                Download World Countries JSON
              </button>
            </li>
            <li>
             
              <button onClick={() => downloadJson('usa')}>
                Download U.S. States JSON
              </button>
            </li>
            <li>
              
              <button onClick={() => downloadJson('europe')}>
                Download European Countries JSON
              </button>
            </li>
          </ul>

          <p>
            If you notice that we are missing an alias for a country, state, or
            region (e.g., historical name, local language variant, or alternate
            spelling), please reach out to us at{' '}
            <a href="mailto:hello@mapincolor.com">hello@mapincolor.com</a> or
            feel free to open a pull request on our GitHub repository:{' '}
            <a
              href="https://github.com/helgarfri/map-in-color"
              target="_blank"
              rel="noreferrer"
            >
              map-in-color
            </a>
            . We’ll be happy to add it in!
          </p>

          {/* Error Handling */}
          <h3 id="error-handling">Error Handling</h3>
          <p>
            If a state or country name isn’t recognized or the file is invalid,
            an error log will be displayed, showing the line number and the
            specific issue:
          </p>
          <img
            src="/docs/error.png"
            alt="Error Log Example"
            className={styles.docImage}
          />
          <p>
            After identifying the error and its location, you can modify your
            file and reupload the CSV until you achieve a successful submission.
            You can also download the error log, which can be especially useful
            if you have a large number of errors to review in a single file.
          </p>

          {/* Defining Ranges */}
          <h3 id="defining-ranges">Defining Ranges</h3>
          <p>
            When defining ranges, you have two options: manually setting them or
            letting the system suggest them based on your data. Suggested ranges
            are calculated automatically from the values in your CSV, while
            manual ranges allow you to set your own upper and lower bounds for
            each category.
          </p>
          <ul>
            <li>
              <strong>Manual:</strong> Enter the lower and upper limits for each
              range according to your preference.
            </li>
            <li>
              <strong>Auto-Generate:</strong> Specify the number of ranges you
              want and click “Suggest Range” to let the system divide your data
              accordingly.
            </li>
          </ul>
          <p>
            After defining your ranges, you can assign names to each one. These
            names will be displayed on the map, making it easier to interpret
            the data. For example, if you have three ranges, you could name them
            Low, Medium, and High, or choose labels that better fit your
            dataset.
          </p>
          <p>
            Once the ranges are set, you can customize their appearance by
            selecting colors for each category. You can either pick individual
            colors manually or use one of the pre-defined color palettes. When
            you’re satisfied with your selections, clicking "Generate Groups"
            will update the map with the chosen ranges. If you want to tweak
            anything, you can always regenerate the groups and adjust them until
            they match your vision.
          </p>
          <img
            src="/docs/range_buttons.png"
            alt="Range Buttons Example"
            className={styles.docImage}
          />

          <h3 id="naming-and-coloring">Naming and Coloring</h3>
          <p>
            In addition to defining numerical ranges, you can customize the
            visual representation of your data. Naming the ranges gives them
            clearer meaning, and selecting colors enhances the readability of
            the map. You can experiment with different color schemes until you
            find one that best highlights the differences in your data. Once
            everything looks right, generating the groups will apply these
            settings to your map.
          </p>

          {/* Theme and Final Settings */}
          <h3 id="theme-and-final-settings">Theme and Final Settings</h3>
          <p>
            Once the ranges are in place, you can adjust the overall appearance
            of your map. This includes modifying the ocean color, changing the
            color for unassigned states, and refining the general aesthetic.
            These small adjustments help ensure that your map is both visually
            appealing and easy to interpret.
          </p>
          <img
            src="/docs/map_theme.png"
            alt="Theme Settings Example"
            className={styles.docImage}
          />
          <p>
            The last step before saving is filling out the map details. This
            includes adding a title, a description explaining what the data
            represents, and any relevant tags that help with categorization. If
            your data comes from a specific source, you can add references so
            that viewers know where the information originates from.
          </p>
          <p>
            You also have the option to decide whether your map should be
            private or public. Private maps will only be visible to you and will
            not appear on your profile or the explore page. If you choose to
            share your map publicly, others will be able to view, interact with,
            and comment on it.
          </p>
          <img
            src="/docs/map_details.png"
            alt="Map Details Example"
            className={styles.docImage}
          />
          <p>
            Once everything is set, clicking “Save Map” will store it in your
            collection. You can return at any time to edit, refine, or update it
            as needed. After saving, you can also explore other users' maps,
            save your favorites, and engage with the community by leaving
            comments and feedback.
          </p>

        
          <h2 id="setup-installation">Setup & Installation (For devs)</h2>
          <p>
            We welcome contributions. If you want to set up the project for
            contribution purposes, here are the instructions for setting up the
            project:
          </p>

          <h3 id="project-structure">Project Structure</h3>
          <pre className={styles.codeBlock}>
            {`map-in-color/
│── app-backend/        # Backend code (Node.js + Supabase)
│── src/                # Frontend (React)
│── public/             # Static assets
│── package.json        # Dependencies and scripts
│── README.md           # Project documentation`}
          </pre>

          <h3 id="prerequisites">Prerequisites</h3>
          <p>To run this project, make sure you have the following installed:</p>
          <ul>
            <li>Node.js (Recommended: LTS version)</li>
            <li>npm (Comes with Node.js)</li>
            <li>Git (For cloning the repository)</li>
            <li>Supabase account (Optional, for database access)</li>
          </ul>

          <h3 id="cloning-the-repository">Cloning the Repository</h3>
          <p>To get started, clone the repository on your local machine:</p>
          <pre className={styles.codeBlock}>
            {`git clone https://github.com/helgarfri/map-in-color.git
cd map-in-color`}
          </pre>

          <h3 id="environment-variables">Environment Variables</h3>
          <p>Developers need to configure environment variables to run the backend.</p>
          <p>Create a <code>.env</code> file in the root directory and add:</p>
          <pre className={styles.codeBlock}>
            {`SUPABASE_URL=your-supabase-url
SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key`}
          </pre>

          <p>
            <strong>Note: </strong>you can only access the database if you have
            authorization to do so. If not, you need to use your own dummy
            database.
          </p>

          <h3 id="backend-setup">Backend Setup</h3>
          <p>Guide to starting the backend server.</p>
          <pre className={styles.codeBlock}>
            {`cd app-backend
npm install
node server.js`}
          </pre>
          <p>
            The backend will now be running, handling requests from the
            frontend.
          </p>

          <h3 id="frontend-setup">Frontend Setup</h3>
          <p>To start the frontend, follow these steps:</p>
          <pre className={styles.codeBlock}>
            {`cd src
npm install
npm start`}
          </pre>
          <p>
            This should launch the app on{' '}
            <a href="http://localhost:3000">http://localhost:3000</a>.
          </p>

          <hr />
          <p>
            The platform is designed to make data visualization interactive and
            customizable, allowing you to explore new perspectives and share
            insights with others. Whether you're mapping statistical data,
            geographic trends, or personal research, you have full control over
            how your map is presented and shared.
          </p>
        </>
  );
}

// ——— Docs layout (header + outlet + footer) for nested routes ———
export function DocsLayout() {
  return (
    <div className={styles.documentationContainer}>
      <HomeHeader />
      <div className={styles.docsBody}>
        <Outlet />
      </div>
      <HomeFooter />
    </div>
  );
}

// ——— Doc topic cards for /docs landing ———
const DOC_CARDS = [
  { slug: 'introduction', title: 'Introduction', subtitle: 'What is Map in Color? · Who is it for?' },
  { slug: 'getting-started', title: 'Getting Started', subtitle: 'Start Creating Immediately · Saving Your Map · Creating an Account' },
  { slug: 'creating-maps', title: 'Creating Maps', subtitle: 'Map Types · Choropleth · Categorical · Ranges · Colors' },
  { slug: 'data-import', title: 'Data Import', subtitle: 'Data Format Guide · Smart Upload · File Types · Common Errors' },
  { slug: 'ownership-sharing', title: 'Ownership & Sharing', subtitle: 'Map Ownership · Public vs Private · Embedding · Profile Privacy' },
  { slug: 'explore-community', title: 'Explore & Community', subtitle: 'Browsing · Interactions · Search & Tags · Trending' },
];

export function DocsLanding() {
  return (
    <div className={styles.docsLandingWrap}>
      <div className={styles.docsLandingInner}>
        <h1 className={styles.docsLandingTitle}>Documentation</h1>
        <p className={styles.docsLandingLead}>MIC v3.0.0 — choose a topic to get started.</p>
        <div className={styles.docsCardGrid}>
          {DOC_CARDS.map((card) => (
            <Link key={card.slug} to={`/docs/${card.slug}`} className={styles.docCard}>
              <span className={styles.docCardNumber}>{DOC_CARDS.indexOf(card) + 1}</span>
              <h2 className={styles.docCardTitle}>{card.title}</h2>
              <p className={styles.docCardSubtitle}>{card.subtitle}</p>
            </Link>
          ))}
        </div>
        <div className={styles.docsLandingFAQ}>
          <Link to="/faq" className={styles.docCard}>
            <span className={styles.docCardNumber}>?</span>
            <h2 className={styles.docCardTitle}>FAQ</h2>
            <p className={styles.docCardSubtitle}>Frequently asked questions</p>
          </Link>
        </div>
      </div>
    </div>
  );
}

// ——— Single doc topic page (sidebar TOC + content) ———
export function DocPage() {
  const { topic } = useParams();
  const config = topic ? DOC_TOPICS[topic] : null;
  if (!config) return <Navigate to="/docs" replace />;
  const { title, sections, Content } = config;
  return (
    <div className={styles.docsWrapper}>
      <aside className={styles.docsSidebar}>
        <nav className={styles.docTopicNav} aria-label="Docs">
          <Link to="/docs" className={styles.docBackLink}>← All docs</Link>
        </nav>
        <DocTopicTOC sections={sections} />
      </aside>
      <div className={styles.docsMainWrap}>
        <main className={styles.docsMain}>
          <h1 id="page-title">{title}</h1>
          <Content />
        </main>
      </div>
    </div>
  );
}

// Legacy: single-page docs with version switcher (kept for possible /docs/legacy)
function Docs() {
  const [docVersion, setDocVersion] = useState('v3');
  return (
    <div className={styles.documentationContainer}>
      <HomeHeader />
      <div className={styles.docsWrapper}>
        <aside className={styles.docsSidebar}>
          <div className={styles.docHistory}>
            <span className={styles.docHistoryLabel}>Doc history</span>
            {DOC_VERSIONS.map((v) => (
              <button
                key={v.id}
                type="button"
                className={`${styles.docVersionLink} ${docVersion === v.id ? styles.docVersionLinkActive : ''}`}
                onClick={() => setDocVersion(v.id)}
              >
                {v.label}{v.active ? ' · current' : ''}
              </button>
            ))}
          </div>
          <TableOfContents sections={docVersion === 'v3' ? sectionsV3 : sectionsV2} />
        </aside>
        <div className={styles.docsMainWrap}>
          <main className={styles.docsMain}>
            {docVersion === 'v3' ? <DocContentV3 /> : <DocContentV2 />}
          </main>
        </div>
      </div>
      <HomeFooter />
    </div>
  );
}

export default DocsLayout;
