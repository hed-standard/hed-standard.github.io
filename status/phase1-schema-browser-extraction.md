# Phase 1: Schema browser extraction - Complete

**Date:** October 22, 2025  
**Status:** ✅ Complete

## What was done

### 1. Created separate hed-schema-browser repository
- Extracted schema browser functionality from main website
- Repository structure:
  ```
  hed-schema-browser/
  ├── index.html (standard schema)
  ├── prerelease.html (prerelease schema)
  ├── score.html (SCORE library schema)
  └── source/
      ├── schema-browser.js
      ├── hed-collapsible.css
      ├── hed-schema.xsl
      └── hed-schema-old.xsl
  ```

### 2. Fixed JavaScript issues
- Removed IE/MSXML compatibility code
- Updated XSL file paths from `/schema_browser/` to `source/`
- Simplified loadXSL function for modern browsers
- Updated prerelease redirect links

### 3. Updated main site redirects
Modified three files to redirect to new schema browser:
- `display_hed.html` → https://www.hedtags.org/hed-schema-browser
- `display_hed_prerelease.html` → https://www.hedtags.org/hed-schema-browser/prerelease.html
- `display_hed_score.html` → https://www.hedtags.org/hed-schema-browser/score.html

## Files modified

### Redirects created
1. `display_hed.html` - Now uses redirect layout
2. `display_hed_prerelease.html` - Now uses redirect layout  
3. `display_hed_score.html` - Now uses redirect layout

### Files that can be removed in phase 2
- `_layouts/display_hed_layout.html` (no longer needed)
- `schema_browser/` directory (moved to separate repo)

## Next steps (Phase 2: Main site cleanup)

1. Remove obsolete files:
   - Delete `_layouts/display_hed_layout.html`
   - Delete `schema_browser/` directory
   
2. Update navigation links:
   - Check all references to `/display_hed.html`
   - Update to point to new schema browser URL

3. Check unused layouts:
   - Review `_layouts/forward.html`
   - Review `_layouts/homepage.html`
   - Remove if not in use

4. Consolidate navigation:
   - Create `_includes/header.html` from duplicated nav code
   - Update `index.html` and `about.html` to use include

5. Add GitHub Actions:
   - Create `.github/workflows/` directory
   - Add Jekyll build workflow
   - Add link checker workflow

## Testing checklist

- [x] Schema browser works standalone
- [x] Standard schema loads correctly
- [x] Prerelease schema loads correctly
- [x] SCORE schema loads correctly
- [x] Redirects work from old URLs
- [ ] Test on GitHub Pages deployment
- [ ] Verify all links in main site work

## Notes

- Schema browser is now independent and can be developed separately
- Main site cleanup can proceed without affecting schema browser
- Consider updating documentation to reference new schema browser location
