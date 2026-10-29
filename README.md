# DevPulse

Internal tech issue and feature tracker API for software teams.

**Live URL:** _[link](https://devpulse-api-8qom.onrender.com)_

## Features

- User registration and JWT login (`contributor` / `maintainer` roles)
- Create, list, filter, and sort issues (bugs and feature requests)
- Contributors update their own open issues; maintainers update any issue
- Maintainer-only issue deletion
- PostgreSQL with raw SQL via `pg` (no ORM)

## Tech stack

- Node.js 24+
- TypeScript
- Express.js (modular routes)
- PostgreSQL (`pg` connection pool)
- bcrypt, jsonwebtoken

## Local setup

1. Clone the repo and install dependencies:

   ```bash
   npm install
   ```

2. Copy environment variables:

   ```bash
   cp .env.example .env
   ```

   Fill in `CONNECTION_STRING` (Neon, Supabase, or ElephantSQL) and a strong `JWT_SECRET`.

3. Run in development:

   ```bash
   npm run dev
   ```

4. Production build:

   ```bash
   npm run build
   npm start
   ```

## Environment variables

| Variable            | Description                                      |
| ------------------- | ------------------------------------------------ |
| `PORT`              | Server port (default `5000`)                     |
| `CONNECTION_STRING` | PostgreSQL connection URL                        |
| `JWT_SECRET`        | Secret for signing JWTs                          |
| `JWT_EXPIRES_IN`    | Token lifetime (default `1d`)                    |
| `CORS_ORIGIN`       | Allowed origin(s), comma-separated for multiple  |

## API endpoints

| Method | Path               | Access        | Description        |
| ------ | ------------------ | ------------- | ------------------ |
| POST   | `/api/auth/signup` | Public        | Register user      |
| POST   | `/api/auth/login`  | Public        | Login, get JWT     |
| POST   | `/api/issues`      | Authenticated | Create issue       |
| GET    | `/api/issues`      | Public        | List issues        |
| GET    | `/api/issues/:id`  | Public        | Get one issue      |
| PATCH  | `/api/issues/:id`  | Authenticated | Update issue       |
| DELETE | `/api/issues/:id`  | Maintainer    | Delete issue       |

**Auth header:** `Authorization: <JWT_TOKEN>`

**List query params:** `sort` (`newest` \| `oldest`), `type` (`bug` \| `feature_request`), `status` (`open` \| `in_progress` \| `resolved`)

## Database schema

### `users`

| Column       | Notes                                      |
| ------------ | ------------------------------------------ |
| `id`         | Serial primary key                         |
| `username`   | Display name                               |
| `email`      | Unique, required                           |
| `password`   | bcrypt hash, never returned in API         |
| `role`       | `contributor` (default) or `maintainer`    |
| `created_at` | Set on insert                              |
| `updated_at` | Set on insert                              |

### `issues`

| Column         | Notes                                                |
| -------------- | ---------------------------------------------------- |
| `id`           | Serial primary key                                   |
| `title`        | Required                                             |
| `description`  | Required                                             |
| `type`         | `bug` or `feature_request`                           |
| `status`       | `open` (default), `in_progress`, `resolved`          |
| `reporter_id`  | User id of creator                                   |
| `created_at`   | Set on insert                                        |
| `updated_at`   | Updated on issue changes                             |

Tables are created automatically on server start via `initDB()`.

## Deployment (Render)

### 1. PostgreSQL (Neon recommended)

1. Sign up at [neon.tech](https://neon.tech) and create a project.
2. Copy the **connection string** (pooled or direct is fine for this app).

### 2. Push code to GitHub

Render deploys from Git. Ensure `main` on `origin` includes `render.yaml`, `package.json`, and source.

```bash
git add .
git commit -m "Prepare Render deployment"
git push origin main
```

### 3. Create the web service on Render

**Option A — Blueprint (uses `render.yaml` in this repo)**

1. Open [dashboard.render.com](https://dashboard.render.com) → **New** → **Blueprint**.
2. Connect GitHub and select repo `himelahmed404/B7A2`.
3. Render reads `render.yaml` and creates `devpulse-api`.
4. When prompted, set secret env vars: `CONNECTION_STRING`, `JWT_SECRET`, and optionally `CORS_ORIGIN`.

**Option B — Manual web service**

1. **New** → **Web Service** → connect `himelahmed404/B7A2`.
2. **Runtime:** Node  
3. **Build command:** `npm install && npm run build`  
4. **Start command:** `npm start`  
5. **Environment variables:**

   | Key | Value |
   | --- | --- |
   | `CONNECTION_STRING` | Your Neon PostgreSQL URL |
   | `JWT_SECRET` | Long random string |
   | `JWT_EXPIRES_IN` | `1d` (optional) |
   | `CORS_ORIGIN` | Your frontend URL or `*` for testing |

Render sets **`PORT`** automatically; the app listens on `0.0.0.0` and that port.

### 4. Verify

- Open `https://<your-service>.onrender.com/` — should show `Hello World!`.
- Test `POST /api/auth/signup` and `GET /api/issues` with Postman or curl.
- Put the public URL in this README under **Live URL**.

**Note:** Free Render web services spin down after ~15 minutes idle; the first request after that may take 30–60 seconds.
