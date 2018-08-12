const fs = require('fs');
const path = require('path');
const ora = require('ora');
const chalk = require('chalk');

// Get the fields.
const inspectorControllers = require('../block-controllers.json');

module.exports.generateBlocks = () => {
    // If no field were mentioned.
    if (inspectorControllers.fields.length <= 0) {
        console.log(
            chalk.red(`No fields were mentioned!`)
        );
        // Terminate the job.
        process.exit(1);
    }

    for (field in inspectorControllers.fields) {
        console.log(field);
    }
}