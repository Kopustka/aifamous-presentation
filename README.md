# FAMOUS — presentation site

Desktop scroll-telling presentation for **FAMOUS** (bot for running AI-models),
served live at https://aifamous.online

## Structure
- `famous.html` — the whole presentation (inline CSS + vanilla JS, 14 sections, no framework).
- `assets/` — media used by `famous.html` (images / video).
- `famous_demo/` — the interactive mini-app embedded in the on-screen "phones" via `<iframe>`
  (its own `assets/` and `components/`).

## Local preview
```bash
python3 -m http.server 7777
# open http://localhost:7777/famous.html
```
(Assets don't load over `file://` — use the HTTP server.)

## Deploy
Static files served by nginx from the web root. `famous.html` is the only entry point.
