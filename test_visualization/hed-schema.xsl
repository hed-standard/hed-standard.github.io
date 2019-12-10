<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform">

<xsl:template match="node[not(node)]">
	<a description="{description}" class="list-group-item"><xsl:value-of select="name"/></a>
	<div class="attribute" style="display: none">
	<xsl:for-each select="@*">
		<xsl:value-of select="name(.)"/>:<xsl:value-of select="."/>, 
	</xsl:for-each>
	</div>
</xsl:template>

<xsl:template match="node[node]">
	<a href="#{translate(name,' ','_')}" description="{description}" class="list-group-item" data-toggle="collapse"><xsl:value-of select="name"/></a>
	<div class="attribute" style="display: none">
		<xsl:for-each select="@*">
			<xsl:value-of select="name(.)"/>:<xsl:value-of select="."/>,
		</xsl:for-each>
	</div>
	<div class="list-group collapse multi-collapse show" id="{translate(name,' ','_')}">
		<xsl:apply-templates select="node"/>
	</div>

</xsl:template>

<xsl:template match="/">
	<xsl:apply-templates />
</xsl:template>

</xsl:stylesheet>

