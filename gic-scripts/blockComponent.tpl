const { Component } = wp.element;
const { InspectorControls } = wp.editor;
#import-packages#
/**
 * #ComponentName# 
 * 
 */
class #ComponentName# extends Component {
    /**
    * Constructor method. 
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
                #fields#
            </InspectorControls>
        )
    }
}