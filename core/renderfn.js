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
            _chalk.bgKeyword('purple').white(`${field.slug || field.title}`) + _chalk.white(` field is rendering..\n`)
        )
    )

    // If isn't completed.
    if (!iscompleted) {
        _spinner.fail(
            _chalk.bgKeyword('red').black(`"${field.slug || field.title}" unable to generated.`)
        )
    } else {
        // Completed.
        setTimeout(() => {
            _spinner.succeed(
                _chalk.bgKeyword('white').black(` ${field.slug || field.title} `) +
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
        let _current_field = _blockFieldJSON.fields[field],
            template = _helper._gettp(_current_field.type);

        // Get the file content.
        let _template = _filesystem.readFileSync(
            _path.resolve(__dirname, template.toString())
        ).toString();

        // text field in most cases.
        for (_replacetags in _helper._getrs()) {
            let _rt = new RegExp(_replacetags, "g")
            _template = _template.replace(_rt, _current_field[_helper._getrs()[_replacetags]] || '')
        }

        // for button.
        if ('button' === _current_field.type) {
            let _baseButtonTemp = _filesystem.readFileSync(
                _path.resolve(__dirname, _helper._gettp('button'))
            ).toString()

            let _buttonTag = '';

            _baseButtonTemp = _baseButtonTemp.replace(`#button-isDefault#`, _current_field.default);
            _baseButtonTemp = _baseButtonTemp.replace(`#button-label#`, _current_field.title);
            _baseButtonTemp = _baseButtonTemp.replace(`#button-class#`, _current_field.class);

            _template = _baseButtonTemp;
        }

        // for checkbox.
        if ('checkbox' === _current_field.type) {
            _template = _template.replace(`#checkbox-title#`, _current_field.title);
            _template = _template.replace(`#checkbox-label#`, _current_field.label);
            _template = _template.replace(`#checkbox-help#`, _current_field.help);
            _template = _template.replace(`#checkbox-isCheck#`, _current_field.checked);
        }

        // for radio.
        if ('radio' === _current_field.type) {
            _template = _template.replace(`#radio-label`, _current_field.label)
            _template = _template.replace(`#radio-help`, _current_field.help)
            _template = _template.replace(`#radio-option`, _current_field.option)
            _template = _template.replace(`#radio-options`, _current_field.options)
        }

        // for select.
        if ("select" === _current_field.type) {
            _template = _template.replace(`#radio-label`, _current_field.label)
            _template = _template.replace(`#radio-value`, _current_field.value)
            _template = _template.replace(`#radio-options`, _current_field.options)
        }

        // for range slider.
        if ("range" === _current_field.type) {
            _template = _template.replace(`#range-label`, _current_field.label)
            _template = _template.replace(`#range-value`, _current_field.value)
            _template = _template.replace(`#range-min`, _current_field.min)
            _template = _template.replace(`#range-max`, _current_field.max)
        }

        // For button group.
        if ('button-group' === _current_field.type) {
            if (_current_field.buttons.length <= 0) {
                _helper._terminate_with_msg(` "buttons" were not passed for field "${_current_field.title}"`, true);
            }

            let _baseButtonGroupTemp = _filesystem.readFileSync(
                _path.resolve(__dirname, _helper._gettp('button-group'))
            ).toString()

            let buttonsHtml = '';

            for (button in _current_field.buttons) {
                buttonsHtml = `${buttonsHtml} \n<Button isPrimary={${_current_field.buttons[button].isPrimary}} className="${_current_field.buttons[button].class}"> ${_current_field.buttons[button].label} </Button>`
            }

            _baseButtonGroupTemp = _baseButtonGroupTemp.replace(`#button-loop#`, buttonsHtml);
            _template = _baseButtonGroupTemp;
        }

        // base control.
        if (_current_field.baseControl) {
            if (!_current_field.baseControlOption) {
                _helper._terminate_with_msg(` "baseControlOption" were not passed for field "${_current_field.title}"`, true);
            }

            let _basecontrolTemplate = _filesystem.readFileSync(
                _path.resolve(__dirname, _helper._gettp('basecontrol'))
            ).toString()

            _basecontrolTemplate = _basecontrolTemplate.replace('#field-base-id#', `base-control-${_current_field.slug}`)
            _basecontrolTemplate = _basecontrolTemplate.replace('#field-base-label#', `${_current_field.baseControlOption.label || ''}`)
            _basecontrolTemplate = _basecontrolTemplate.replace('#field-base-help#', `${_current_field.baseControlOption.help || ''}`)
            _basecontrolTemplate = _basecontrolTemplate.replace('#field-base-html#', `${_template}`)

            _template = _basecontrolTemplate;
        }

        // toggle option.
        if (_current_field.toggle) {
            if (!_current_field.toggleOption) {
                _helper._terminate_with_msg(` "toggleOption" were not passed for field "${_current_field.title}"`, true);
            }

            // get the PanelBody.
            let _panelTemplate = _filesystem.readFileSync(_path.resolve(__dirname, _helper._gettp('toggle'))).toString();

            _panelTemplate = _panelTemplate.replace('#toggle-isOpen#', _current_field.toggleOption.isOpen.toString() || false);
            _panelTemplate = _panelTemplate.replace('#toggle-title#', _current_field.toggleOption.title || _current_field.title);
            _panelTemplate = _panelTemplate.replace('#toogle-body#', `${_template}`);

            _template = _panelTemplate;
        }

        // write content.
        _tmpblockfields.write(_template);

        // field created.
        field_spinner(_current_field, true);
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