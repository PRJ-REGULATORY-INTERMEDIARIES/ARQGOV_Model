# ARQGOV English Conceptual Review v1.3 — Validation

## Source and editorial integrity

- Adapted from the user's newly supplied `ARQGOV_English_GitHub_Pages_v1_2.zip`, not the previous review ZIP as the canonical version.
- `data.js`, `ontology.json`, and `.nojekyll` are byte-identical to the new source package.
- The eight conceptual dimension titles and their 83 entries remain in English, as supplied.
- Source-derived definitions, source references and examples were not silently filled or changed.
- Removed earlier review-version translation remnants (`ENTRADAS`, `relacional`), and the catalogue now displays the English dimension title only.

## Functionality

- Separate field, category, dimension, auxiliary measurement, conceptual-map connection and illustrative-network edge review controls.
- Modal with named reviewer, optional email, assessment, comment and proposed wording.
- Browser-local note/draft storage and edit/replace-by-reviewer-and-target behaviour.
- Structured UTF-8 BOM / CRLF CSV, spreadsheet-formula guard, stable identifiers and source context.
- JSON backup/import and a draft-email action requiring manual attachment of the CSV.
- No receiving server, analytics or automatic publication of annotations.
- Asset cache busting is set to `v=1.3`.

## Tests

- `node --check app.js` and `node --check review.js` passed.
- HTML script references, ID uniqueness, and original data hashes were checked.
- Controlled Chromium/Playwright test used an inline document and simulated same-origin local storage because the execution environment blocked navigation to test HTTP and local-file addresses. It verified: opening a category and field; saving and updating a note; CSV and JSON downloads; theoretical-map link review; illustrative network-edge review; and no uncaught JavaScript exceptions.
- This is not a deployed GitHub Pages end-to-end test. After deployment, verify normal site-origin `localStorage` and the email client's attachment workflow manually.

## Confidentiality

The review CSV/JSON is not uploaded by the site. However, public GitHub Pages does not impose recipient-only access to the underlying manuscript-derived atlas. Do not publish exported reviews in the repository.
