function loadSchema(url)
{
    $.get(url, function(data,status) {
        xml = $.parseXML(data);
        displayResult(xml);
    });
}
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

/* Get full path of tag node */
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
function getSchemaVersions() {
    $('#schemaDropdown').empty();
    $.getJSON("https://api.github.com/repos/hed-standard/hed-specification/contents/hedxml",function(data) {
        data.forEach(function(item,index) {
            var version = item["name"].split('*.xml')[0];
            var link = item["download_url"];
            var html = '<a class="dropdown-item" id="schema' + version + '" onclick="loadSchema(\'' + link + '\')">' + version + '</a>';
            $("#schemaDropdown").append(html);
        });

    });
}
