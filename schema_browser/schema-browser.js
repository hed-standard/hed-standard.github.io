var githubSchema = {"version": [], "download_link": [], "isDeprecated": []};
var schemaNodes = [];
var useNewFormat = true;

//Get the button
let scrollToTopBtn = null;

/**
 * Onload call. Build schema selection dropdown
 * and load default schema accordingly to url params
 */
function load(repo_path, default_xml_path) {
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

    // Get and load schema according to official or prerelease
    if (repo_path.includes('prerelease')) {
        var schema_link = getPrereleaseXml(repo_path);
        // load default schema accordingly
        loadSchema(schema_link)
    }
    else {
        getGithubSchema(repo_path); // call outside of onload event to reduce latency
        var schema_link = "https://raw.githubusercontent.com/hed-standard/" + default_xml_path;
        var isDeprecatedTitleAdded = false;
        // build schema dropdown from Github repo
        for (var i=0; i < githubSchema["version"].length; i++) {
                if (githubSchema["isDeprecated"][i] && !isDeprecatedTitleAdded) {
                    var html = '<a class="dropdown-header"><b>' + 'Deprecated' + '</b></a>';
                    $("#schemaDropdown").append(html);
            isDeprecatedTitleAdded = true;
                } 
                var html = '<a class="dropdown-item" id="schema' + githubSchema["version"][i] + '" onclick="loadSchema(\'' + githubSchema["download_link"][i] + '\')">' + githubSchema["version"][i] + '</a>';
                $("#schemaDropdown").append(html);
        }

        // load default schema accordingly. Check if there's a version
        // specifically requested in the url
        var urlParams = new URLSearchParams(window.location.search);
        if (urlParams.has('version')) {
            var schema_url = getSchemaURL(urlParams.get('version'));
            loadSchema(schema_url);
        }
        else {
            loadSchema(schema_link)
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
		let matched_node = schemaNodes.filter(elem => elem.includes(capitalized) || elem.includes(syn));
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
    });
}

/**
 * Get all schema versions currently hosted on
 * https://github.com/hed-standard/hed-specification/tree/master/hedxml
 * and build githubSchema global variable
 * While building, reverse order for nice display in the dropdown
 */
function getGithubSchema(repo_path) {
    var hedxml_url = "https://api.github.com/repos/hed-standard/" + repo_path;
    $.ajax({dataType: "json", url: hedxml_url, async: false, success: function(data) {
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
    var hedxml_url = "https://api.github.com/repos/hed-standard/" + repo_path + "/deprecated";
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
}

/**
 * Get the unique prerelease schema xml from prerelease dir
 */
function getPrereleaseXml(prerelease_repo) {
    var hedxml_url = "https://api.github.com/repos/hed-standard/" + prerelease_repo;
    var download_url = "";
    $.ajax({dataType: "json", url: hedxml_url, async: false, success: function(data) {
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
function getSchemaURL(hedVersion) {
    for (var i=0; i < githubSchema["version"].length; i++) {
        if (githubSchema["version"][i].includes(hedVersion)) {
            return githubSchema["download_link"][i];
        }
    }
}

/**
 * Download the schema given the schema's download link url
 * and reload the html browser with the new schema
 * @param url   schema download link
 */
function loadSchema(url)
{
    let re = /HED.*xml/;
    let schemaVersion = url.match(re)[0];
    if ((schemaVersion.charAt(3) >= "8" && !schemaVersion.includes('alpha')) || url.includes('test')) // assuming schemaVersion has form 'HEDx.x.x.*'
	useNewFormat = true;
    else {
	useNewFormat = false;
    }
    if (url.includes('deprecated')) // schema link will be */deprecated/*.xml if deprecated
	var isDeprecated = true;
    else {
	var isDeprecated = false;
    }
    $.get(url, function(data,status) {
        xml = $.parseXML(data);
        displayResult(xml, useNewFormat, isDeprecated);
	toLevel(2);
	getSchemaNodes();
    });
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
    $("a").mouseover({format: useNewFormat},infoBoardMouseoverEvent);
}

function infoBoardMouseoverEvent(event) {
        var useNewFormat = event.data.format;
        var selected = $(event.target);
        var node = selected;
        var path = getPath(selected);
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
            finalText = finalText == null || finalText.length == 0 ? "" : "<p><i>Attribute</i></p>"+finalText;
        if (selected.attr('name') === "schemaNode") {
            $("h4#title").text(path);
            $("p#tag").text("Short form: " + node.textContent);
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
    return "/" + path;
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
function searchNode(input) {
    input = processNodeNameInput(input);
    if (schemaNodes.includes(input)) {
	toNode(input);
    }
}
function processNodeNameInput(input) {
    input = capitalizeFirstLetter(input);
    return input;
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
/* Initialize schema nodes list and set behavior of search box */
    $("a[name='schemaNode']").each(function() {
	schemaNodes.push($(this).attr("tag"));
    });    
    
    /* add autocomplete and search */
    $( function() {
    $( "#searchTags" ).autocomplete({
      source: schemaNodes,
      select: function(event, ui) {
	toNode(ui.item.value);
      }
    });
  } );
    /* search on enter key press */
    $("#searchTags").on('keyup', function (e) {
        if (e.key === 'Enter' || e.keyCode === 13) {
	    const searchText = $("#searchTags").val();
	    const capitalized = capitalizeFirstLetter(searchText);
	    if (schemaNodes.includes(capitalized))
		toNode(capitalized);
        }
    });
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
