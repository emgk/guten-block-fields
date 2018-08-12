const fs = require('fs');
const path = require('path');
const chalk = require('chalk');
const renderField = require('./renderField');

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

    // Terminate the file system.
    tempFieldsCode.end();
}