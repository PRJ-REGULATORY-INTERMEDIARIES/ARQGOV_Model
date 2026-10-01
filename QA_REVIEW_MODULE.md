# ARQGOV review module — integrity check

Updated package: English atlas 1.1 + review module 1.2 (Option A: local CSV export).

- Source model: `data.js`, `ontology.json`, and `.nojekyll` are byte-for-byte identical to the supplied v1.1 ZIP.
- Browser-side JS: `node --check app.js` and `node --check review.js` pass.
- Static integration: all HTML script references resolve, including the load order `data.js` → `review.js` → `app.js`; IDs are unique.
- Review trigger hooks: category, field, dimension, auxiliary, illustrative edge, theoretical map connection; the old details panel remains in place.
- Export: UTF-8 BOM + CRLF CSV; stable field IDs; formula-injection guard; local JSON backup/import; a separate compose-email action explicitly requiring manual attachment.
- No newly introduced network API endpoint, external script, tracker, server database or automatic sending. No emails have been sent.
- A full real-browser end-to-end test was attempted but the container's Chromium blocks both `file://` and loopback navigation with `ERR_BLOCKED_BY_ADMINISTRATOR`; thus interactive smoke testing on actual GitHub Pages remains a deployment check. Do not present static JS syntax validation as a successful browser-run test.
- Public-repository warning: public GitHub Pages does not provide recipient-only access. Do not commit reviewer CSV/JSON files.
