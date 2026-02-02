# Adapted Copilot Instructions

**Date**: February 2, 2026  
**Status**: Completed

## Summary

Successfully adapted copilot instructions from the `hed-resources` repository to fit this repository (`hed-standard.github.io`), which serves the main HED website at hedtags.org.

## Changes Made

### 1. Project Overview
- **Changed from**: Sphinx documentation repository (hed-resources)
- **Changed to**: Jekyll-based main website (hed-standard.github.io)
- **Removed**: Python virtual environment requirements (not needed for Jekyll)
- **Updated**: Repository description and purpose

### 2. Technology Stack
- **Replaced**: Sphinx/MyST/Python documentation build system
- **With**: Jekyll 4.3 static site generator with Ruby
- **Updated**: Build commands from `sphinx-build` to `bundle exec jekyll`
- **Maintained**: PowerShell command syntax for Windows

### 3. Structure Documentation
- **Replaced**: Documentation categories (IntroductionToHed.md, HedAnnotationQuickstart.md, etc.)
- **With**: Website components (homepage, navigation, demos, layouts)
- **Added**: Jekyll-specific structure (_includes, _layouts, _site)
- **Added**: Asset organization (CSS, JavaScript, images)

### 4. Development Workflows
- **Removed**: Python virtual environment setup
- **Removed**: Sphinx build commands
- **Added**: Jekyll installation and setup
- **Added**: `bundle exec jekyll serve` for local development
- **Maintained**: Quality assurance section (spell checking with codespell)

### 5. Content Guidelines
- **Replaced**: MyST Markdown conventions with HTML/Liquid templates
- **Replaced**: Sphinx directives with Jekyll front matter
- **Added**: CSS custom properties from modern.css
- **Added**: Bootstrap 5 component usage
- **Added**: Dark mode theming guidelines

### 6. Component Documentation
Added documentation for:
- Navigation component (`_includes/navigation.html`)
- Layout templates (`_layouts/default.html`, `_layouts/redirect.html`)
- Interactive demos (coco, cta, interactive)
- Chat widget integration (OSA/HED Assistant)
- Search functionality (linking to hed-resources)
- Theme toggle (light/dark mode)

### 7. Repository Structure
- **Updated**: Directory tree to reflect Jekyll structure
- **Added**: Jekyll-specific directories and files
- **Removed**: Sphinx-specific paths (docs/source, docs/_build)
- **Maintained**: .status/ directory for status summaries

### 8. Dependencies
- **Replaced**: Python packages (sphinx, myst-parser, etc.)
- **With**: Ruby gems (jekyll, just-the-docs theme)
- **Maintained**: Frontend libraries (Bootstrap, jQuery, Bootstrap Icons)
- **Added**: Ruby version requirements

### 9. CI/CD
- **Updated**: GitHub Actions workflow reference
- **Changed from**: `docs.yml` (Sphinx build)
- **To**: `jekyll.yml` (Jekyll build and deploy)
- **Maintained**: Automatic deployment on push to main

### 10. Common Tasks
Adapted task examples:
- Adding new pages (HTML with front matter vs. Markdown)
- Updating navigation (editing navigation.html)
- Modifying styles (using modern.css)
- Working with demos (demos/ directory structure)
- Chat widget configuration

## Key Differences Highlighted

### What Stayed the Same
✅ Windows/PowerShell environment  
✅ `.status/` directory for summaries  
✅ Spell checking with codespell  
✅ Related HED repositories  
✅ Link checking importance  
✅ Accessibility guidelines  

### What Changed
❌ **Removed**: Python virtual environment  
❌ **Removed**: Sphinx documentation system  
❌ **Removed**: MyST Markdown directives  
✅ **Added**: Jekyll static site generator  
✅ **Added**: Ruby/Bundler requirements  
✅ **Added**: Liquid templating  
✅ **Added**: Modern CSS design system  
✅ **Added**: Interactive demo documentation  

## Files Updated

1. **`.github/copilot-instructions.md`**
   - Complete rewrite adapting all sections
   - ~480 lines of comprehensive Jekyll/website instructions
   - Maintains similar structure for consistency

## Usage

The adapted instructions now provide:
- Accurate Jekyll-based development workflow
- Correct build commands for Windows/PowerShell
- Website-specific component documentation
- Modern CSS design system guidelines
- Interactive demo integration guidance
- Chat widget configuration details

## Next Steps

The copilot instructions are now ready to use for:
- Guiding development of new website features
- Onboarding new contributors
- Maintaining consistency across site components
- Documenting common tasks and workflows

## Notes

- Instructions emphasize that NO Python virtual environment is needed
- All commands are PowerShell-compatible (using `;` not `&&`)
- Links to hed-resources are preserved for documentation references
- Design system (modern.css) is well-documented
- Chat widget integration is explained in detail
