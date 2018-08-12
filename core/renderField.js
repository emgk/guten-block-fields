const path = require('path');
const fs = require('fs');

const validate = require('./validates');

module.exports.renderTextField = (field) => {
    let template = path.resolve(__dirname, '../gic-scripts/fields/text.tpl');

    fs.readFile(template, 'utf8', (err, contents) => {
        let tempContents = contents.toString();

        // Replace the content.
        tempContents = tempContents.replace(`<%field-title%>`, `"${field.title}"`);
        tempContents = tempContents.replace(`<%field-slug%>`, `${field.slug}`);
        tempContents = tempContents.replace(`<%field-slug%>`, `${validate.makeComponentName(field.slug)}`);

        console.log(tempContents);
    });
}