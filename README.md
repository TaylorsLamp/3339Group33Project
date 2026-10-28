# Data Platform Project Setup

This project contains a Vue 3/Vite frontend and an Express/MongoDB backend.

## Prerequisites

Install the following before setup:

- Node.js 18 or newer
- npm 9 or newer (included with a current Node.js installation)
- MongoDB, either local or hosted
- A terminal with access to this repository

Verify the tools with:

```sh
node --version
npm --version
```

## Environment variables

Create `backend/.env` with:

```dotenv
MONGO_URL=<MongoDB connection string>
PORT=3000
ORG_ID=<organization ObjectId>
JWT_SECRET=<secret value used to sign JWTs>
```

Create `frontend/.env` from the included example/documentation and set:

```dotenv
VITE_ROOT_API=<backend API origin or deployment URL>
```

`VITE_ROOT_API` is compiled into the frontend at build time. Use a full origin, for example an HTTPS API URL, or set a same-origin API path. Restart Vite after changing the file. Never put backend secrets in `frontend/.env`.

## Install dependencies

From the repository root:

```sh
cd backend
npm install
cd ../frontend
npm install
cd ..
```

## Start locally

Start MongoDB first, then start the backend:

```sh
cd backend
npm start
```

The backend defaults to port `3000` when `PORT=3000` is configured. In a second terminal, start the frontend:

```sh
cd frontend
npm run dev
```

Then open the local URL printed by Vite, normally `http://localhost:5173`.

## Frontend build and preview

Build a production bundle from the repository root:

```sh
cd frontend
npm run build
```

Preview the generated `dist` directory locally:

```sh
npm run serve
# equivalent preview command:
npm run preview
```

Vite preview does not replace the production web server; only deploy the contents of `frontend/dist`.

## SPA fallback and static deployment

The frontend uses Vue Router history mode and must be served as a single-page application. Configure the static host to return `frontend/dist/index.html` for application routes such as `/login`, `/findclient`, or `/clients/:id`, while preserving real files under `/assets` and `/favicon.ico`.

Common fallback rules:

- Netlify: add a `_redirects` file in `frontend/public` containing `/* /index.html 200`.
- Apache: enable mod_rewrite and route unknown paths to `index.html`.
- Nginx: use `try_files $uri $uri/ /index.html;` inside the frontend location.

Before deployment, set production values for `VITE_ROOT_API` (for example the HTTPS API origin), run `npm run build`, and deploy only `frontend/dist`. The Vite base is relative, so assets can be served from a static host subpath. Configure HTTPS, CORS, and backend API routing before the final production cutover. After deployment, verify direct navigation and page refreshes for representative routes, plus API connectivity.

## Backend details

Backend setup is described in `backend/README.md`. Do not implement or expose backend changes in the frontend deployment configuration.

