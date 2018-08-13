const _fs = require('fs');
const _path = require('path');
const _chalk = require('chalk');
const _tools = require('./tools');

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

    // Create file where all the field code would be store as temporarily.
    let _tmpblockfields = _fs.createWriteStream(_path.resolve(__dirname, '../tempFields.js'));

    // Go through each of the field.
    for (field in _blockFieldJSON.fields) {
        switch (_blockFieldJSON.fields[field].type) {
            case 'text':
                _render_field._renderTextField(_blockFieldJSON.fields[field], _tmpblockfields);
                break;
        }
    }

    // close the file.
    _tmpblockfields.end();

    // render the react component.
    setTimeout(() => {
        // Render the react block component.
        _render_field.renderReactComponent(
            _blockFieldJSON
        );
    }, 100);
}