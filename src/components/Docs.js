// src/components/Docs.js
import React from 'react';

function Docs() {
  return (
    <div style={{ margin: '2rem' }}>
      <h1>MIC Documentation</h1>
      <p>
        Welcome to the MIC (Map in Color) documentation page. Here you can find
        all the information you need to get started with creating and sharing
        custom chloropleth maps from CSV files.
      </p>
      <hr />
      <h2>Download PDF</h2>
      <p>
        If you prefer reading the LaTeX/PDF version of the documentation, click
        the link below:
      </p>
      <a href="/docs/docs.pdf" target="_blank" rel="noopener noreferrer">
        Open the Documentation PDF
      </a>
      <hr />
      {/* 
        Alternatively, you can embed your PDF directly in an <iframe> or use 
        a PDF viewer library if you want to show the PDF inline.
      */}
    </div>
  );
}

export default Docs;
