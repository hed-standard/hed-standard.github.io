var schemaNodes = [];
var allSchemaNodes = [];
var inLibraryNodes = [];
var suggestedTagsDict = {};
var useNewFormat = true;
var github_endpoint = "https://api.github.com/repos/hed-standard/hed-schemas/contents";
var github_raw_endpoint = "https://raw.githubusercontent.com/hed-standard/hed-schemas/main";
//Get the button
let scrollToTopBtn = null;
/**
 * Onload call. Build schema selection and schema versions dropdown
 * and load default schema accordingly to url params
 */
function load(schema_name) {
    /* Set up scroll to top button
    * https://mdbootstrap.com/docs/standard/extended/back-to-top/
    */
    scrollToTopBtn = document.getElementById("btn-back-to-top");

    // When the user scrolls down 20px from the top of the document, show the button
    window.onscroll = function () {
      scrollFunction();
    };
    // When the user clicks on the button, scroll to the top of the document
    scrollToTopBtn.addEventListener("click", backToTop);

    var urlParams = new URLSearchParams(window.location.search);
    if (urlParams.has('schema')) {
        schema_name = urlParams.get('schema');
    }

    console.log(schema_name)

    // Get and load schema according to official or prerelease
    standard_schema_api_path = github_endpoint + "/standard_schema";
    library_schema_api_path = github_endpoint + "/library_schemas";
    if (schema_name.includes('prerelease')) {
        var name_without_prerelease = schema_name.replace('_prerelease', '');
        if (name_without_prerelease == "standard") {
            var schema_link = getPrereleaseXml(standard_schema_api_path + "/prerelease");
        }
        else {
            var schema_link = getPrereleaseXml(library_schema_api_path + "/" + name_without_prerelease + "/prerelease");
        }
        // load preprelease schema accordingly
        loadSchema(schema_name, schema_link)

        // add schema names to schema dropdown button
        var standard_prerelease_schema_link = getPrereleaseXml(standard_schema_api_path + "/prerelease");
        var html = '<a class="dropdown-item" id="schemaStandard" + " onclick="loadSchema(\'' + schema_name + '\', \'' + standard_prerelease_schema_link + '\')">Standard</a>';
        $("#schemaDropdown").append(html);
        library_schemas = getLibarySchemas();
        for (var i=0; i < library_schemas.length; i++) {
            var library_schema_link = getPrereleaseXml(library_schema_api_path + "/" + library_schemas[i] + "/prerelease"); 
            var html = '<a class="dropdown-item" id="schemaStandard" + " onclick="loadSchema(\'' + library_schemas[i] + '\', \'' + library_schema_link + '\')">' + library_schemas[i] + '</a>';
            $("#schemaDropdown").append(html);
        }
    }
    else {
        // add schema names to schema dropdown button
        var html = '<a class="dropdown-item" id="schemaStandard" + " onclick="loadDefaultSchema(\'standard\')">standard</a>';
        $("#schemaDropdown").append(html);
        library_schemas = getLibarySchemas();
        for (var i=0; i < library_schemas.length; i++) {
            var html = '<a class="dropdown-item" id="schemaStandard" + " onclick="loadDefaultSchema(\'' + library_schemas[i] + '\')">' + library_schemas[i] + '</a>';
            $("#schemaDropdown").append(html);
        }
        
        var urlParams = new URLSearchParams(window.location.search);
        if (urlParams.has('schema')) {
            url_schema_name = urlParams.get('schema');
            if (urlParams.has('version')) {
                version = urlParams.get('version');
                url = getSchemaURL(url_schema_name, version);
                loadSchema(url);
                setDropdownBtnText(url_schema_name, version);
            } 
            else
                loadDefaultSchema(url_schema_name);
        }
        else {
            loadDefaultSchema(schema_name);
        }
    }

    // set synonym getter behaviors
    $("#syn_getter_btn").click(function() {
    let host = "http://127.0.0.1:5000/";
    let query = host + "synonym?word=" + $("#searchTags").val();
    var synonyms = null;
        $.ajax({dataType: "json", url: query, async: false, 
        success: function(data) {
            synonyms = [];
            synonyms.push($("#searchTags").val());
            synonyms = synonyms.concat(data["synonyms"]);
            },
        error: function(err) {
            console.log(err);
        }
    });
    if (synonyms != null) {
        $("#syn_getter").empty();
        synonyms.forEach(function(syn) {
            const capitalized = capitalizeFirstLetter(syn);
        let matched_node = allSchemaNodes.filter(elem => elem.includes(capitalized) || elem.includes(syn));
        if (matched_node.length !== 0) {
            matched_node.forEach(node => $("#syn_getter").append(`<option value="${node}" style="font-size:40px;">${node}</option>`));
        }
        });
    }
    });
    $("#syn_getter").change(function() { toNode($(this).val()) });

    // set lock window key press behavior
    $( document ).keypress(function(event) {
        if (event.which == 13) { // enter key
            if ($("div#infoBoard").attr('editable') == 'true') {
                $("div#infoBoard").attr('editable', 'false');
                $("a").off( "mouseover" ); //.mouseover(function(){});
                $("#freezeInfo").html("Press enter/return to unfreeze info board");
            }
            else {
                $("div#infoBoard").attr('editable', 'true');
                $("a").mouseover({format: useNewFormat},infoBoardMouseoverEvent);
                $("#freezeInfo").html("Press enter/return to freeze info board");
            }
        }
    })
    
}

