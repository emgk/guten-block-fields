const { Component } = wp.element;
const { InspectorControls } = wp.editor;
const { __ } = wp.i18n;
#import-packages#
/**
 * #ComponentName# Block controller
 * 
 */
class #ComponentName# extends Component {
   
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
                #fields#
            </InspectorControls>
        )
    }
}

export default #ComponentName#;