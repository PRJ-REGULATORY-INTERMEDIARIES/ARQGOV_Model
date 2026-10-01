# ARQGOV — English Interactive Conceptual Review (v1.3)

**Based on the newly supplied ARQGOV English GitHub Pages v1.2.**

[Open the existing GitHub Pages project](https://prj-regulatory-intermediaries.github.io/ARQGOV_Model/)

This package adds a browser-based, non-destructive **Conceptual Review** module to the English-language research atlas of David Levi-Faur's preliminary manuscript, *Law and the Architectures of Governance: Towards Relational Leximetrics Approach*.

The atlas presents eight dimensions and 83 category entries, with manuscript-derived definitions and references. It also contains a navigable conceptual map, a stylized seven-relationship network, and methodological notes. All conceptual records (`data.js`, `ontology.json`) are unchanged from the new English v1.2 supplied for this revision. Visual connections and review prompts are exploratory and do not represent author-approved amendments.

## Quick start for David and Rotem

1. Open the site and navigate to **Eight dimensions** or the **Theoretical map**.
2. Open a category. Use **Review this category** for a whole-entry comment, or **Review this field** below an individual manuscript field.
3. Click a theoretical-map connection to comment on that visual link. To comment on a relationship in the illustrative network, open it and use **Review connection**.
4. Provide your reviewer name, select an assessment, enter observations or proposed wording, and choose **Save note locally**.
5. Use **Review notes** at the top of the page to see and edit all saved notes.
6. Choose **Download CSV for Igor**, then **Prepare email**. Attach the downloaded CSV manually before sending. No notes are transmitted automatically.
7. Optionally download a **Backup JSON**; it can be imported later in the same model version.

## Assessments

- Keep as proposed
- Clarification needed
- Suggest a revision
- Potential overlap with another category
- Further discussion needed

## Data handling

The static site uses the reviewer's browser `localStorage`. Neither GitHub Pages nor Igor automatically receives reviewer comments, and the atlas source is not changed by a review. CSV is UTF-8 (with BOM), CRLF-delimited, with stable IDs for the dimension, category, field or connection. Each entry retains an excerpt of the unmodified source text and a version marker.

Local storage is not a confidential vault: it is tied to a browser and website origin and can be cleared, and other people using the same browser profile may be able to view notes. Reviewer names are self-declared rather than authenticated. The reviewer must export and send the CSV explicitly. Do not commit exported reviewer CSV/JSON to the public GitHub repository.

**Confidentiality:** a public GitHub Pages site is not access-controlled by sharing a link only with David and Rotem. Obtain the author's consent for publication of manuscript-derived material; restrict hosting if private access is required.

## Deployment

Upload the **contents**, not the ZIP file or an enclosing folder, to the repository root. Replace the existing `index.html`, `app.js`, `styles.css`, and `README.md`; add `review.js`; retain `data.js`, `ontology.json` and `.nojekyll`. The versioned references (`?v=1.3`) help prevent stale assets in the browser cache. In repository Settings > Pages, use Deploy from branch > main > /(root).

The included `REVIEW_GUIDE.md` and `QA_REVIEW_MODULE.md` provide reviewer instructions and validation details. This file package has not been deployed or emailed by the authoring tool.
