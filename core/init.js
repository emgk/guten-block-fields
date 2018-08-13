const fs = require('fs');
const path = require('path');
const chalk = require('chalk');
const renderField = require('./renderField');
const helper = require('./tools');

// Get the fields.
const inspectorControllers = require('../block-fields.json');

// Generate fields and blocks.
module.exports.generateBlocks = () => {

    // If no field were mentioned.
    if (inspectorControllers.fields.length <= 0) {
        console.log(
            chalk.red(`No fields were mentioned!`)
        );
        // Terminate the job.
        process.exit(1);
    }

    // Get the react component name.
    let blockComponentName = helper.makeComponentName(inspectorControllers.name);

    // Create file where all the field code would be store as temporarily.
    let tempFieldsCode = fs.createWriteStream(path.resolve(__dirname, '../tempFields.js'));

    // Go through each of the field.
    for (field in inspectorControllers.fields) {
        switch (inspectorControllers.fields[field].type) {
            case 'text':
                renderField.renderTextField(inspectorControllers.fields[field], tempFieldsCode);
                break;
        }
    }

    // Render the react block component.
    renderField.renderReactComponent(blockComponentName, inspectorControllers);

    // Terminate the file system.
    tempFieldsCode.end();
}