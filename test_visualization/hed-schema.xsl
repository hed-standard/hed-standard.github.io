<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform">

<xsl:template match="node[not(node)]">
	<li description="{description}"><xsl:value-of select="name"/></li>
	<div class="attribute" style="display: none">
	<xsl:for-each select="@*">
		<xsl:value-of select="name(.)"/>:<xsl:value-of select="."/>, 
	</xsl:for-each>
	</div>
</xsl:template>

<xsl:template match="node[node]">
	<li description="{description}"><xsl:value-of select="name"/>
	<ul>
		<xsl:apply-templates select="node"/>
	</ul>
	<div class="attribute" style="display: none">
		<xsl:for-each select="@*">
			<xsl:value-of select="name(.)"/>:<xsl:value-of select="."/>,
		</xsl:for-each>
	</div>
	</li>
</xsl:template>

<xsl:template match="/">
	<xsl:apply-templates />
</xsl:template>

</xsl:stylesheet>