/**
 * Get all currently available library schemas
 */
function getLibarySchemas() {
    libray_schemas_endpoint = github_endpoint + "/library_schemas";
    library_schemas = [];

    $.ajax({dataType: "json", url: libray_schemas_endpoint, async: false, success: function(data) {
        data.forEach(function(item,index) {
            library_schemas.push(item["name"]);
        })
    }});
    return library_schemas;
}

/**
 * Get all schema versions currently hosted on
 * https://github.com/hed-standard/hed-specification/tree/master/hedxml
 * and build githubSchema global variable
 * While building, reverse order for nice display in the dropdown
 */
function getGithubSchema(schema_name) {
    var githubSchema = {"version": [], "download_link": [], "isDeprecated": []};
    if (schema_name == "standard") {
        xml_path = github_endpoint + "/standard_schema/hedxml";
    }
    else {
        xml_path = github_endpoint + "/library_schemas/" + schema_name + "/hedxml";
    }

    $.ajax({dataType: "json", url: xml_path, async: false, success: function(data) {
        data.forEach(function(item,index) {
        if (item["name"].includes('xml')) {
            var version = item["name"].split('(.*)(.xml)')[0];
            var link = item["download_url"];
            // add to global dict
            githubSchema["version"].push(version);
            githubSchema["download_link"].push(link);
            githubSchema["isDeprecated"].push(false);
        }
        })
    }});
    Object.keys(githubSchema).forEach(key => githubSchema[key].reverse());
    // get deprecated schemas
    var hedxml_url = xml_path + "/deprecated";
    var deprecated = {"version": [], "download_link": [], "isDeprecated": []};
    $.ajax({dataType: "json", url: hedxml_url, async: false, success: function(data) {
        data.forEach(function(item,index) {
        if (item["name"].includes('xml')) {
                var version = item["name"].split('(.*)(.xml)')[0];
                var link = item["download_url"];
                // add to global dict
                deprecated["version"].push(version);
                deprecated["download_link"].push(link);
                deprecated["isDeprecated"].push(true);
        }
        })
    }});
    Object.keys(deprecated).forEach(key => deprecated[key].reverse());
    Object.keys(deprecated).forEach(key => {
    deprecated[key].forEach(elem => githubSchema[key].push(elem))
    });
    return githubSchema;
}

/**
 *  Retrieve schema versions and add to version dropdown button
 */
function buildSchemaVersionDropdown(schema_name) {
    // clear existing versions
    $("#schemaVersionDropdown").empty();

    // get versions based on provided schema name
    githubSchema = getGithubSchema(schema_name);
    var isDeprecatedTitleAdded = false;
    // build schema dropdown from Github repo
    for (var i=0; i < githubSchema["version"].length; i++) {
        if (githubSchema["isDeprecated"][i] && !isDeprecatedTitleAdded) {
            var html = '<a class="dropdown-header"><b>' + 'Deprecated' + '</b></a>';
            $("#schemaVersionDropdown").append(html);
            isDeprecatedTitleAdded = true;
        } 
        var html = '<a class="dropdown-item" id="schema' + githubSchema["version"][i] + '" onclick="loadSchema(\'' + schema_name + '\', \'' + githubSchema["download_link"][i] + '\')">' + githubSchema["version"][i] + '</a>';
        $("#schemaVersionDropdown").append(html);
    }
}

