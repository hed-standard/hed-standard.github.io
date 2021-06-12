<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform">

<xsl:template match="node[not(node)]">
	<xsl:param name="level"/>
	<xsl:param name="nodeName"/>
	<a description="{description}" role="button" class="list-group-item"><xsl:value-of select="name"/></a>
	<xsl:apply-templates select="attribute">
		<xsl:with-param name="nodeName" select="name"/>
	</xsl:apply-templates>
</xsl:template>

<xsl:template match="node[node]">
	<xsl:param name="level"/>
	<xsl:param name="nodeName"/>
	<!--for href, name of HED tag must be whitespace stripped and must not start with digit (e.g. "2D shape" bug)-->
	<a href="#{translate(translate(name,' ','_'), '0123456789','zowhfvsneit')}" description="{description}" role="button" class="list-group-item" data-toggle="collapse" aria-expanded="true"><xsl:value-of select="name"/></a>
	<xsl:apply-templates select="attribute">
		<xsl:with-param name="nodeName" select="name"/>
	</xsl:apply-templates>
	<div class="list-group collapse multi-collapse level-{$level} show" id="{translate(translate(name,' ','_'),'0123456789','zowhfvsneit')}">
		<xsl:apply-templates select="node">
			<xsl:with-param name="level" select="$level + 1"/>
		</xsl:apply-templates>
	</div>

</xsl:template>

<xsl:template match="attribute">
	<xsl:param name="nodeName"/>
	<div class="attribute" style="display: none" name="{$nodeName}">
	<xsl:value-of select="name"/>: 
	<xsl:choose>
        	<xsl:when test="value">
			<xsl:for-each select="value">
				<xsl:value-of select="."/>,
			</xsl:for-each> 
		</xsl:when>
        	<xsl:otherwise>true</xsl:otherwise> 
	</xsl:choose>
	</div>
</xsl:template>

<xsl:template match="unit">
	<a class="list-group-item"><xsl:value-of select="name"/></a>
	<div class="attribute" style="display: none">
	<xsl:for-each select="@*">
		<xsl:value-of select="name(.)"/>: <xsl:value-of select="."/>,
	</xsl:for-each>
	</div>
</xsl:template>

<xsl:template match="unitClasses">
	<a class="list-group-item" data-toggle="collapse">Unit Classes</a>
	<div class="list-group collapse multi-collapse show">
		<xsl:for-each select="unitClass">
			<a description="" class="list-group-item" data-toggle="collapse"><xsl:value-of select="name"/></a>
			<div class="attribute" style="display: none">
				<xsl:for-each select="@*">
					<xsl:value-of select="name(.)"/>: <xsl:value-of select="."/>,
				</xsl:for-each>
			</div>
			<div class="list-group collapse multi-collapse show" >
				<xsl:for-each select="units/unit">
					<a description="" class="list-group-item"><xsl:value-of select="name"/></a>
					<div class="attribute" style="display: none">
						<xsl:for-each select="@*">
							<xsl:value-of select="name(.)"/>: <xsl:value-of select="."/>,
						</xsl:for-each>
					</div>
				</xsl:for-each>
			</div>
		</xsl:for-each>
	</div>
</xsl:template>

<xsl:template match="unitModifiers">
	<a class="list-group-item" data-toggle="collapse">Unit Modifiers</a>
	<div class="list-group collapse multi-collapse show">
		<xsl:for-each select="unitModifier">
			<a description="{description}" class="list-group-item" data-toggle="collapse"><xsl:value-of select="name"/></a>
			<div class="attribute" style="display: none">
				<xsl:for-each select="@*">
					<xsl:value-of select="name(.)"/>: <xsl:value-of select="."/>,
				</xsl:for-each>
			</div>
		</xsl:for-each>
	</div>
</xsl:template>

<xsl:param name="level"/>
<xsl:param name="nodeName"/>
<xsl:template match="schema">
	<xsl:apply-templates select="node">
		<xsl:with-param name="level" select='1'/>
	</xsl:apply-templates>
</xsl:template>

<xsl:template match="/HED">
	<div id="hed-version" style="display: none;"><xsl:value-of select="@version"/></div>
	<xsl:apply-templates select="schema"/>
</xsl:template>

<xsl:template match="/">
	<xsl:apply-templates />
</xsl:template>

</xsl:stylesheet>

