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
const _spinner = _ora({ text: 'Generating has been started!' });

/**
 * Show status of the field generator.
 * 
 * @since 1.0.0
 * 
 * @param {object} field 
 * @param {boolean} iscompleted 
 */
const field_spinner = (field, iscompleted) => {

    setTimeout(() => {
        // Set start.
        _spinner.start(
            console.log(
                _chalk.bgKeyword('purple').white(`${field.slug}`) + _chalk.white(` field is rendering..\n`)
            )
        )
    }, 100)

    // If isn't completed.
    if (!iscompleted) {
        _spinner.fail(
            _chalk.bgKeyword('red').black(`"${field.slug}" unable to generated.`)
        )
    } else {
        // Completed.
        setTimeout(() => {
            _spinner.succeed(
                _chalk.bgKeyword('white').black(` ${field.slug} `) +
                _chalk.white(' field generated successfully..\n'));
        }, 100);
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
module.exports._renderTextField = (field, file) => {
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
 * @param {String} packages 
 * @param {object} blockfields
 */
module.exports.renderReactComponent = (blockfields) => {
    // if no field found!
    if (!blockfields.fields.length) {
        // make fail.
        _spinner.fail(
            _chalk.red(`no fields to process`)
        )

        // exit.
        process.exit(1)
    }

    // requires packages.
    _renderpkg(blockfields.fields);

    // output dir.
    let outputDir = blockfields.output || './BlockControllers';

    // check if exists.
    if (!_filesystem.existsSync(outputDir)) {
        _shell.mkdir('-p', outputDir);
    }

    // Get react component template.
    let _react_component = _filesystem.readFileSync(_helper.getComponentTemplate()).toString();

    // import packages.
    _react_component = _react_component.replace(
        `#import-packages#`,
        _filesystem.readFileSync(_path.resolve(__dirname, '../tempPKG.js')).toString()
    )

    // set react component name.
    _react_component = _react_component.replace(
        /#ComponentName#/g,
        _helper.makeComponentName(blockfields.name)
    )

    // import fields.
    _react_component = _react_component.replace(
        `#fields#`,
        _filesystem.readFileSync(_path.resolve(__dirname, '../tempFields.js')).toString()
    )

    // Todo: format the file.
    _filesystem.writeFileSync(
        `${outputDir}/BlockControllers.js`,
        _react_component
    )
}