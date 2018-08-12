'<%import-packages%>'

const { Component } = wp.element;
const { InspectorControls } = wp.editor;

class <%InspectorController%> extends Component {
    constructor(props) {
        super(this);
    }

    <%functions%>

    render() {
        return(
            <InspectorControls>
                <%fields%>
            </InspectorControls>
        )
    }    
}