const { Component } = wp.element;
const { InspectorControls } = wp.editor;
const { TextControl } = wp.components; 

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
                <TextControl
    label={ __( 'Your Name' ) }
    className="guten-field-your-name"
    onChange={ ( value ) => {
            // this.props.setAttributes({name:value})
            // this.setState({name:value})
    }}
    value={ 123 }
/>
<TextControl
    label={ __( 'Your father name' ) }
    className="guten-field-father-name"
    onChange={ ( value ) => {
            // this.props.setAttributes({name:value})
            // this.setState({name:value})
    }}
    value={ 123 }
/>
<TextControl
    label={ __( 'City name' ) }
    className="guten-field-city-name"
    onChange={ ( value ) => {
            // this.props.setAttributes({name:value})
            // this.setState({name:value})
    }}
    value={ 123 }
/>

            </InspectorControls>
        )
    }
}

export default MyControllers;