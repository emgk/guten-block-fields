<div className="guten-inspect-controller-your-name-wrap">
        <PlainText
            label={ __( "Your Name" ) }
            className="guten-field-your-name"
            onChange={ ( value ) => {
                 this.props.setAttributes({name:value})
                 // this.setState({<%field-attributeName%>:value})
            }}
            value={ 123 }
        />
</div>
    