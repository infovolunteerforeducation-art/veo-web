# Deployment

## Vercel

This app is a Next.js project.

If the GitHub repository root is this `frontend` folder:

- Framework Preset: `Next.js`
- Install Command: `npm ci`
- Build Command: `npm run build`
- Output Directory: leave empty/default

If the GitHub repository root is the parent `VEO WEB` folder:

- Root Directory: `frontend`
- Framework Preset: `Next.js`
- Install Command: `npm ci`
- Build Command: `npm run build`
- Output Directory: leave empty/default

## Neon

The current app does not read from Neon yet. Tour and CMS data are still local mock data in `src/lib`.

When database integration is added, put the Neon connection string in Vercel Environment Variables, typically:

```bash
DATABASE_URL=postgresql://...
```

Do not commit real database credentials.

## CRM Admin Login

The `/crm` route is protected by Basic Auth. Set these Vercel Environment Variables before deploying production:

```bash
CRM_ADMIN_USERNAME=admin@veo.vn
CRM_ADMIN_PASSWORD=<strong-password>
```

Do not commit the real admin password.
