# Data Platform Frontend

Vue 3, Vite, Tailwind CSS, Vuelidate, and Pinia frontend.

## Prerequisites

- Node.js 18 or newer
- npm 9 or newer
- A running backend and a MongoDB instance for complete local functionality

## Install

```sh
npm install
```

## Environment configuration

Copy or edit `.env` in this directory. `VITE_ROOT_API` is public and is embedded when Vite builds:

```dotenv
VITE_ROOT_API=<backend API origin or deployment URL>
```

Use a full origin for a separately hosted API. If the API is proxied under the same origin, use a path such as `/api`. Do not place secrets in this file. Restart development or rebuild after changing this value.

## Start and build

```sh
npm run dev
npm run build
npm run serve
# Alias preview command:
npm run preview
```

`npm run dev` starts the development server. `npm run build` writes the production files to `dist`; `npm run serve` or `npm run preview` previews that build.

## Static hosting and SPA fallback

The router uses browser history mode. The host must serve `index.html` as the fallback for unknown application routes and must still serve files from `assets` and the public directory normally. Typical examples:

- Netlify: `/public/_redirects` with `/* /index.html 200`
- Nginx: `try_files $uri $uri/ /index.html`
- Apache: rewrite unknown paths to `index.html`

Vite is configured with a relative base for static deployments. Deploy the contents of `dist` only, configure the production `VITE_ROOT_API` before building, and verify direct-route refresh, asset loading, and API calls after deployment.
