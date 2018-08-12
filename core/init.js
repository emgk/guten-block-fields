const fs = require('fs');
const path = require('path');
const ora = require('ora');
const chalk = require('chalk');
const validateFn = require('./validates');
const renderField = require('./renderField');

// Get the fields.
const inspectorControllers = require('../block-controllers.json');

// Loader.
const spinner = ora({ text: '' });

const makeComponent = () => {

}

// Store field block's code.
var fieldBlocks = '';

module.exports.generateBlocks = () => {

    // Process start.
    // spinner.start(
    // chalk.blue(`Generating process has been started... \n`)
    // );

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

    for (field in inspectorControllers.fields) {
        switch (inspectorControllers.fields[field].type) {
            case 'text':
                renderField.renderTextField(inspectorControllers.fields[field], tempFieldsCode);
                break;
        }
    }

    tempFieldsCode.end();
    // setTimeout(() => {
    // spinner.succeed(chalk.green(`File generated successfully!`));
    // }, 1000);
}