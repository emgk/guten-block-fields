const { Component } = wp.element;
const { InspectorControls } = wp.editor;
const { PlainText,RichText } = wp.editor; 

/**
 * MyControllers Block controller
 * 
 */
class MyControllers extends Component {
   
    /**
     * Constructor method.
     * 
     * @param {*} props 
     */
    constructor(props) {
        super(this);
    }

    /**
     * Render method.
     */
    render() {
        return (
            <InspectorControls>
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
    
            </InspectorControls>
        )
    }
}