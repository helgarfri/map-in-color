# Data Import

## Data Format Guide

Map in Color includes a smart data uploader that analyzes your file, matches rows to countries, and automatically determines whether your data should be interpreted as a choropleth (numeric) or categorical (text) map.

You can upload incomplete datasets. If some rows cannot be matched or parsed, Map in Color will skip invalid lines and import the rest, while showing warnings and errors in the import log.

## Smart Upload Detection

When you upload a file, Map in Color performs these steps:

**1) Read and normalize the data**

Each cell is cleaned before processing: trims whitespace, removes BOM characters (common in exported files), handles quoted CSV values (including escaped quotes), and supports decimal commas ("12,5" → 12.5).

**2) Parse the file format**

The uploader automatically parses CSV (including semicolon-separated, common in European exports), TSV (tab-separated), and Excel (first sheet converted to rows). Comment lines starting with `#` are ignored.

**3) Match rows to countries (smart country detection)**

Each row is matched against the Map in Color country dataset using ISO country codes (e.g., US, IS, DE), country names, and aliases (alternate spellings and official names). For example, Turkey matches: Türkiye, Republic of Türkiye, Turkiye.

**4) Detect the file structure**

Map in Color supports two common data layouts:

**A) Simple 2-column layout (most common)**

Column 1 — country name or code; Column 2 — numeric value or category label.

```
Country,Value
Iceland,99.3
Spain,95.1
Brazil,89.7
```

**B) Wide "year columns" layout (World Bank / WDI-style)**

Map in Color detects header rows with "Country Name", "Country Code", and year columns. It picks the most recent available numeric value per country.

**Automatic Map Type Detection**

If the value column is numeric → Choropleth; if text → Categorical. When mixed data is detected, the import modal shows an "Interpret as" selector so you can override.

## Supported File Types

- CSV (.csv)
- TSV (.tsv)
- Excel (.xlsx, .xls)
- Plain text (.txt, treated like CSV/TSV)

## Supported Country Coverage

Map in Color's world map aligns with the World Bank country dataset (WDI standard).

This includes:

- Sovereign states
- Select statistical territories commonly used in international datasets

Certain minor or uninhabited territories are not included as independent entities. Examples include:

- British Indian Ocean Territory
- Christmas Island
- Cocos Islands
- French Southern Territories
- Heard Island and McDonald Island
- Norfolk Island
- Pitcairn Islands
- South Georgia and the South Sandwich Islands
- Tokelau
- Wallis and Futuna

These territories are either:

- Not treated as standalone statistical units in major global datasets
- Administratively grouped under another country
- Uninhabited

If your dataset includes one of these, the uploader will skip the row and display a warning in the import log.

## Common Errors

During import, Map in Color displays an import log. Common warnings and errors include:

- **Country not found** — Invalid name or code; check spelling, extra spaces, and punctuation.
- **Missing value** — Empty or missing value in the second column.
- **No numeric values found** — For choropleth imports, the value column must contain numbers.
- **Rows skipped** — Parsing problems (e.g., encoding, malformed CSV).

Recommended: use ISO codes (e.g., IS, DE, BR) and standard English country names. Local spellings and aliases are supported when available. Invalid rows are skipped; the remainder is imported successfully.
