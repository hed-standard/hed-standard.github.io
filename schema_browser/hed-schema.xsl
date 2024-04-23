<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform">

<xsl:template match="node[not(node)]">
	<xsl:param name="level"/>
	<xsl:param name="nodeName"/>
	<a description="{description}" role="button" class="list-group-item level-{$level}" tag="{translate(translate(name,' ','_'), '0123456789','zowhfvsneit')}" name="schemaNode"><xsl:value-of select="name"/></a>
	<xsl:apply-templates select="attribute">
		<xsl:with-param name="nodeName" select="name"/>
	</xsl:apply-templates>
</xsl:template>

<xsl:template match="node[node]">
	<xsl:param name="level"/>
	<xsl:param name="nodeName"/>
	<!--for href, name of HED tag must be whitespace stripped and must not start with digit (e.g. "2D shape" bug). Seems resolved. For legacy: #{translate(translate(name,' ','_'), '0123456789','zowhfvsneit')}-->
    <a href="#x{name}" tag="{name}" description="{description}" role="button" class="list-group-item level-{$level}" data-toggle="collapse" aria-expanded="true" name="schemaNode"><xsl:value-of select="name"/></a>
	<xsl:apply-templates select="attribute">
		<xsl:with-param name="nodeName" select="name"/>
	</xsl:apply-templates>
    <div class="list-group collapse multi-collapse level-{$level} show" id="x{name}">
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
	<xsl:param name="level"/>
	<xsl:param name="nodeName"/>
    <a description="{description}" role="button" class="list-group-item" tag="{name}" name="unitClassDef"><xsl:value-of select="name"/></a>
	<xsl:apply-templates select="attribute">
		<xsl:with-param name="nodeName" select="name"/>
	</xsl:apply-templates>
</xsl:template>

<xsl:template match="unitClassDefinition[unit]">
	<a description="{description}" href="#{translate(translate(name,' ','_'), '0123456789','zowhfvsneit')}" role="button" class="list-group-item" data-toggle="collapse" aria-expanded="true" name="unitClassDef"><xsl:value-of select="name"/></a>
	<xsl:apply-templates select="attribute">
		<xsl:with-param name="nodeName" select="name"/>
	</xsl:apply-templates>
	<div class="list-group collapse multi-collapse level-{$level}" id="{translate(translate(name,' ','_'),'0123456789','zowhfvsneit')}">
		<xsl:apply-templates select="unit"/>
	</div>
</xsl:template>

<xsl:template match="unitModifierDefinition">
	<xsl:param name="level"/>
	<xsl:param name="nodeName"/>
	<a description="{description}" role="button" class="list-group-item" name="unitModifierDef"><xsl:value-of select="name"/></a>
	<xsl:apply-templates select="attribute">
		<xsl:with-param name="nodeName" select="name"/>
	</xsl:apply-templates>
</xsl:template>

<xsl:template match="valueClassDefinition">
	<xsl:param name="level"/>
	<xsl:param name="nodeName"/>
	<a description="{description}" role="button" class="list-group-item" name="valueClassDef"><xsl:value-of select="name"/></a>
	<xsl:apply-templates select="attribute">
		<xsl:with-param name="nodeName" select="name"/>
	</xsl:apply-templates>
</xsl:template>

<xsl:template match="property">
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
<xsl:template match="schemaAttributeDefinition">
	<xsl:param name="level"/>
	<xsl:param name="nodeName"/>
	<a description="{description}" role="button" class="list-group-item" name="attributeDef"><xsl:value-of select="name"/></a>
	<xsl:apply-templates select="property">
		<xsl:with-param name="nodeName" select="name"/>
	</xsl:apply-templates>
</xsl:template>

<xsl:template match="propertyDefinition">
	<xsl:param name="level"/>
	<xsl:param name="nodeName"/>
	<a description="{description}" role="button" class="list-group-item" name="propertyDef"><xsl:value-of select="name"/></a>
	<xsl:apply-templates select="attribute">
		<xsl:with-param name="nodeName" select="name"/>
	</xsl:apply-templates>
</xsl:template>

<xsl:param name="level"/>
<xsl:param name="nodeName"/>
<xsl:template match="schema">
	<xsl:apply-templates select="node">
		<xsl:with-param name="level" select='1'/>
	</xsl:apply-templates>
</xsl:template>
<xsl:template match="unitClassDefinitions">
	<xsl:apply-templates select="unitClassDefinition"/>
</xsl:template>
<xsl:template match="unitModifierDefinitions">
	<xsl:apply-templates select="unitModifierDefinition"/>
</xsl:template>
<xsl:template match="valueClassDefinitions">
	<xsl:apply-templates select="valueClassDefinition"/>
</xsl:template>
<xsl:template match="schemaAttributeDefinitions">
	<xsl:apply-templates select="schemaAttributeDefinition"/>
</xsl:template>
<xsl:template match="propertyDefinitions">
	<xsl:apply-templates select="propertyDefinition"/>
</xsl:template>


<xsl:template match="/HED">
    <!--<div id="hed-version" style="display: none;"><xsl:value-of select="@version"/></div>-->
    <xsl:choose>
        <xsl:when test="@library">
            <div id="hed-version" style="display: none;"><xsl:value-of select="@library"/>_<xsl:value-of select="@version"/></div>
        </xsl:when>
        <xsl:otherwise>
            <div id="hed-version" style="display: none;"><xsl:value-of select="@version"/></div>
        </xsl:otherwise>
    </xsl:choose>

	<div id="schema">
	<xsl:apply-templates select="schema"/>
	</div>
	<div id="prologue">
	<xsl:value-of select="prologue"/>
	</div>
	<div id="epilogue">
	<xsl:value-of select="epilogue"/>
	</div>
	<div id="unitClassDefinitions">
	<xsl:apply-templates select="unitClassDefinitions"/>
	</div>
	<div id="unitModifierDefinitions">
	<xsl:apply-templates select="unitModifierDefinitions"/>
	</div>
	<div id="valueClassDefinitions">
	<xsl:apply-templates select="valueClassDefinitions"/>
	</div>
	<div id="schemaAttributeDefinitions">
	<xsl:apply-templates select="schemaAttributeDefinitions"/>
	</div>
	<div id="propertyDefinitions">
	<xsl:apply-templates select="propertyDefinitions"/>
	</div>
</xsl:template>

<xsl:template match="/">
	<xsl:apply-templates />
</xsl:template>

</xsl:stylesheet>

