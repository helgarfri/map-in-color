// src/components/HomeDocs.js

import React from 'react';
import HomeHeader from './HomeHeader';
import HomeFooter from './HomeFooter';
import styles from './HomeDocs.module.css';

export default function HomeDocs() {
  return (
    <div className={styles.documentationContainer}>
      <HomeHeader />

      <main className={styles.docsMain}>
        {/* Title */}
        <h1>MIC MVP Release v2.0.0-beta</h1>

         {/* Download PDF Section (if you still want it) */}
         <h2>Download PDF</h2>
        <p>
          If you prefer reading the LaTeX/PDF version of this documentation, click
          the link below:
        </p>
        <a href="/docs/docs.pdf" target="_blank" rel="noopener noreferrer">
          Open the Documentation PDF
        </a>


        {/* Introduction */}
        <h2>Introduction</h2>
        <p>
          This is a MVP release of a brand new version of <strong>Map in Color
          (MIC) v2.0.0-beta</strong>, a tool for creating <strong>choropleth
          maps</strong> to visualize data—whether for scientific purposes or
          simply to see the world from a new perspective through data.
        </p>
        <p>
          With the new version, the application includes more complexity and a
          sharing platform where data can be shared between users. Instead of
          manually selecting and defining states from select inputs (as seen in
          v1), you prepare a CSV file locally with all the data for the map,
          ensuring simplicity.
        </p>
        <p>
          This MVP release features:
        </p>
        <ul>
          <li>
            A <strong>set of three maps</strong> (World Map, United States, and
            Europe) – with more to be added over time.
          </li>
          <li>
            The ability to <strong>instantly generate data ranges</strong> with
            ease (either suggested or manually defined).
          </li>
          <li>
            A <strong>sharing platform</strong> with tags for potential future
            data collection across diverse subjects, browsable via an{" "}
            <em>explore</em> page.
          </li>
          <li>
            <strong>Public or private</strong> map settings for each user’s
            preference.
          </li>
          <li>
            User profiles that allow <strong>personal info</strong>,{" "}
            <strong>stars</strong>, and <strong>comments</strong> on maps.
          </li>
        </ul>

        {/* Quick Start */}
        <h2>Quick Start (For Users)</h2>
        <ol>
          <li>
            <strong>Sign Up</strong><br />
            Go to <em>mapincolor.com</em> and fill out the sign-up form. After a
            successful registration, you will be taken to your <strong>Dashboard</strong>.
          </li>
          <li>
            <strong>Create Your First Map</strong>
            <ul>
              <li>
                Use the sidebar or header to click <strong>“Create New Map.”</strong>
              </li>
              <li>
                Select which map template you want (World, USA, or Europe) in the pop-up.
              </li>
              <li>
                Click <strong>“Create”</strong>. You will be taken to the{" "}
                <strong>Data Integration</strong> page.
              </li>
            </ul>
          </li>
          <li>
            <strong>Data Integration</strong>
            <ul>
              <li>Prepare your CSV file (see details below) and upload it.</li>
              <li>
                Define data ranges (either by manual input or by generating
                suggested ranges).
              </li>
              <li>
                Adjust colors and theme settings (ocean color, unassigned states,
                etc.).
              </li>
              <li>
                Fill out <strong>map details</strong> (title, description, tags,
                references).
              </li>
            </ul>
          </li>
          <li>
            <strong>Save &amp; Share</strong>
            <ul>
              <li>Choose <strong>public</strong> or <strong>private</strong> for your map.</li>
              <li>Click <strong>“Save Map.”</strong></li>
              <li>
                You can now view or edit your map from your collection, explore
                other maps, star, and comment.
              </li>
            </ul>
          </li>
        </ol>

        <hr />

        {/* How to Create and Edit Maps */}
        <h2>How to Create and Edit Maps</h2>
        <p>
          When you navigate to the <strong>Data Integration</strong> page, have
          your CSV file ready. It must contain <strong>exactly two columns</strong>:
        </p>
        <ol>
          <li>Country/State Name</li>
          <li>Value</li>
        </ol>
        <blockquote>
          <strong>No values can be empty.</strong>
        </blockquote>
        <p>
          <strong>Example:</strong>
        </p>
        <pre className={styles.codeBlock}>
{`Country/State Name,Value
State1,Value1
State2,Value2
...`}
        </pre>

        {/* Possibly referencing a stats or valid image after successful upload */}
        <p>
          If your CSV is successfully uploaded, you might see summary
          <em> statistics </em> about the file. Example:
        </p>
        <img
          src="/docs/stats.png"
          alt="Statistics Example"
          className={styles.docImage}
        />

        {/* Error Handling */}
        <h3>Error Handling</h3>
        <p>
          If a state name isn’t recognized or the file is invalid, you’ll see an{" "}
          <strong>error log</strong> showing the line number and the issue:
        </p>
        <img
          src="/docs/error.png"
          alt="Error Log Example"
          className={styles.docImage}
        />
        <p>
          Fix any errors and re-upload until you see a success message, such as:
        </p>
        <img
          src="/docs/valid.png"
          alt="Valid CSV Example"
          className={styles.docImage}
        />

        {/* Defining Ranges */}
        <h3>Defining Ranges</h3>
        <p>
          <strong>Suggested vs. Manual</strong>
        </p>
        <ul>
          <li>
            <strong>Manual</strong>: Type in your lower and upper bounds for each
            range.
          </li>
          <li>
            <strong>Auto-Generate</strong>: Specify how many ranges you want and
            click <strong>“Suggest range.”</strong>
          </li>
        </ul>
        <p>
          For example, you can press certain buttons to define or suggest ranges:
        </p>
        <img
          src="/docs/range_buttons.png"
          alt="Range Buttons Example"
          className={styles.docImage}
        />

        <h3>Naming &amp; Coloring</h3>
        <p>
          Name each range (e.g., “Low,” “Medium,” “High,” etc.). Choose individual
          colors or use a provided <strong>color palette</strong>. Then click{" "}
          <strong>“Generate Groups”</strong> to update the map with the new ranges.
        </p>

        {/* Theme & Final Settings */}
        <h3>Theme &amp; Final Settings</h3>
        <p>
          You can adjust map details: <strong>ocean color</strong>,
          <strong> unassigned color</strong>, etc. For example:
        </p>
        <img
          src="/docs/map_theme.png"
          alt="Theme Settings Example"
          className={styles.docImage}
        />
        <p>
          Then fill out <strong>title</strong>, <strong>description</strong>,{" "}
          <strong>tags</strong>, <strong>references</strong>, and decide if the
          map is private or public:
        </p>
        <img
          src="/docs/map_details.png"
          alt="Map Details Example"
          className={styles.docImage}
        />
        <p>
          Finally, press <strong>“Save Map.”</strong> The map is now in your
          collection, and you can edit it anytime.
        </p>

        <hr />

        {/* Possibly mention user can do star, comment, etc. */}
        <p>
          Once saved, you can <strong>star</strong> (save) or <strong>comment</strong> on maps,
          explore other users’ public maps, and further customize your own.
        </p>

       
      </main>

      <HomeFooter />
    </div>
  );
}
