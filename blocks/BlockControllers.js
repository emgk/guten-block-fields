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
                
            </InspectorControls>
        )
    }
}