// helper function to render the tools.
const _render_field = require('./renderfn');

// generate the blocks.
module.exports.generateBlocks = () => {

    // render and replace tags
    _render_field._replacetag();

    setTimeout(() => {
        _render_field.renderReactComponent()
    }, 100);
}