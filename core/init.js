const _fs = require('fs');
const _path = require('path');
const _chalk = require('chalk');
const _tools = require('./tools');

// render func.
const _render_field = require('./renderfn');

// Get the fields.
const _blockFieldJSON = require('../block-fields.json');

// Generate fields and blocks.
module.exports.generateBlocks = () => {

    // If no field were mentioned.
    if (_blockFieldJSON.fields.length <= 0) {
        console.log(
            _chalk.red(`No fields were mentioned!`)
        );
        // Terminate the job.
        process.exit(1);
    }

    // Create file where all the field code would be store as temporarily.
    let tempFieldsCode = _fs.createWriteStream(_path.resolve(__dirname, '../tempFields.js'));

    // Go through each of the field.
    for (field in _blockFieldJSON.fields) {
        switch (_blockFieldJSON.fields[field].type) {
            case 'text':
                _render_field.renderTextField(_blockFieldJSON.fields[field], tempFieldsCode);
                break;
        }
    }

    // Terminate the file system.
    tempFieldsCode.end();

    setTimeout(() => {
        // Render the react block component.
        _render_field.renderReactComponent(
            _tools.makeComponentName(_blockFieldJSON.name),
            _blockFieldJSON
        );
    }, 100);
}