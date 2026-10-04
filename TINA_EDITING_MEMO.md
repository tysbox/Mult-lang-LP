# Tina Editing Memo

## Current Editing Flow

- Local editing entry point is `http://localhost:3000/admin/` during `npm run dev`.
- One-click launcher: double-click `start.command` (or run `npm run edit`).
  It starts the dev server and opens Safari with the editor (`/admin/`) and the EN site (`/`) as two tabs in the same window.
- The active editor route is `src/pages/admin/index.astro`.
- Content is stored in `content/pages/home.json` and `content/global/settings.json`.
- Runtime save/read APIs are `src/api/save-file.ts` and `src/api/get-data.ts`
  (copied to `src/pages/api/` by `scripts/sync-api-routes.mjs` for local dev; that folder is generated and gitignored).

## Required Local Commands

```bash
npm install
npm run dev
```

- Astro runs in `hybrid` mode with `@astrojs/node` so local POST saves work.
- If port `3000` is already used, Astro will auto-select the next free port.

## Launcher Environment Variables

| Variable | Effect |
| --- | --- |
| `MA_NO_OPEN=1` | Do not open any browser |
| `MA_OPEN_SITE=0` | Open only the editor, not the EN site |
| `MA_SKIP_GIT=1` | Skip the Git index self-repair step |

Log file: `${TMPDIR:-/tmp}/biscene-lp-start.log`

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