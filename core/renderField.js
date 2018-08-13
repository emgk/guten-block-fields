const fs = require('fs');
const ora = require('ora');
const path = require('path');
const chalk = require('chalk');
const validate = require('./validates');
const packagesfn = require('./packagefn');

// Set spinner.
const spinner = ora({ text: '' });

/**
 * Show status of the field generator.
 * 
 * @since 1.0.0
 * 
 * @param {object} field 
 * @param {boolean} iscompleted 
 */
const fieldSpinner = (field, iscompleted) => {
    // Set start.
    spinner.start(
        console.log(
            chalk.green(`Generating field "${field.title}"`)
        )
    );

    // If isn't completed.
    if (!iscompleted) {
        spinner.fail(
            chalk.red(`"${field.title}" unable to generated.`)
        )
    } else {
        // Completed.
        setTimeout(() => {
            spinner.succeed(chalk.green(`"${field.title}" field generated successfully!`));
        }, 2000);
    }
}

/**
 * Render the TextPlain field.
 * 
 * @since 1.0.0
 * 
 * @param {object} field 
 * @param {fs} file 
 */
module.exports.renderTextField = (field, file) => {
    // Get the template.
    let template = path.resolve(__dirname, '../gic-scripts/fields/TextPlain.tpl');

    // Get the file content.
    let textFieldCode = fs.readFileSync(template).toString();

    // Replace the content.
    textFieldCode = textFieldCode.replace(`<%field-title%>`, `"${field.title}"`);
    textFieldCode = textFieldCode.replace(/<%field-slug%>/g, `${field.slug}`);
    textFieldCode = textFieldCode.replace(`<%field-attributeName%>`, `${validate.makeComponentName(field.attributeName)}`);
    textFieldCode = textFieldCode.replace(`<%field-value%>`, `${validate.makeComponentName(field.value)}`);

    // Success.
    fieldSpinner(field, true);

    // Write the content.
    file.write(textFieldCode);
};

/**
 * Render the React Component.
 * 
 * @since 1.0.0
 * 
 * @param {String} componentName 
 * @param {String} packages 
 * @param {String} fields 
 */
module.exports.renderReactComponent = (componentName, fields) => {
    // Get the block component template.
    let blockComponent = path.resolve(__dirname, '../gic-scripts/blockComponent');

    if (!fields.length) {
        spinner.fail(
            chalk.red(`no fields to process`)
        )
        process.exit(1)
    }


    // Store packages code.
    let packageToImport = fs.createWriteStream(path.resolve(__dirname, '../tempPKG.js'));

    // Require packages.
    let pacakges = packagesfn.getPackages(fields);

    console.log(pacakges);

};