/**
 * Get the unique prerelease schema xml from prerelease dir
 */
function getPrereleaseXml(prerelease_endpoint) {
    var download_url = "";
    $.ajax({dataType: "json", url: prerelease_endpoint, async: false, success: function(data) {
        data.forEach(function(item,index) {
            if (item["name"].includes('xml') && download_url === "") {
                download_url = item["download_url"];
            }
        })
    }});
    return download_url;
}

/**
 * Get download link of the schema given hedVersion
 * @param hedVersion    schema version number
 * @returns     schema download link
 */
function getSchemaURL(schema_name, version) {
    console.log(schema_name);
    console.log(version);
    if (schema_name == "standard") {
        xml_path = github_raw_endpoint + "/standard_schema/hedxml/HED" + version + ".xml";
    }
    else
        xml_path = github_raw_endpoint + "/library_schemas/" + schema_name + "/hedxml/HED_" + schema_name.toLowerCase() + "_" + version + ".xml";
    console.log(xml_path);
    return xml_path;
}

/**
 * Download the schema given the schema's download link url
 * and reload the html browser with the new schema
 * @param url   schema download link
 */
function loadSchema(schema_name, url)
{
    let re = /HED.*xml/;
    let schemaVersion = url.match(re)[0];
    if ((schemaVersion.charAt(3) >= "8" && !schemaVersion.includes('alpha')) || url.includes('test')) // assuming schemaVersion has form 'HEDx.x.x.*'
        useNewFormat = true;
    else 
        useNewFormat = false;
        
    if (url.includes('deprecated')) // schema link will be */deprecated/*.xml if deprecated
        var isDeprecated = true;
    else 
        var isDeprecated = false;

    $.get(url, function(data,status) {
        xml = $.parseXML(data);
        displayResult(xml, useNewFormat, isDeprecated);
        parseMergedSchema();
        toLevel(2);
        getSchemaNodes();
    });
    $('#dropdownSchemaVersionButton').text('Version: ' + schemaVersion.split('.xml')[0]);

    // set prerelease switch btn href
    if (schema_name.includes('prerelease')) {
        var name_without_prerelease = schema_name.replace('_prerelease', '');
        $('.prerelease-switch').attr('href', replaceUrlParam("/display_hed.html", 'schema', name_without_prerelease));
    }
    else
        $('.prerelease-switch').attr('href', replaceUrlParam("/display_hed_prerelease.html", 'schema', schema_name + '_prerelease'));
}

function loadDefaultSchema(schema_name) {
    // build schema version dropdown
    buildSchemaVersionDropdown(schema_name);

    // load default schema
    if (schema_name == "standard") {
        xml_path = github_raw_endpoint + "/standard_schema/hedxml/HEDLatest.xml";
    }
    else {
        xml_path = github_raw_endpoint + "/library_schemas/" + schema_name + "/hedxml/HED_" + schema_name.toLowerCase() + "_Latest.xml";
    }
    
    loadSchema(schema_name, xml_path);
    setDropdownBtnText(schema_name, "Latest");
}

function setDropdownBtnText(schema_name, version) {
    $('#dropdownSchemaButton').text('Schema: ' + schema_name);
    if (schema_name == "standard") {
        $('#dropdownSchemaVersionButton').text("Version: HED_Latest");
    }
    else {
        $('#dropdownSchemaVersionButton').text("Version: HED_" + schema_name + "_Latest");
    }
}
/**
 * Load XSL file
 * @param filename
 * @returns {Document}
 */
function loadXSL(filename) {
    if (window.ActiveXObject)
    {
        xhttp = new ActiveXObject("Msxml2.XMLHTTP");
    }
    else
    {
        xhttp = new XMLHttpRequest();
    }
    xhttp.open("GET", filename, false);
    try {xhttp.responseType = "msxml-document"} catch(err) {} // Helping IE11
    xhttp.send("");
    return xhttp.responseXML;
}

