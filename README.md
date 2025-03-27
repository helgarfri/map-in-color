# MIC MVP Release v2.0.0

## Table of Contents

- [Introduction](#introduction)
- [Key Features](#key-features)
- [Setup & Installation (For devs)](#setup--installation-for-devs)
  - [Project Structure](#project-structure)
  - [Prerequisites](#prerequisites)
  - [Cloning the Repository](#cloning-the-repository)
  - [Environment Variables](#environment-variables)
  - [Backend Setup](#backend-setup)
  - [Frontend Setup](#frontend-setup)
- [Live Site and Docs](#live-site-and-docs)
- [Contact and Contributions](#contact-and-contributions)

---

## Introduction

Map in Color (MIC) is an open-source platform designed to transform your geographical data into dynamic choropleth maps. Whether you’re a researcher, a data journalist, or simply curious about geographical patterns, MIC enables you to upload CSV files, define ranges, and create color-coded maps of the World, the United States, or Europe in just a few steps.

Beyond visualization, MIC offers a built-in sharing platform that encourages collaboration and community engagement. By setting your map to public, you can showcase it on our Explore page for others to discover, star, and comment on—fostering new insights and conversations around the data. If you prefer to work privately, you can keep your maps hidden from the public eye and still enjoy all the core features.

## Key Features

- A set of three maps (World Map, United States, and Europe) – with more to be added over time.
- The ability to instantly generate data ranges with ease (either suggested or manually defined).
- A sharing platform with tags for potential future data collection across diverse subjects, browsable via an _explore_ page.
- Public or private map settings for each user’s preference.
- User profiles that allow personal info, stars, and comments on maps.

## Setup & Installation (For devs)

We welcome contributions. If you want to set up the project for contribution purposes, here are the instructions for setting up the project:

### Project Structure

```plaintext
map-in-color/
│── app-backend/ # Backend code (Node.js + Supabase)
│── src/ # Frontend (React)
│── public/ # Static assets
│── package.json # Dependencies and scripts
│── README.md # Project documentation
```

### Prerequisites

To run this project, make sure you have the following installed:

- Node.js (Recommended: LTS version)
- npm (Comes with Node.js)
- Git (For cloning the repository)
- Supabase account (Optional, for database access)

### Cloning the Repository

To get started, clone the repository on your local machine:

```bash
git clone https://github.com/helgarfri/map-in-color.git
cd map-in-color
```

### Environment Variables

Developers need to configure environment variables to run the backend.

Create a `.env` file in the root directory and add:

```plaintext
SUPABASE_URL=your-supabase-url
SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
```

**Note:** You can only access the database if you have authorization to do so. If not, you need to use your own dummy database.

### Backend Setup

Guide to starting the backend server:

```bash
cd app-backend
npm install
node server.js
```

The backend will now be running, handling requests from the frontend.

### Frontend Setup

To start the frontend, follow these steps:

```bash
cd src
npm install
npm start
```

This should launch the app on [http://localhost:3000](http://localhost:3000).

---

## Live Site and Docs

- **Live site:** [mapincolor.com](https://mapincolor.com)
- **Detailed Docs**: Visit [mapincolor.com/docs](https://mapincolor.com/docs) for end-user instructions and additional information.

## Contact and Contributions

We welcome forms of feedback, issues, and pull requests.

-**Email**: hello@mapincolor.com

-**Repo**: [github.com/helgarfri/map-in-color](https://github.com/helgarfri/map-in-color) - open an issue or PR

---

© 2025 Map in Color.  
Source code is licensed under the [MIT License](./LICENSE).  
Use of the platform (mapincolor.com) is subject to the [Terms of Use](https://mapincolor.com/terms).
