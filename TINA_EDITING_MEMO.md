# Tina Editing Memo

## Current Editing Flow

- Local editing entry point is `http://localhost:3000/admin/` during `npm run dev`.
- The active editor route is `src/pages/admin/index.astro`.
- Content is stored in `content/pages/home.json` and `content/global/settings.json`.
- Runtime save/read APIs are `src/pages/api/save-file.ts` and `src/pages/api/get-data.ts`.

## Required Local Commands

```bash
npm install
npm run dev
```

- Astro runs in `hybrid` mode with `@astrojs/node` so local POST saves work.
- If port `3000` is already used, Astro will auto-select the next free port.

## Safe Editing Rules

- Keep only the active editor page under `src/pages/admin/`.
- Historical admin backups are stored in `archive/admin/` and must stay outside `src/pages/`.
- Do not move backup files back under `src/pages/admin/` unless you intentionally want them exposed as routes.
- When checking saves locally, verify both page save and global save from `/admin/`.

## Before Deployment

- Run `npx tsc --noEmit`.
- Run `npm run build`.
- Confirm `/admin/`, `/api/get-data`, and `/api/save-file` work in local dev before pushing.

## Notes

- This repository currently uses a custom Astro admin page, not a standard Tina-generated admin app.
- The `tina:build` script is intentionally skipped in local mode.