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

## Deploy on Render

### 1. MongoDB Atlas (database)

1. Go to [mongodb.com/cloud/atlas](https://www.mongodb.com/cloud/atlas) → create a free cluster.
2. **Database Access** → add a database user (username + password).
3. **Network Access** → **Add IP Address** → **Allow Access from Anywhere** (`0.0.0.0/0`) so Render can connect.
4. **Database** → **Connect** → **Drivers** → copy the connection string.
5. Replace `<password>` with your user password and set the database name, e.g.  
   `mongodb+srv://user:pass@cluster0.xxxxx.mongodb.net/taskmanager?retryWrites=true&w=majority`

### 2. Create the Render web service

**Option A — Blueprint (easiest)**  
1. [dashboard.render.com](https://dashboard.render.com) → **New** → **Blueprint**  
2. Connect GitHub → select repo **adityaragaai/TaskMBackend**  
3. Render reads `render.yaml`. Fill in **`MONGO_URI`** when prompted.  
4. Leave **`CLIENT_URL`** empty for now; add your Vercel URL after frontend deploy.

**Option B — Manual**  
1. **New** → **Web Service** → connect **TaskMBackend**  
2. Settings:

| Field | Value |
|-------|--------|
| **Root Directory** | *(leave empty — repo root, not `src`)* |
| Runtime | Node **20** (avoid Node 26 until tested) |
| Build Command | `npm install --include=dev && npm run build` |
| Start Command | `node bootstrap.js` |
| Health Check Path | `/api/health` |

If you see `Cannot find module .../src/dist/server.js`, Render is using **`node dist/server.js`** from the **`src`** folder (often because `"main": "dist/server.js"` was auto-detected). Fix:

1. **Start Command** = `node bootstrap.js` (not `npm start` alone, not `node dist/server.js`).
2. **Root Directory** = empty (best), or leave as `src` and use the repo’s `src/package.json` fallback.
3. **Clear build cache** and redeploy.

3. **Environment** variables:

| Key | Value |
|-----|--------|
| `NODE_ENV` | `production` |
| `MONGO_URI` | Your Atlas connection string |
| `JWT_SECRET` | Long random string (e.g. 32+ chars) |
| `CLIENT_URL` | `https://your-app.vercel.app` (after Vercel deploy; optional until then) |

Do **not** set `PORT` — Render sets it automatically.

### 3. Deploy and test

1. Click **Create Web Service** / deploy. Wait until status is **Live**.
2. Copy the URL, e.g. `https://taskm-backend.onrender.com`
3. Open in browser: `https://taskm-backend.onrender.com/api/health` → should show `{"status":"ok"}`

### 4. Use this URL on Vercel (frontend)

```text
VITE_API_URL=https://taskm-backend.onrender.com/api
```

(Replace with your actual Render hostname.)

Health check: `GET /api/health`

## API routes

- `/api/auth` — login, signup, profile, users
- `/api/projects` — projects CRUD
- `/api/tasks` — tasks CRUD
- `/api/dashboard` — stats
