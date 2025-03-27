// src/components/Docs.js

import React, { useState, useEffect } from 'react';
import HomeHeader from './HomeHeader';
import HomeFooter from './HomeFooter';
import styles from './Docs.module.css';

// Make sure these JSON files exist in src/ with these exact names
import countryCodes from '../world-countries.json';
import usStatesCodes from '../united-states.json';
import euCodes from '../european-countries.json';

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

// Table of contents configuration
const sections = [
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

const TableOfContents = () => {
  const [activeSection, setActiveSection] = useState('');

  const handleScroll = () => {
    let current = '';
    sections.forEach((section) => {
      const element = document.getElementById(section.id);
      if (element) {
        const rect = element.getBoundingClientRect();
        // Adjust "100" if needed for earlier/later activation
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
    <nav className={styles.tocContainer}>
      <ul className={styles.tocList}>
        {sections.map((section) => (
          <li
            key={section.id}
            className={`${styles.tocItem} ${activeSection === section.id ? styles.active : ''}`}
            style={{ marginLeft: section.level === 3 ? '20px' : '0' }}
          >
            <button onClick={() => scrollToSection(section.id)}>
              {section.title}
            </button>
          </li>
        ))}
      </ul>
    </nav>
  );
};

export default function Docs() {
  return (
    <div className={styles.documentationContainer}>
      <HomeHeader />
      <div className={styles.docsWrapper}>
        <aside className={styles.docsSidebar}>
          <h2>Documentation</h2>
          <TableOfContents />
        </aside>

        <main className={styles.docsMain}>
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
        </main>
      </div>
      <HomeFooter />
    </div>
  );
}
