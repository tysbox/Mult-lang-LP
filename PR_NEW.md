# PR Summary

## Title
Stabilize local Tina editing workflow

## What changed
- switched Astro local runtime to `hybrid` with `@astrojs/node`
- enabled runtime API handling for local content read/write routes
- stabilized `save-file` request parsing for local admin saves
- moved historical admin backup pages out of `src/pages/admin/` into `archive/admin/`
- added a Tina editing operations memo for future local editing work

## Why
- `npm run dev` was blocked by a broken local runtime setup
- local POST saves from the custom admin editor were unavailable under static output
- archived admin backup pages were still being exposed as routes and cluttering the build
- the next editing session needs a predictable local workflow without touching deploy branches

## Validation
- `npx tsc --noEmit`
- `npm run build`
- `npm run dev`
- verified `/`, `/admin/`, `/api/get-data`
- verified `POST /api/save-file` for local page save and global settings save

## Notes
- active admin editor route remains `src/pages/admin/index.astro`
- archived backups now live under `archive/admin/`
- branch pushed to `origin/New`
