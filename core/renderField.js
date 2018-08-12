const path = require('path');
const fs = require('fs');
const chalk = require('chalk');
const ora = require('ora');

const validate = require('./validates');
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

module.exports.renderTextField = (field, file) => {
    // Get the template.
    let template = path.resolve(__dirname, '../gic-scripts/fields/TextPlain.tpl');

    // Get the file content.
    let textFieldCode = fs.readFileSync(template).toString();

    // Replace the content.
    textFieldCode = textFieldCode.replace(`<%field-title%>`, `"${field.title}"`);
    textFieldCode = textFieldCode.replace(/<%field-slug%>/g, `${field.slug}`);
    textFieldCode = textFieldCode.replace(`<%field-name%>`, `${validate.makeComponentName(field.slug)}`);
    textFieldCode = textFieldCode.replace(`<%field-value%>`, `${validate.makeComponentName(field.value)}`);

    // Success.
    fieldSpinner(field, true);

    // Write the content.
    file.write(textFieldCode);
};