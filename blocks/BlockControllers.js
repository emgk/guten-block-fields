const { Component } = wp.element;
const { InspectorControls } = wp.editor;
const { PlainText } = wp.editor; 

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
                <div className="guten-inspect-controller-city-name-wrap">
        <PlainText
            label={ __( City name ) }
            className="guten-field-city-name"
            onChange={ ( value ) => {
                 // this.props.setAttributes({name:value})
                 // this.setState({name:value})
            }}
            value={ #field-value# }
        />
</div>
    /div>
    
            </InspectorControls>
        )
    }
}