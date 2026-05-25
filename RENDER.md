# Render deploy checklist

Your build log showed:

```text
Using Node.js via /opt/render/project/src/package.json
Running build command 'npm install'
```

That means **Root Directory = `src`** and **no compile step**. Fix in Render dashboard:

## Required settings

| Setting | Value |
|---------|--------|
| **Root Directory** | *(leave empty — delete `src`)* |
| **Build Command** | `npm install && npm run build` |
| **Start Command** | `npm start` |

## Environment variables

| Key | Required |
|-----|----------|
| `MONGO_URI` | Yes |
| `JWT_SECRET` | Yes |
| `NODE_ENV` | `production` |

Atlas: Network Access → allow `0.0.0.0/0`.

## After deploy

`https://YOUR-SERVICE.onrender.com/api/health` → `{"status":"ok","db":"connected"}`