/**
 * Reload html browser with new schema
 * @param xml   XML content of new schema
 * @param useNewFormat   boolean to indicate whether the schema is in new format (>= 8.0.0-alpha.3)
 */
function displayResult(xml, useNewFormat, isDeprecated)
{
    if (useNewFormat)
        xsl = loadXSL("/schema_browser/hed-schema.xsl");
    else
        xsl = loadXSL("/schema_browser/hed-schema-old.xsl");
    // code for IE
    if (window.ActiveXObject || xhttp.responseType == "msxml-document")
    {
        ex = xml.transformNode(xsl);
        document.getElementById("schema").innerHTML = ex;
    }
    // code for Chrome, Firefox, Opera, etc.
    else if (document.implementation && document.implementation.createDocument)
    {
        xsltProcessor = new XSLTProcessor();
        xsltProcessor.importStylesheet(xsl);
        resultDocument = xsltProcessor.transformToFragment(xml, document);
    }
    if (useNewFormat) {
            $("#schema").html(resultDocument.getElementById("schema").innerHTML);
            var prologue = resultDocument.getElementById("prologue").innerHTML;
            $("#prologue").html(prologue.replaceAll("\n", "<br>"));
            var epilogue = resultDocument.getElementById("epilogue").innerHTML;
            $("#epilogue").html(epilogue.replaceAll("\n", "<br>"));
            $("#schemaDefinitions").show();
            $("#unitClassDefinitions").html(resultDocument.getElementById("unitClassDefinitions").innerHTML);
            $("#unitModifierDefinitions").html(resultDocument.getElementById("unitModifierDefinitions").innerHTML);
            $("#valueClassDefinitions").html(resultDocument.getElementById("valueClassDefinitions").innerHTML);
            $("#schemaAttributeDefinitions").html(resultDocument.getElementById("schemaAttributeDefinitions").innerHTML);
            $("#propertyDefinitions").html(resultDocument.getElementById("propertyDefinitions").innerHTML);
            var versionText = "HED " + resultDocument.getElementById("hed-version").innerHTML;
            versionText = isDeprecated ? versionText + " (deprecated)" : versionText;
            $("#hed").html(versionText);
    }
    else {
        $("#schema").html(resultDocument);
        $("#schemaDefinitions").hide();
            var versionText = "HED " + $("#hed-version").text();
        versionText = isDeprecated ? versionText + " (deprecated)" : versionText;
            $("#hed").html(versionText);
    }
    // set info board behavior
    $("a").mouseover({format: useNewFormat},infoBoardMouseoverEvent);

    // set font colors
    $(".list-group-item:not(.inLibrary),[data-toggle='collapse']").css('color','#0072B2');
    $(".list-group-item:not(.inLibrary,[data-toggle='collapse'])").css('color','#0072B2');
    $(".list-group-item:not(.inLibrary,[data-toggle='collapse'])").css('font-weight','bold'); // make bold leaf node
}

function infoBoardMouseoverEvent(event) {
        var useNewFormat = event.data.format;
        var selected = $(event.target);
        var node = selected;
        var path = getPath(selected);
	console.log(path);
        var nodeName = selected.text();
        var finalText = "";
        if (useNewFormat) {
            selected.nextAll(`.attribute[name='${nodeName}']`).each(function(index) {
                var parsed = $(this).text();
                if (parsed.includes(",")) {
                    var trimmed = parsed.trim();
                    var trimmed = trimmed.replace(/(^,)|(,$)/g, "")
                    finalText += "<p>" + trimmed + "</p>";
                }
                else
                    finalText += "<p>" + parsed.trim() + "</p>";
            });
        }
        else {
            var attrs = selected.next(".attribute").text();
                parsed = attrs.split(','); // attributes are written in comma separated string
                parsed = parsed.map(x => "<p>" + x.trim() + "</p>");
                parsed = parsed.slice(0,parsed.length-1); // last item is empty (result of extra , at the end)
                finalText = parsed.join("");
        }
            finalText = finalText == null || finalText.length == 0 ? "" : finalText;
        var disp_div = ["schemaNode", "unitClassDef", "unitModifierDef", "valueClassDef", "attributeDef", "propertyDef"];
        if (disp_div.includes(selected.attr('name'))) {
            $("h4#title").text(nodeName);
            $("p#tag").text("Long form: " + path);
            $("p#description").text(selected.attr("description"));
            $("div#attribute_info").html(finalText);
        }
        else {
            $("h4#title").text(node.textContent);
            $("p#tag").text("");
            $("p#description").text(selected.attr("description"));
            $("div#attribute_info").html(finalText);
        }
}
/**
 *  Get full path of tag node
 *  @param node     a tag node
 */
