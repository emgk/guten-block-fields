const _fs = require('fs');
const _path = require('path');
const _chalk = require('chalk');

// helper function to render the tools.
const _render_field = require('./renderfn');

// get the block toolbar options and list of fields.
const _blockFieldJSON = require('../block-fields.json');

// generate the blocks.
module.exports.generateBlocks = () => {
    // when no field were passed.
    if (_blockFieldJSON.fields.length <= 0) {
        console.log(
            _chalk.red(`Oops! seems like no fields were mentioned. Please refer to our documentation.`)
        );
        // Terminate the job.
        process.exit(1);
    }

    for (field in _blockFieldJSON.fields) {
        _render_field._replacetag(_blockFieldJSON.fields[field]);
    }

    setTimeout(() => {
        // Render the react block component.
        _render_field.renderReactComponent(
            _blockFieldJSON
        );
    }, 100);
}