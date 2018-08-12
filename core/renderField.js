const path = require('path');
const fs = require('fs');
const chalk = require('chalk');
const spinner = require('ora');

const validate = require('./validates');
const spinner = ora({ text: '' });

module.exports.renderTextField = (field) => {
    let template = path.resolve(__dirname, '../gic-scripts/fields/text.tpl');

    spinner.start(
        console.log(
            chalk.green(`Generating field "${field.title}"`)
        )
    );

    // Get the file content.
    fs.readFile(template, 'utf8', (err, contents) => {

        // If error.
        if (err) {
            console.log(
                chalk.red(`Error while loading TextPlain template.`)
            )
            process.exit(1);
        }

        let textFieldContent = contents.toString();

        // Replace the content.
        textFieldContent = textFieldContent.replace(`<%field-title%>`, `"${field.title}"`);
        textFieldContent = textFieldContent.replace(`<%field-slug%>`, `${field.slug}`);
        textFieldContent = textFieldContent.replace(`<%field-slug%>`, `${validate.makeComponentName(field.slug)}`);

        // Completed.
        setTimeout(() => {
            spinner.succeed(chalk.green(`${field.title} generated successfully!`));
        }, 1000);

        return textFieldContent;
    });
}