function getPath(node) {
    var path = node.text();
    node = node.parent();
    while (node != null) {
        var aNode = node.prevAll("a.list-group-item:first");
        if (aNode.text()) {
            path = aNode.text() + "/" + path;
            node = node.parent();
        }
        else
            break;
    }
    return path;
}

/**
 * Button listener for collapse/hide all button
 */
function showHideAll() {
    if ($("#schema").attr("status") == "show") {
        hideAll()
    }
    else {
        showAll()
    }
}
function showAll() {
    $("#schema").find(".collapse").addClass("show");
    $("#schema").attr("status","show");
}
function hideAll() {
    $("#schema").find(".collapse").removeClass("show");
    $("#schema").attr("status","hide");
}
function toLevel(level) {
    hideAll()
    for (var i=1; i < level; i++) {
        $("#schema").find(`.level-${i}`).addClass("show");
    }
    $("#schema").attr("status","show");
}
function capitalizeFirstLetter(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}
function toNode(nodeName) {
    let node = $("a[tag='"+nodeName+"'");
    let attrs = node.attr("class");
    const levelString = attrs.match(/level-\d?/g)[0];
    const levelNum = levelString.split('-')[1];
    toLevel(levelNum);
    $("html").animate(
      {
        scrollTop: node.offset().top
      },
      500 //speed
    );
    node.effect("highlight", {}, 3000);
}
function getSchemaNodes() {
    /**
     * Set autocomplete behavior
     */
    allowDeprecated = $("#searchDeprecatedTags")[0].checked;
    // clear array
    schemaNodes.length = 0;
    allSchemaNodes.length = 0;

    // clear dictionary
    suggestedTagsDict = {};
    /* Initialize schema nodes list and set behavior of search box */
    $("a[name='schemaNode']").each(function() {
        attributes = getAttributesOfNode($(this));
        if (!allowDeprecated && attributes.includes('deprecatedFrom')) {
            return;
        }
        
        var nodeName = $(this).attr("tag");
        allSchemaNodes.push(nodeName);

        // build the suggestedtags dictionary
        $(this).nextAll(`.attribute[name='${nodeName}']`).each(function(index) {
            var parsed = $(this).text();
            if (parsed.includes("suggestedTag")) {
                var suggestedTags = parsed.split(":")[1].trim();
                suggestedTags = suggestedTags.split(",");
                clean_suggestedTags = [];
                suggestedTags.forEach(element => {
                    // for non empty string, remove whitespace and newline characters and tab characters and push to clean_suggestedTags
                    if (element.trim().length > 0) {
                        cleaned = element.trim();
                        cleaned.replace((/[\t\n\r]/gm),"");
                        cleaned = cleaned.toLowerCase();
                        clean_suggestedTags.push(cleaned);
                    }
                });
                // for each clean_suggestedTags, add its mapping with nodeName to the suggestedTagsDict
                clean_suggestedTags.forEach(element => {
                    if (!(element in suggestedTagsDict)) {
                        suggestedTagsDict[element] = [nodeName];
                    }
                    else {
                        suggestedTagsDict[element].push(nodeName);
                    }
                });
            }
        });
    });    
    
    /* add autocomplete and search */
    console.log(allSchemaNodes.length);
    autocomplete(document.getElementById("searchTags"), allSchemaNodes, suggestedTagsDict);

    /* go to tag on enter key press */
    $("#searchTags").on('keyup', function (e) {
        if (e.key === 'Enter' || e.keyCode === 13) {
        var searchText = $("#searchTags").val();
        searchText = searchText.toLowerCase();
        searchText = capitalizeFirstLetter(searchText);
        if (allSchemaNodes.includes(searchText))
            toNode(searchText);
        }
    });
}

