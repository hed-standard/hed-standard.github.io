This documentation explains what goes into the HTML HED schema browser (display_hed.html). This is meant as a reference point for future maintenance.

# Load the HTML page locally

For development, it would be convenient to be able to view the [display_hed.html](http://www.hedtags.org/display_hed.html) page locally.  Once you've cloned the [Github repository](https://github.com/hed-standard/hed-standard.github.io), follow the instruction on jekyll tutorial for local deployment: https://jekyllrb.com/tutorials/using-jekyll-with-bundler/. Then you should be able to access the display file using

http://localhost:<port>/display_hed.html

# Key Components and Files

The schema browser consists of several key files:

- `_layouts/display_hed_layout.html`: Main HTML layout of the webpage. All HTML components are specified here
- `display_hed.html`: Jekyll header page that points to the layout specified in `display_hed_layout.html`. This is our public landing page
- `display_hed_prerelease.html`: landing page for prerelease loading the standard_prerelease schema by default
- `schema-browser.js`: Main JavaScript file containing all the interactive functionality
- `hed-schema.xsl`: XSLT transformation file that converts HED XML schema to HTML
- `hed-collapsible.css`: CSS styling for the collapsible tree structure

# Structure of the HTML page

The main display page ([display_hed.html](http://www.hedtags.org/display_hed.html)) contains 4 main components: the header section, buttons, collapsible schema, and the floating info board. 

### Header

The header section contains static content, specified under *header-section* div. 

### Buttons

Buttons are specified under *button-section* div. There are two buttons: **Expand/Collapse all** and **Show another version**. Their event handlers are specified in the html head's *\<script>* and explained below:

* Expand/Collapse all: *showHideAll()* event handler. The main div containing the schema (div#schema) has an attribute *status* whose value is either "show" or "hide". If the button is clicked when status is "show" (a collapse all intent), find all children elements with class *collapse* and remove "show" from their list of classes. This is equivalent to hiding those elements. The opposite applies when button is clicked with "hide" status.
* Show another version: *getSchemaVersions()* event handler. The content of the [hedxml](https://github.com/hed-standard/hed-specification/tree/master/hedxml) folder is retrieved using [Github API](https://developer.github.com/v3/repos/contents/#get-repository-content). Returned JSON result is parsed to extract only .xml files. Their names as links are then added to  div#schemaDropdown, each containing event handler *loadSchema()* with a download link of the according xml file. When user clicks on a menu item (a version), *loadSchema()* will retrieve the requested schema using the provided download link and update the schema display section accordingly.

### Collapsible schema

This is the focus of the page, contained within the *schema-section* div. The schema is defined by a XML file, transformed by *schema_browser/hed-schema.xsl* and styled by *schema_browser/hed-collapsible.css*. The function *loadSchema()* is the entry point for all those steps.

#### XML schema

The XML schema is retrieved from the [hedxml](https://github.com/hed-standard/hed-specification/tree/master/hedxml) folder using [Github API](https://developer.github.com/v3/repos/contents/#get-repository-content). By default HED latest version is used on page load.

#### *hed-schema.xsl*

The Extensible Style Language (XSL) transforms XML elements to HTML element to be displayed on the browser (https://www.w3schools.com/xml/xsl_intro.asp). *hed-schema.xsl* applies [templates](https://www.w3schools.com/xml/xsl_templates.asp) onto different elements of the HED xml file to convert them into HTML elements. Each template applies to an element of the XML file that matches the pattern specified my "match" attribute. Template is called recursively using the [\<xsl:apply-templates\>](https://www.w3schools.com/xml/xsl_apply_templates.asp) tag.

Each tag is a node in the HED xml file. A node may or may not have nested node. Each node is parsed as an \<a\> element, accopanied by a hidden \<div\> element which contains the attributes of the corresponding tag. If a node contains nested node, its  \<a\> element will have *data-toggle* attribute with value "collapse" and the [\<xsl:apply-templates\>](https://www.w3schools.com/xml/xsl_apply_templates.asp) tag will be called to recursively parse its children nodes. 

The result of this transformation will then be set as the inner html content of the div#schema in *display_hed.html*

#### *hed-collapsible.css*

The styling is inspired by https://two-wrongs.com/draw-a-tree-structure-with-only-css and adapted for [Bootstrap Collapse component](https://getbootstrap.com/docs/4.0/components/collapse/)

### Info board

The static structure of the info board is specified under *info-board-section* div. Content of the info board is loaded dynamically as user hovers a HED tag. The loading logic is specified under *displayResult()* function in the document's head \<script\>.

# Key Features and Functionality

## Schema Loading and Version Management
- Supports both standard and library schemas
- Handles prerelease versions
- Maintains a version history with deprecated versions
- Uses GitHub API to fetch schema versions and content

## Interactive Features
- Expandable/collapsible tree structure
- Search functionality with autocomplete
- Synonym lookup capability
- Info board with dynamic content loading
- Keyboard shortcuts (Enter key to freeze/unfreeze info board)

## Schema Navigation
- Jump to specific nodes
- Navigate to specific levels
- Back to top button
- Path display for current node

# Push and check changes

Commit and push your changes to the Github repo and check http://www.hedtags.org/display_hed.html to make sure the changes you made are reflected correctly on the public page. You might need to wait couple minutes before the changes is reflected on the remote server.
