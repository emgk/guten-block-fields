<div className="guten-inspect-controller-<%field-slug%>-wrap">
        <PlainText
            label={ __( <%field-title%> ) }
            className="field-<%field-slug%>"
            onChange={ ( value ) => { this.props.setAttributes({<%field-attributeName%>:value}) }}
            value={ <%field-value%> }
        />
</div>