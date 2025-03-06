# MIC MVP Release v2.0.0

## Table of Contents

- [Introduction](#introduction)
- [Quick Start (For Users)](#quick-start-for-users)
  - [Creating Your First Map](#creating-your-first-map)
  - [Data Integration](#data-integration)
  - [Saving and Sharing](#saving-and-sharing)
- [How to Create and Edit Maps](#how-to-create-and-edit-maps)
  - [CSV Template](#csv-template)
  - [Error Handling](#error-handling)
  - [Defining Ranges](#defining-ranges)
  - [Naming and Coloring](#naming-and-coloring)
  - [Theme and Final Settings](#theme-and-final-settings)
- [Setup & Installation (For devs)](#setup--installation-for-devs)
  - [Project Structure](#project-structure)
  - [Prerequisites](#prerequisites)
  - [Cloning the Repository](#cloning-the-repository)
  - [Environment Variables](#environment-variables)
  - [Backend Setup](#backend-setup)
  - [Frontend Setup](#frontend-setup)

---

## Introduction

This is a MVP release of a brand new version of Map in Color (MIC) v2.0.0-beta, a tool for creating choropleth maps to visualize data—whether for scientific purposes or simply to see the world from a new perspective through data.

With the new version, the application includes more complexity and a sharing platform where data can be shared between users. Instead of manually selecting and defining states from select inputs (as seen in v1), you prepare a CSV file locally with all the data for the map, ensuring simplicity.

This MVP release features:

- A set of three maps (World Map, United States, and Europe) – with more to be added over time.
- The ability to instantly generate data ranges with ease (either suggested or manually defined).
- A sharing platform with tags for potential future data collection across diverse subjects, browsable via an _explore_ page.
- Public or private map settings for each user’s preference.
- User profiles that allow personal info, stars, and comments on maps.

## Quick Start (For Users)

To get started, go to [mapincolor.com/signup](https://mapincolor.com/signup) and sign up for an account. Fill in your details, create a secure password, and complete the registration process. Once your account is successfully created, you will be taken to the Dashboard for the first time.

### Creating Your First Map

To create your first map, navigate through either the sidebar or the header and click Create New Map. This will bring up a selection of different map templates. You can choose between a world map, a USA state map, or a European country map. Select the one that best suits your data and click Create. This will take you to the Data Integration page, where you will upload your CSV file and begin customizing your visualization.

### Data Integration

At this stage, you will need to upload your prepared CSV file (see formatting details below). The system will read your data and allow you to define ranges—either by manually entering values or using the Suggest Range feature to generate them automatically. Once your ranges are set, you can assign names to them, such as Low, Medium, and High, or any other categories relevant to your data. You will also be able to customize the map’s colors by selecting individual shades for each range or using pre-defined color palettes.

In addition to setting ranges, you can fine-tune the visual aspects of your map. Adjust the theme by modifying the ocean color, unassigned state color, and other stylistic elements to make your map more visually appealing.

The final step in this section is filling out the map details. You can add a title, a description explaining what your data represents, relevant tags to categorize your map, and references to credit the data sources.

### Saving and Sharing

Once your map is complete, you can choose whether to keep it private or make it public. Private maps will only be visible to you and will not appear on your profile or in the explore section. Public maps, on the other hand, can be viewed by other users, who will be able to interact with, star, and comment on them.

When you’re ready, click Save Map. Your map will be added to your collection, where you can access it anytime to make edits or updates. From there, you can explore other users' maps, save your favorites, and engage with the community by leaving comments and feedback.

## How to Create and Edit Maps

### CSV Template

When you navigate to the Data Integration page, have your CSV file ready. It must contain exactly two columns:

Example:

\`\`\`csv
Country/State Name,Value
State1,Value1
State2,Value2
...
\`\`\`

The state or country name must be written in uppercase and must match the exact spelling in the provided template. To ensure accuracy, you can download the corresponding starter template below:

- [Download World Map Template](#) _(Trigger downloadTemplate("world"))_
- [Download USA Map Template](#) _(Trigger downloadTemplate("usa"))_
- [Download Europe Map Template](#) _(Trigger downloadTemplate("europe"))_

### Error Handling

If a state name isn’t recognized or the file is invalid, an error log will be displayed, showing the line number and the specific issue:

![Error Log Example](/docs/error.png)

After identifying the error and its location, you can modify your file and reupload the CSV until you achieve a successful submission. You can also download the error log, which can be especially useful if you have a large number of errors to review in a single file.

### Defining Ranges

When defining ranges, you have two options: manually setting them or letting the system suggest them based on your data. Suggested ranges are calculated automatically from the values in your CSV, while manual ranges allow you to set your own upper and lower bounds for each category.

- **Manual:** Enter the lower and upper limits for each range according to your preference.
- **Auto-Generate:** Specify the number of ranges you want and click Suggest Range to let the system divide your data accordingly.

After defining your ranges, you can assign names to each one. These names will be displayed on the map, making it easier to interpret the data. For example, if you have three ranges, you could name them Low, Medium, and High, or choose labels that better fit your dataset.

Once the ranges are set, you can customize their appearance by selecting colors for each category. You can either pick individual colors manually or use one of the pre-defined color palettes. When you’re satisfied with your selections, clicking Generate Groups will update the map with the chosen ranges. If you want to tweak anything, you can always regenerate the groups and adjust them until they match your vision.

![Range Buttons Example](/docs/range_buttons.png)

### Naming and Coloring

In addition to defining numerical ranges, you can customize the visual representation of your data. Naming the ranges gives them clearer meaning, and selecting colors enhances the readability of the map. You can experiment with different color schemes until you find one that best highlights the differences in your data. Once everything looks right, generating the groups will apply these settings to your map.

### Theme and Final Settings

Once the ranges are in place, you can adjust the overall appearance of your map. This includes modifying the ocean color, changing the color for unassigned states, and refining the general aesthetic. These small adjustments help ensure that your map is both visually appealing and easy to interpret.

![Theme Settings Example](/docs/map_theme.png)

The last step before saving is filling out the map details. This includes adding a title, a description explaining what the data represents, and any relevant tags that help with categorization. If your data comes from a specific source, you can add references so that viewers know where the information originates from.

You also have the option to decide whether your map should be private or public. Private maps will only be visible to you and will not appear on your profile or the explore page. If you choose to share your map publicly, others will be able to view, interact with, and comment on it.

![Map Details Example](/docs/map_details.png)

Once everything is set, clicking Save Map will store it in your collection. You can return at any time to edit, refine, or update it as needed. After saving, you can also explore other users' maps, save your favorites, and engage with the community by leaving comments and feedback.

## Setup & Installation (For devs)

We welcome contributions. If you want to set up the project for contribution purposes, here are the instructions for setting up the project:

### Project Structure

\`\`\`plaintext
map-in-color/
│── app-backend/ # Backend code (Node.js + Supabase)
│── src/ # Frontend (React)
│── public/ # Static assets
│── package.json # Dependencies and scripts
│── README.md # Project documentation
\`\`\`

### Prerequisites

To run this project, make sure you have the following installed:

- Node.js (Recommended: LTS version)
- npm (Comes with Node.js)
- Git (For cloning the repository)
- Supabase account (Optional, for database access)

### Cloning the Repository

To get started, clone the repository on your local machine:

\`\`\`bash
git clone https://github.com/helgarfri/map-in-color.git
cd map-in-color
\`\`\`

### Environment Variables

Developers need to configure environment variables to run the backend.

Create a \`.env\` file in the root directory and add:

\`\`\`plaintext
SUPABASE_URL=your-supabase-url
SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
\`\`\`

**Note:** You can only access the database if you have authorization to do so. If not, you need to use your own dummy database.

### Backend Setup

Guide to starting the backend server:

\`\`\`bash
cd app-backend
npm install
node server.js
\`\`\`

The backend will now be running, handling requests from the frontend.

### Frontend Setup

To start the frontend, follow these steps:

\`\`\`bash
cd src
npm install
npm start
\`\`\`

This should launch the app on [http://localhost:3000](http://localhost:3000).

---

The platform is designed to make data visualization interactive and customizable, allowing you to explore new perspectives and share insights with others. Whether you're mapping statistical data, geographic trends, or personal research, you have full control over how your map is presented and shared.
