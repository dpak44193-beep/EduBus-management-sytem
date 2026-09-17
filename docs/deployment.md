# Deployment Guide

## Services

- Frontend: Vite build output in `dist/`
- API: Express server in `server.js`
- Database: MongoDB
- Map: Google Maps embed

## Environment

Copy `.env.example` to `.env` for local development. Production values must be supplied by the hosting platform's secret manager.

Required values:

- `MONGO_URL`
- `JWT_SECRET`
- `FRONTEND_ORIGIN`
- Seed account values for the first deployment

`JWT_SECRET` must be a long random value in production. Never commit `.env`.

## Local startup

```powershell
npm install
npm run build
npm start
```

Run Vite separately during development with `npm run dev`.

## Deployment requirements

1. Provision MongoDB and record the connection string in the deployment secret store.
2. Set all variables from `.env.example`.
3. Deploy the API as a Node.js service listening on `PORT`.
4. Deploy `dist/` as the frontend or configure the web server to serve it.
5. Set `VITE_API_URL` to the public API URL during the frontend build.
6. Verify `/api/health`, login, and an authenticated data request.

Backups, TLS certificates, monitoring, and rollback are hosting responsibilities and must be configured before production launch.