function getAttributesOfNode(tagNode) {
    attributes = []
    attributeDivs = tagNode.nextUntil("a", ".attribute");
    for (var i=0; i < attributeDivs.length; i++) {
        attributes.push(attributeDivs[i].innerText.split(':')[0]);
    }
    return attributes
}

function capitalizeFirstLetter(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}
/* For scroll to top button */
function scrollFunction() {
  if (
    document.body.scrollTop > 20 ||
    document.documentElement.scrollTop > 20
  ) {
    scrollToTopBtn.style.display = "block";
  } else {
    scrollToTopBtn.style.display = "none";
  }
}
function backToTop() {
  document.body.scrollTop = 0;
  document.documentElement.scrollTop = 0;
}
/**
 * From autocomplete online tutorial
 */
function autocomplete(inp, arr, suggestedTagsDict) {
    /*the autocomplete function takes two arguments,
    the text field element and an array of possible autocompleted values:*/
    var currentFocus;
    /*execute a function when someone writes in the text field:*/
    inp.addEventListener("input", function(e) {
        var a, b, i, val = this.value;
        val = val.toLowerCase(); // make uniform
        /*close any already open lists of autocompleted values*/
        closeAllLists();
        if (!val) { return false;}
        currentFocus = -1;
        /*create a DIV element that will contain the items (values):*/
        a = document.createElement("DIV");
        a.setAttribute("id", this.id + "autocomplete-list");
        a.setAttribute("class", "autocomplete-items");
        /*append the DIV element as a child of the autocomplete container:*/
        this.parentNode.appendChild(a);
        /*for each item in the array...*/
        for (i = 0; i < arr.length; i++) {
          /*check if the item starts with the same letters as the text field value:*/
          if (arr[i].toLowerCase().includes(val)) {
            /*create a DIV element for each matching element:*/
            b = document.createElement("DIV");
            /*make the matching letters bold:*/
            b.innerHTML = arr[i].substr(0, arr[i].toLowerCase().indexOf(val));
            b.innerHTML += "<strong>" + arr[i].substr(arr[i].toLowerCase().indexOf(val), val.length) + "</strong>";
            b.innerHTML += arr[i].substr(arr[i].toLowerCase().indexOf(val)+val.length);
            /*insert a input field that will hold the current array item's value:*/
            b.innerHTML += "<input type='hidden' value='" + arr[i] + "'>";
            /*execute a function when someone clicks on the item value (DIV element):*/
            b.addEventListener("click", function(e) {
                /*insert the value for the autocomplete text field:*/
                inp.value = this.getElementsByTagName("input")[0].value;
                toNode(inp.value);
                /*close the list of autocompleted values,
                (or any other open lists of autocompleted values:*/
                closeAllLists();
            });
            a.appendChild(b);
          }
        }
        if (val in suggestedTagsDict) {
            b = document.createElement("DIV");
            b.innerHTML = "<strong>Suggested Tags Of:</strong>";
            a.appendChild(b)
            suggestedTagsDict[val].forEach(element => {
                b = document.createElement("DIV");
                b.innerHTML = element
                /*insert a input field that will hold the current array item's value:*/
                b.innerHTML += "<input type='hidden' value='" + element + "'>";
                /*execute a function when someone clicks on the item value (DIV element):*/
                b.addEventListener("click", function(e) {
                    /*insert the value for the autocomplete text field:*/
                    inp.value = this.getElementsByTagName("input")[0].value;
                    toNode(inp.value);
                    /*close the list of autocompleted values,
                    (or any other open lists of autocompleted values:*/
                    closeAllLists();
                });
                a.appendChild(b);
            });
        }
    });
    /*execute a function presses a key on the keyboard:*/
    inp.addEventListener("keydown", function(e) {
        var x = document.getElementById(this.id + "autocomplete-list");
        if (x) x = x.getElementsByTagName("div");
        if (e.keyCode == 40) {
          /*If the arrow DOWN key is pressed,
          increase the currentFocus variable:*/
          currentFocus++;
          /*and and make the current item more visible:*/
          addActive(x);
        } else if (e.keyCode == 38) { //up
          /*If the arrow UP key is pressed,
          decrease the currentFocus variable:*/
          currentFocus--;
          /*and and make the current item more visible:*/
          addActive(x);
        } else if (e.keyCode == 13) {
          /*If the ENTER key is pressed, prevent the form from being submitted,*/
          e.preventDefault();
          if (currentFocus > -1) {
            /*and simulate a click on the "active" item:*/
            if (x) x[currentFocus].click();
          }
        }
    });
    function addActive(x) {
      /*a function to classify an item as "active":*/
      if (!x) return false;
      /*start by removing the "active" class on all items:*/
      removeActive(x);
      if (currentFocus >= x.length) currentFocus = 0;
      if (currentFocus < 0) currentFocus = (x.length - 1);
      /*add class "autocomplete-active":*/
      x[currentFocus].classList.add("autocomplete-active");
    }
    function removeActive(x) {
      /*a function to remove the "active" class from all autocomplete items:*/
      for (var i = 0; i < x.length; i++) {
        x[i].classList.remove("autocomplete-active");
      }
    }
    function closeAllLists(elmnt) {
      /*close all autocomplete lists in the document,
      except the one passed as an argument:*/
      var x = document.getElementsByClassName("autocomplete-items");
      for (var i = 0; i < x.length; i++) {
        if (elmnt != x[i] && elmnt != inp) {
        x[i].parentNode.removeChild(x[i]);
      }
    }
  }
  
  /*execute a function when someone clicks in the document:*/
  document.addEventListener("click", function (e) {
      closeAllLists(e.target);
  });
} 

