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
    <div className="guten-inspect-controller-father-name-wrap">
        <PlainText
            label={ __( "Your father name" ) }
            className="guten-field-father-name"
            onChange={ ( value ) => {
                 this.props.setAttributes({name:value})
                 // this.setState({<%field-attributeName%>:value})
            }}
            value={ 123 }
        />
</div>
    <div className="guten-inspect-controller-city-name-wrap">
        <PlainText
            label={ __( "City name" ) }
            className="guten-field-city-name"
            onChange={ ( value ) => {
                 this.props.setAttributes({name:value})
                 // this.setState({<%field-attributeName%>:value})
            }}
            value={ 123 }
        />
</div>
    