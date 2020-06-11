# Load the HTML page locally

For development, it would be easier to be able to view the [display_hed.html](http://www.hedtags.org/display_hed.html) page locally. You'll need to have a local web server running. Here's how to set up a local server:  https://gist.github.com/jgravois/5e73b56fa7756fd00b89. Once your server is up, clone the [Github repository](https://github.com/hed-standard/hed-standard.github.io) into your server's root folder. Then you should be able to access the display file using

http://localhost/hed-standard.github.io/schema_browser/display_hed.html



# Structure of the HTML page

The main display page ([display_hed.html](http://www.hedtags.org/display_hed.html)) contains 4 main components: the header section, buttons, collapsible schema, and the floating info board. 

### Header

The header section contains static content, specified under *header-section* div. 

### Buttons

Buttons are specified under *button-section* div. There are two buttons: **Expand/Collapse all** and **Show another version**. Their event handlers are specfied in the html head's *\<script>* and explained below:

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



# Push and check changes

Commit and push your changes to origin Github repo and check http://www.hedtags.org/display_hed.html to make sure the changes you made are reflected correctly on the public page. You might need to wait couple minutes before the changes is reflected on the remote server.