function parseMergedSchema() {
    // clear inLibraryNodes
    inLibraryNodes.length = 0;
    // parse merged library schema
    // scan through all <a> tags with name="schameNode" and detect whether its siblings contain <div> tag with class="attribute" whose values contains "inLibrary"
    // if so, add the class "inLibrary" to the <a> tag
    $("a[name='schemaNode']").each(function() {
        var nodeName = $(this).attr("tag");
        $(this).nextAll(`.attribute[name='${nodeName}']`).each(function(index) {
            var parsed = $(this).text();
            if (parsed.includes("inLibrary")) {
                inLibraryNodes.push(nodeName);
                $(this).prevAll("a.list-group-item:first").addClass("inLibrary");
            }
        });
    });

    $("#schema").attr("inlibrarystatus","show");

    // make inLibrary tag a different color
    $(".inLibrary[data-toggle='collapse']").css('color', '#a0522d');
    $(".inLibrary:not([data-toggle='collapse'])").css('color', '#a0522d');
    $(".inLibrary:not([data-toggle='collapse'])").css('font-weight', 'bold');

}

/**
 * Button listener
 * Show/hide merged library tags
 */
function showHideMergedLibrary() {
    if ($("#schema").attr("inlibrarystatus") == "show") {
        // hide base schema
        $(".list-group-item:not(.inLibrary)").hide();
        $("#schema").attr("inlibrarystatus","hide");
        /* reinitialize autocomplete and search */
        console.log("hide");
        // print length of inLibraryNodes
        console.log(inLibraryNodes.length);
        autocomplete(document.getElementById("searchTags"), inLibraryNodes, suggestedTagsDict);
    }
    else {
        // show base schema
        $(".list-group-item:not(.inLibrary)").show();
        $("#schema").attr("inlibrarystatus","show");
        /* reinitialize autocomplete and search */
        console.log(allSchemaNodes.length);
        autocomplete(document.getElementById("searchTags"), allSchemaNodes, suggestedTagsDict);
    }
}

// Update url params
function replaceUrlParam(url, paramName, paramValue)
{
    if (paramValue == null) {
        paramValue = '';
    }
    var pattern = new RegExp('\\b('+paramName+'=).*?(&|#|$)');
    if (url.search(pattern)>=0) {
        return url.replace(pattern,'$1' + paramValue + '$2');
    }
    url = url.replace(/[?#]$/,'');
    return url + (url.indexOf('?')>0 ? '&' : '?') + paramName + '=' + paramValue;
}

