var githubSchema = {"version": [], "download_link": [], "useNewSchemaFormat":[]};

/**
 * Onload call. Build schema selection dropdown
 * and load default schema accordingly to url params
 */
function load(repo_path, default_xml_path) {
    getGithubSchema(repo_path); // call outside of onload event to reduce latency
    var schema_link = "https://raw.githubusercontent.com/hed-standard/" + default_xml_path;
    // build schema dropdown
    for (var i=0; i < githubSchema["version"].length; i++) {
        if (!githubSchema["version"][i].includes('Latest')) {
            if (githubSchema["version"][i].includes('1.3')) {
                var html = '<a class="dropdown-header"><b>' + 'HED1G' + '</b></a>';
                $("#schemaDropdown").append(html);
            } else if (githubSchema['version'][i].includes('4.0.5')) {
                var html = '<a class="dropdown-header"><b>' + 'HED2G' + '</b></a>';
                $("#schemaDropdown").append(html);
            } else if (githubSchema['version'][i].includes('8.0.0-alpha.1')) {
                var html = '<a class="dropdown-header"><b>' + 'HED3G' + '</b></a>';
                $("#schemaDropdown").append(html);
            }
            var html = '<a class="dropdown-item" id="schema' + githubSchema["version"][i] + '" onclick="loadSchema(\'' + githubSchema["download_link"][i] + '\')">' + githubSchema["version"][i] + '</a>';
            $("#schemaDropdown").append(html);
        }
    }

    // load default schema accordingly
    var urlParams = new URLSearchParams(window.location.search);
    if (urlParams.has('version')) {
        var schema_url = getSchemaURL(urlParams.get('version'));
        loadSchema(schema_url);
    }
    else {
        loadSchema(schema_link)
    }
}

/**
 * Get all schema versions currently hosted on
 * https://github.com/hed-standard/hed-specification/tree/master/hedxml
 * and build githubSchema global variable
 */
function getGithubSchema(repo_path) {
    var hedxml_url = "https://api.github.com/repos/hed-standard/" + repo_path;
    $.ajax({dataType: "json", url: hedxml_url, async: false, success: function(data) {
        data.forEach(function(item,index) {
            var version = item["name"].split('(.*)(.xml)')[0];
            var link = item["download_url"];
            // add to global dict
            githubSchema["version"].push(version);
            githubSchema["download_link"].push(link);
        })
    }});
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
    var splitted = url.split("/");
    var schemaName = splitted[splitted.length-1].split('.');
    schemaName.pop();
    var schemaVersion = schemaName.join('.');
    if (schemaVersion.charAt(3) < "8") // assuming schemaVersion has form 'HEDx.x.x.*'
	var useNewFormat = false;
    else
	var useNewFormat = true;
    $.get(url, function(data,status) {
        xml = $.parseXML(data);
        displayResult(xml, useNewFormat);
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
function displayResult(xml, useNewFormat)
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
        $("#schema").html(resultDocument);
    }

    $("a").mouseover(function() {
        var path = getPath($(this));
        var selected = $(event.target);
	var nodeName = selected.text();
	var finalText = "";
	if (useNewFormat) {
        	selected.nextAll(`.attribute[name='${nodeName}']`).each(function(index) {
		var parsed = $(this).text();
		if (parsed.includes(",")) {
			var trimmed = parsed.trim();
			finalText += "<p>" + trimmed.substring(0,trimmed.length-1) + "</p";
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
        $("h4#title").text(path);
        $("p#tag").text("Tag: " + this.textContent);
        $("p#description").text(selected.attr("description"));
        $("div#attribute_info").html(finalText);
    })
    $("#hed").html("HED " + $("#hed-version").text());
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
        console.log($("#schema").find(`.level-${i}`))
        $("#schema").find(`.level-${i}`).addClass("show");
    }
    $("#schema").attr("status","show");
}
