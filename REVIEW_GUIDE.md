# ARQGOV — Interactive Conceptual Review (v1.2)

## Purpose
A supplementary feedback instrument built on the existing English theoretical atlas. The inventory of categories and the interpretation of David Levi-Faur's preliminary manuscript are preserved unchanged; reviewers may comment without silently modifying the manuscript or codebook.

## Reviewer workflow
1. Open the atlas and select a dimension or individual category.
2. The category panel displays source-derived fields and separate **Review this field** controls. Use **Review this category** for comments affecting the entry as a whole.
3. In the theoretical map, the thin connections have a larger invisible click target. Clicking the connecting line opens a form about the *diagram's interpretation* of that link. In the relational network, click any illustrative edge and choose **Review connection**.
4. Supply a reviewer name, choose an assessment, and optionally add comments and replacement wording. Choose **Save note locally**. Use **Review notes** in the header to inspect saved comments.
5. Export **CSV for Igor**. Then compose an email and manually attach the CSV file. The email action never sends your CSV or creates an attachment automatically.
6. **Backup JSON** preserves the full note structure for later import. Importing merges validated records by reviewer + element/field, retaining the most recently updated version. Keep this backup confidential.

## Assessments
`keep` (keep as proposed); `clarify`; `revision`; `overlap`; `discuss`.

## CSV schema
One row per saved reviewer/element/field pair. UTF-8 with BOM, RFC4180-style double quoting and CRLF for spreadsheet compatibility. Export protects against spreadsheet formula injection by prefixing potentially executable cells with an apostrophe.

`schema_version,model_version,manuscript,reviewer_name,reviewer_email,review_item_id,element_type,element_id,dimension_id,category_label,field_label,source_reference,original_text,assessment,comment,proposed_revision,updated_at_utc`

- `element_type`: `dimension`, `category`, `field`, `conceptual_link`, `case_edge`, or `auxiliary`.
- `review_item_id`: stable target ID within the model version, including `::field-N` for a particular manuscript-derived field.
- `original_text`: immutable display text from the current source inventory or an explicit note that the connection is a visualization rather than a manuscript-authorized proposition.
- `updated_at_utc`: ISO8601 timestamp supplied by reviewer browser, not an independent verification of identity or authorship.

A note may be edited or deleted from the browser using the review workspace. Reviews are not adjudicated decisions until assessed separately by the research team. **Do not commit any exported CSV/JSON reviewer files to the public repository.**

## Technical constraints
This is a static GitHub Pages site. Data resides in the reviewer's `localStorage` under site origin, not in the repository, Igor's account or a backend. Device/browser separation is expected. The `mailto` control only opens a draft email and the downloaded CSV must be attached manually. The reviewer name is self-declared, not authenticated.

## Deployment
Deploy all files from the ZIP at repository root (including `review.js` and `REVIEW_GUIDE.md`). It is important to replace `index.html`, `app.js`, and `styles.css` together. Preserve `data.js`, `ontology.json` and `.nojekyll`.

The live URL already identified in the project's README is https://prj-regulatory-intermediaries.github.io/ARQGOV_Model/ ; this ZIP has **not** been pushed or deployed by its creator.
