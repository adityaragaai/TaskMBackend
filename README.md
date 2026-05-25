# TaskM Backend

Express + TypeScript API for the TaskManager app (MongoDB, JWT auth).

## Local development

```bash
npm install
cp .env.example .env
# Set MONGO_URI and JWT_SECRET in .env
npm run dev
```

API base: `http://localhost:5001/api` (see `PORT` in `.env`).

## Scripts

| Script        | Description                    |
|---------------|--------------------------------|
| `npm run dev` | Nodemon + ts-node (local)      |
| `npm run build` | Compile TypeScript to `dist` |
| `npm start`   | Run compiled `dist/server.js`  |
| `npm run test:e2e` | Smoke test against running API |

## Environment variables

| Variable     | Required | Description |
|--------------|----------|-------------|
| `PORT`       | No       | Server port (default `5001`) |
| `MONGO_URI`  | Yes      | MongoDB connection string |
| `JWT_SECRET` | Yes      | Secret for signing JWTs |
| `CLIENT_URL` | No       | Frontend origin for CORS (e.g. `https://your-app.vercel.app`) |
| `NODE_ENV`   | No       | Set to `production` on deploy |

Do not commit `.env`.

## Deploy (Render, Railway, etc.)

1. Push this repo and connect your host.
2. **Build command:** `npm install && npm run build`
3. **Start command:** `npm start`
4. Set env vars: `MONGO_URI`, `JWT_SECRET`, `CLIENT_URL` (your Vercel frontend URL), `NODE_ENV=production`
5. Use the host’s public URL as the frontend `VITE_API_URL` (with `/api` suffix).

Health check: `GET /api/health`

## API routes

- `/api/auth` — login, signup, profile, users
- `/api/projects` — projects CRUD
- `/api/tasks` — tasks CRUD
- `/api/dashboard` — stats
