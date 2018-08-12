const path = require('path');
const fs = require('fs');
const chalk = require('chalk');
const ora = require('ora');

const validate = require('./validates');
const spinner = ora({ text: '' });

module.exports.renderTextField = (field, file) => {
    // Get the template.
    let template = path.resolve(__dirname, '../gic-scripts/fields/text.tpl');

    // Set start.
    spinner.start(
        console.log(
            chalk.green(`Generating field "${field.title}"`)
        )
    );

    // Get the file content.
    let textFieldCode = fs.readFileSync(template).toString();

    // Replace the content.
    textFieldCode = textFieldCode.replace(`<%field-title%>`, `"${field.title}"`);
    textFieldCode = textFieldCode.replace(`<%field-slug%>`, `${field.slug}`);
    textFieldCode = textFieldCode.replace(`<%field-slug%>`, `${validate.makeComponentName(field.slug)}`);

    // Write the content.
    file.write(textFieldCode);

    // Completed.
    setTimeout(() => {
        spinner.succeed(chalk.green(`"${field.title}" field generated successfully!`));
    }, 2000);
};