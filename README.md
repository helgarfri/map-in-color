# MIC MVP Release v2.0.0-beta

## Introduction

This is a MVP release of a brand new version of **Map in Color (MIC) v2.0.0-beta**, a tool for creating **choropleth maps** to visualize data—whether for scientific purposes or simply to see the world from a new perspective through data.

With the new version, the application includes more complexity and a sharing platform where data can be shared between users. Instead of manually selecting and defining states from select inputs (as seen in v1), you prepare a CSV file locally with all the data for the map, ensuring simplicity.

This MVP release features:

- A **set of three maps** (World Map, United States, and Europe) – with more to be added over time.
- The ability to **instantly generate data ranges** with ease (either suggested or manually defined).
- A **sharing platform** with tags for potential future data collection across diverse subjects, browsable via an _explore_ page.
- **Public or private** map settings for each user’s preference.
- User profiles that allow **personal info**, **stars**, and **comments** on maps.

## Quick Start (For Users)

1. **Sign Up**  
   Go to mapincolor.com and fill out the [sign-up form](https://mapincolor.com/signup). After a successful registration, you will be taken to your **Dashboard**.

2. **Create Your First Map**

   - Use the sidebar or header to click **“Create New Map.”**
   - Select which map template you want (World, USA, or Europe) in the pop-up.
   - Click **“Create”**. You will be taken to the **Data Integration** page.

3. **Data Integration**

   - Prepare your CSV file (see details below) and upload it.
   - Define data ranges (either by manual input or by generating suggested ranges).
   - Adjust colors and theme settings (ocean color, unassigned states, etc.).
   - Fill out **map details** (title, description, tags, references).

4. **Save & Share**
   - Choose **public** or **private** for your map.
   - Click **“Save Map”**.
   - You can now view or edit your map from your collection, explore other maps, star, and comment.

## How to Create and Edit Maps

When you navigate to the **Data Integration** page, have your CSV file ready. It must contain **exactly two columns**:

1. **Country/State Name**
2. **Value**

> **No values can be empty.**

**Example**:

```
Country/State Name,Value
State1,Value1
State2,Value2
...
```

### Error Handling

- If a state name isn’t recognized or the file is invalid, you’ll see an **error log** showing the line number and the issue.
- Fix any errors and re-upload until you receive a success message.

### Defining Ranges

1. **Suggested vs. Manual**

   - **Manual**: Type in your lower and upper bounds for each range.
   - **Auto-Generate**: Specify how many ranges you want and click **“Suggest range.”**

2. **Naming & Coloring**

   - Name each range (e.g., “Low,” “Medium,” “High,” etc.).
   - Choose individual colors or use a provided **color palette**.
   - Click **“Generate Groups”** to see your map update with the new ranges.

3. **Theme & Final Settings**
   - Customize map details: **ocean color**, **unassigned color**, etc.
   - Fill out **title**, **description**, **tags**, **references**.
   - Decide if the map is **private** or **public**.
   - Press **“Save Map”**. Your map is now added to your collection. You can edit it anytime.
