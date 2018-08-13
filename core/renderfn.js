const _filesystem = require('fs');
const _ora = require('ora');
const _path = require('path');
const _shell = require('shelljs');
const _chalk = require('chalk');

// helper func
const _helper = require('./tools');

// func to render the packages.
const _renderpkg = require('./renderPackages');

// Set _spinner.
const _spinner = _ora({ text: '' });

/**
 * Show status of the field generator.
 * 
 * @since 1.0.0
 * 
 * @param {object} field 
 * @param {boolean} iscompleted 
 */
const field_spinner = (field, iscompleted) => {
    // Set start.
    _spinner.start(
        console.log(
            _chalk.green(`Generating field "${field.title}"`)
        )
    );

    // If isn't completed.
    if (!iscompleted) {
        _spinner.fail(
            _chalk.red(`"${field.title}" unable to generated.`)
        )
    } else {
        // Completed.
        setTimeout(() => {
            _spinner.succeed(_chalk.green(`"${field.title}" field generated successfully!`));
        }, 2000);
    }
}

/**
 * Render the TextPlain field.
 * 
 * @since 1.0.0
 * 
 * @param {object} field 
 * @param {_filesystem} file 
 */
module.exports.renderTextField = (field, file) => {
    // Get the template.
    let template = _path.resolve(__dirname, '../gic-scripts/fields/PlainText.tpl');

    // Get the file content.
    let textFieldCode = _filesystem.readFileSync(template).toString();

    // Replace the content.
    textFieldCode = textFieldCode.replace(`<%field-title%>`, `"${field.title}"`);
    textFieldCode = textFieldCode.replace(/<%field-slug%>/g, `${field.slug}`);
    textFieldCode = textFieldCode.replace(`<%field-attributeName%>`, `${_helper.makeComponentName(field.attributeName)}`);
    textFieldCode = textFieldCode.replace(`<%field-value%>`, `${_helper.makeComponentName(field.value)}`);

    // Success.
    field_spinner(field, true);

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
 * @param {object} blockfields
 */
module.exports.renderReactComponent = (componentName, blockfields) => {
    // if no field found!
    if (!blockfields.fields.length) {
        // make fail.
        _spinner.fail(
            _chalk.red(`no fields to process`)
        )

        // exit.
        process.exit(1)
    }

    // Require packages.
    _renderpkg(blockfields.fields);

    // Get the block component template.
    let
        packageListCode = _filesystem.readFileSync(_path.resolve(__dirname, '../tempPKG.js')).toString();

    let outputDir = blockfields.output || './BlockControllers';

    if (!_filesystem.existsSync(outputDir)) {
        _shell.mkdir('-p', outputDir);
    }

    // Get react component template.
    let ReactComponent = _filesystem.readFileSync(_helper.getComponentTemplate()).toString();

    // import packages.
    ReactComponent = ReactComponent.replace(
        `#import-packages#`,
        packageListCode
    )

    // Set ReactComponent name.
    ReactComponent = ReactComponent.replace(
        /#ComponentName#/g,
        _helper.makeComponentName(blockfields.name)
    )

    // import fields.
    ReactComponent = ReactComponent.replace(
        `#fields#`,
        _filesystem.readFileSync(_path.resolve(__dirname, '../tempFields.js')).toString()
    )

    _filesystem.writeFileSync(
        `${outputDir}/BlockControllers.js`,
        ReactComponent
    )
}