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
const _spinner = _ora({});

// get the configuration.
const _blockFieldJSON = require('../block-fields.json');

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
            _chalk.bgKeyword('purple').white(`${field.slug}`) + _chalk.white(` field is rendering..\n`)
        )
    )

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
 * Replace the template tags.
 * 
 * @since 1.0.0
 */
module.exports._replacetag = () => {
    // when no field were passed.
    if (_blockFieldJSON.fields.length <= 0) {
        console.log(
            _chalk.red(`Oops! seems like no fields were mentioned. Please refer to our documentation.`)
        );
        // Terminate the job.
        process.exit(1);
    }

    // store field temporily.
    let _tmpblockfields = _filesystem.createWriteStream(
        _path.resolve(__dirname, '../tempFields.js'),
    );

    for (field in _blockFieldJSON.fields) {
        let template = _helper._gettp(_blockFieldJSON.fields[field].type);

        // Get the file content.
        let _template = _filesystem.readFileSync(
            _path.resolve(__dirname, template.toString())
        ).toString();

        for (_replacetags in _helper._getrs()) {
            let _rt = new RegExp(_replacetags, "g")
            _template = _template.replace(_rt, _blockFieldJSON.fields[field][_helper._getrs()[_replacetags]] || '')
        }

        // write content.
        _tmpblockfields.write(_template);

        // field created.
        field_spinner(_blockFieldJSON.fields[field], true);
    }

    _tmpblockfields.end();
    
    // requires packages.
    _renderpkg._renderpkg(_blockFieldJSON.fields);
}

/**
 * Render the React Component.
 * 
 * @since 1.0.0
 * 
 * @param {String} packages 
 */
module.exports.renderReactComponent = () => {
    // if no field found!
    if (!_blockFieldJSON.fields.length) {
        // make fail.
        _spinner.fail(
            _chalk.red(`no fields to process`)
        )

        // exit.
        process.exit(1)
    }

    // output dir.
    let outputDir = _blockFieldJSON.output || './BlockControllers';

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
        _helper.makeComponentName(_blockFieldJSON.name)
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

    // unlink temp files.
    _filesystem.unlinkSync(_path.resolve(__dirname, '../tempFields.js'))
    _filesystem.unlinkSync(_path.resolve(__dirname, '../tempPKG.js'))
}