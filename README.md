# MIC v3.0.0

**Map in Color** is a web-based platform for creating interactive choropleth and categorical maps from structured data. Upload your own datasets, customize map design, and control how your maps are presented and shared.

- **Choropleth maps** — Numerical data (e.g. GDP, population, HDI) with automatic or manual value ranges and color gradients.
- **Categorical maps** — Classification data (e.g. World Cup winners, EU membership) with named groups and distinct colors.
- **Explore & community** — Discover public maps, star and comment, search and filter by tags. Playground works without an account; sign up to save, publish, and embed.

Map in Color is for researchers, educators, journalists, and anyone who needs to visualize geographic data without coding.

---

## Live site and docs

- **Live site:** [mapincolor.com](https://mapincolor.com)
- **User docs:** [mapincolor.com/docs](https://mapincolor.com/docs) — getting started, creating maps, data import, ownership & sharing, explore & community.

---

## Setting up the app (developers)

### Prerequisites

- **Node.js** (LTS recommended) and **npm**
- **Git**
- **Supabase** project (for database and storage). You need your own project for local development.

### 1. Clone the repository

```bash
git clone https://github.com/helgarfri/map-in-color.git
cd map-in-color
```

### 2. Backend setup

The backend is an Express app in `app-backend/`, using Supabase (Postgres + Storage) and optional Resend for email.

```bash
cd app-backend
npm install
```

Create a `.env` file **inside `app-backend/`** (this is where `dotenv` loads it from when you run the server):

```env
# Required
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
JWT_SECRET=your-strong-secret-at-least-32-chars

# Optional (defaults shown)
FRONTEND_URL=http://localhost:3000
PORT=5000

# For auth emails (verification, password reset). Without these, signup/verification flows will fail.
RESEND_API_KEY=re_xxxx
```

Start the backend:

```bash
node server.js
```

The API will listen on `http://localhost:5000` (or your `PORT`). Leave this terminal running.

### 3. Frontend setup

From the **repository root** (not inside `src/`):

```bash
npm install
npm start
```

The app will open at [http://localhost:3000](http://localhost:3000).

**Local API:** The frontend talks to the API via `src/api.js`, which is set to the production API URL by default. To use your local backend, change the `baseURL` in `src/api.js` to `http://localhost:5000/api` (or use an env-based URL if you add one).

### 4. Database

Backend expects Supabase tables (e.g. `users`, `maps`, `comments`, etc.). Use your own Supabase project and run any migrations or schema you have. For admin features, ensure `users.is_admin` exists and set at least one user to `is_admin = true`.

---

## Project structure

```text
map-in-color/
├── app-backend/          # Express API (Supabase, auth, maps, profile, etc.)
│   ├── config/          # Supabase, Resend
│   ├── middleware/      # auth, authOptional
│   ├── routes/          # auth, maps, profile, comments, explore, admin, …
│   └── server.js        # Entry point
├── public/              # Static assets, terms, privacy
├── src/                 # React app
│   ├── api.js           # API client (base URL configured here)
│   ├── App.js
│   └── components/
└── docs/                # Source for in-app docs (e.g. docs/3-0/)
```

---

## License and contributions

This project is licensed under the **[PolyForm Noncommercial 1.0.0](https://polyformproject.org/licenses/noncommercial/1.0.0/)** license ([LICENSE](./LICENSE)). You may use, modify, and share the code for **non-commercial** purposes (personal use, education, contributing). **Commercial use is not permitted** without permission from the copyright holder. Contributions (issues, pull requests) are welcome.

- **Email:** hello@mapincolor.com  
- **Repo:** [github.com/helgarfri/map-in-color](https://github.com/helgarfri/map-in-color) — open an issue or PR.

© 2026 Map in Color. Use of the platform (mapincolor.com) is subject to the [Terms of Use](https://mapincolor.com/terms).
