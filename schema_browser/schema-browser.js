var githubSchema = {"version": [], "download_link": []};
getGithubSchema(); // call outside of onload event to reduce latency

/**
 * Onload call. Build schema selection dropdown
 * and load default schema accordingly to url params
 */
function start() {
    // build schema dropdown
    for (var i=0; i < githubSchema["version"].length; i++) {
        var html = '<a class="dropdown-item" id="schema' + githubSchema["version"][i] + '" onclick="loadSchema(\'' + githubSchema["download_link"][i] + '\')">' + githubSchema["version"][i] + '</a>';
        $("#schemaDropdown").append(html);
    }

    // load default schema accordingly
    var urlParams = new URLSearchParams(window.location.search);
    if (urlParams.has('version')) {
        var schema_url = getSchemaURL(urlParams.get('version'));
        loadSchema(schema_url);
    }
    else {
        loadSchema('https://raw.githubusercontent.com/hed-standard/hed-specification/master/hedxml/HED7.1.1.xml')
    }
}

/**
 * Get all schema versions currently hosted on
 * https://github.com/hed-standard/hed-specification/tree/master/hedxml
 * and build githubSchema global variable
 */
function getGithubSchema() {
    $.ajax({dataType: "json", url: "https://api.github.com/repos/hed-standard/hed-specification/contents/hedxml", async: false, success: function(data) {
        data.forEach(function(item,index) {
            var version = item["name"].split('*.xml')[0];
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
    $.get(url, function(data,status) {
        xml = $.parseXML(data);
        displayResult(xml);
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
 */
function displayResult(xml)
{
    xsl = loadXSL("schema_browser/hed-schema.xsl");
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
        var attrs = selected.next(".attribute").text();
        parsed = attrs.split(','); // attributes are written in comma separated string
        parsed = parsed.map(x => "<p>" + x.trim() + "</p>");
        parsed = parsed.slice(0,parsed.length-1); // last item is empty (result of extra , at the end)
        var finalText = parsed.join("");
        finalText = finalText == null || finalText.length == 0 ? "" : "<p><i>Attribute</i></p>"+finalText;
        $("h4#title").text(path);
        $("p#tag").text("Tag: " + this.textContent);
        $("p#description").text(selected.attr("description"));
        $("div#metadata").html(finalText);
    })
    $("#hed").html("HED v" + $("#hed-version").text());
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
        $("#schema").find(".collapse").removeClass("show");
        $("#schema").attr("status","hide");
    }
    else {
        $("#schema").find(".collapse").addClass("show");
        $("#schema").attr("status","show");
    }
}
