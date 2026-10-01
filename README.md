# ARQGOV Model — Interactive Governance Atlas

## [👉 Click here to explore the interactive model](https://prj-regulatory-intermediaries.github.io/ARQGOV_Model/)

**GitHub Pages URL:** https://prj-regulatory-intermediaries.github.io/ARQGOV_Model/

This is an English-language interactive research atlas based on David Levi-Faur’s preliminary manuscript, *Law and the Architectures of Governance: Towards Relational Leximetrics Approach*.

### Features
- Navigable conceptual map connecting the eight governance dimensions.
- Searchable catalogue of 83 source-derived categories, with references and explicit unresolved definitions.
- Illustrative seven-edge regulatory relationship network.
- Relational coding framework, methodological attributes, metrics, audit notes and cross-layer relationships.

### Deployment
Upload the **contents of this folder**, not the ZIP itself and not an enclosing directory, to the repository’s `main` branch. All six site files must share the repository root: `index.html`, `styles.css`, `data.js`, `app.js`, `ontology.json`, and `.nojekyll`. Retain this `README.md` as a seventh file. Under **Settings → Pages**, select **Deploy from a branch → main → /(root)**. GitHub Pages will serve `index.html` automatically.

### Scholarly status
Analytical reconstruction for academic discussion; not a figure formally endorsed by the author. The manuscript is preliminary and some category definitions and operational thresholds remain unresolved. Publication in a public repository should be authorized by the author.

### Interactive Conceptual Review · version 1.2

**This is the same 1.1 theoretical model with an additive, browser-local review layer.** Existing `data.js` and `ontology.json` have not been edited. Review annotations are not incorporated into the manuscript or its model categories without subsequent scholarly review.

Reviewers can open any category, click **Review this category** or **Review this field**, and provide an assessment, comments and an optional alternative wording. Theoretical diagram connections are also clickable for review; the seven illustrative network edges have review controls in their side panels. The top-right **Review notes** button opens the saved-note summary, CSV export and JSON backup/import.

**How to return comments to Igor (Option A, without a server):**
1. Set your reviewer name and record one or more annotations using **Save note locally**.
2. Click **Review notes → 1 · Download CSV for Igor**.
3. Click **2 · Prepare email** if desired, and **manually attach the downloaded CSV**. The HTML never sends it automatically. The CSV includes stable element/field IDs, source reference, original text, assessment, comment, suggested revision and timestamp.
4. To move work to another browser/device, use **Backup JSON** and **Import backup JSON**. Save a backup before clearing browser data.

All notes remain in the current browser's local storage until exported; different reviewers and devices do **not** share a central database. There are no cookies/trackers, external libraries, API calls or cloud storage for review submissions. Local notes may be available to other users of the same browser profile. Browser data removal/private browsing can erase them.

**Confidentiality:** The repository is currently public. GitHub Pages does not restrict readers based on who has been sent the URL; repository files and the deployed manuscript-derived content should be treated as publicly accessible. Do not place confidential comments, credentials or unpublished source material in the repository. CSV/JSON review files should be exchanged privately. Seek the manuscript author's authorization before public deployment.

For reviewer instructions and a detailed CSV schema, see [`REVIEW_GUIDE.md`](REVIEW_GUIDE.md).
