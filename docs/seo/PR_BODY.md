## Summary
This PR contains a set of on-page and technical SEO improvements focused on high-value tools and image SEO.

### Changes included
- Reduced excessive keyword repetition on several tool pages (keyword density audit and fixes).
- Added SEO-friendly Open Graph images with explicit `alt` text: `og-image-emi-calculator.svg` and `og-image-emi-calculator-square.svg`.
- Added OG & Twitter meta `image:alt` tags (site default + per-tool pages).
- Added FAQs and LSI (synonyms / estimator phrasing) to the top 10 high-volume tool pages to improve snippet potential.
- Added `scripts/seo_audit.py` to run a simple repository SEO scan and an Action to run the audit on push/PR (.github/workflows/seo-audit.yml).
- Added outreach template for link-building in `docs/seo/outreach.md`.
- Minor schema updates referencing the new images for improved metadata completeness.

### Files changed (high level)
- `data/tools.json` (content + FAQs for top tools)
- `app/tools/[slug]/metadata.ts`, `app/tools/[slug]/page.tsx`, `app/layout.tsx`, `app/components/SchemaMarkup.tsx`
- `public/og-image-emi-calculator.svg`, `public/og-image-emi-calculator-square.svg`
- `scripts/seo_audit.py`, `scripts/top_tools.py`
- `.github/workflows/seo-audit.yml`

### Notes
- SVGs are added as OG images; for maximum social preview compatibility we may want to generate PNG fallbacks (I can add if desired).
- The seo_audit script is intentionally lightweight — it reports basic alt/OG usage; we can extend it to include Lighthouse checks and automated content suggestions.

### Request
Please review the content changes for tone and brand voice, then merge to `main` when satisfied.

---
If you'd like, I can open the PR on GitHub and add reviewers — tell me if you want me to create the PR title and description automatically.