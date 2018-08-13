const { Component } = wp.element;
const { InspectorControls } = wp.editor;
const { __ } = wp.i18n;
const { TextControl,PanelBody,BaseControl,CheckboxControl,Button,ButtonGroup,SelectControl,RadioControl,RangeControl } = wp.components; 

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
        super(...arguments);
    }

    /**
     * Render method.
     */
    render() {
        return (
            <InspectorControls>
                <PanelBody initialOpen={false} title={[__('Your name please.')]}>
    <BaseControl id="base-control-your-name" label={__('Enter your name')} help={ __('your name will help us to identify you!')} >
    <TextControl
    label={ __( 'Your Name' ) }
    className="guten-field-your-name"
    onChange={ ( value ) => {
            // this.props.setAttributes({name:value})
            // this.setState({name:value})
    }}
    value={ 123 }
/>

</BaseControl>

</PanelBody>
<CheckboxControl
		heading="Accept t&c"
		label="Sample"
		help="This is help section"
		checked={ true }
		onChange={ ( isChecked ) => {
			 // setState( { isChecked } ) 
		} }
/>
<Button className="save" false>
	Save Changes
</Button>
<ButtonGroup>
     
<Button isPrimary={true} className="red"> Red </Button> 
<Button isPrimary={false} className="blue"> Blue </Button>
</ButtonGroup>
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
<SelectControl
		label="Country"
		value={ india }
		options={ [{"label":"India","value":"india"},{"label":"USA","value":"usa"}] }
		onChange={ ( size ) => { /* setState( { size } ) */ } }
/><RadioControl
		label="Gender"
		help="undefined"
		selected={ undefined }
		options={ [{"label":"Male","value":"m"},{"label":"Female","value":"f"}] }
		onChange={ ( option ) => { 
            setState( { option } ) 
            } 
        }
/> <RangeControl
        label="Volume"
        value={40 }
        onChange={ ( columns ) => /* setState( { columns }  )*/ }
        min={ 1 }
        max={ 100 }
/>
            </InspectorControls>
        )
    }
}

export default MyControllers;