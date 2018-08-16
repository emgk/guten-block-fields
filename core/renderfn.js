const _filesystem = require('fs');
const _ora = require('ora');
const _path = require('path');
const _shell = require('shelljs');
const _chalk = require('chalk');

// helper func
const _helper = require('./tools');

// func to render the packages.
const _renderpkg = require('./renderPackages');

// replace multiple string.
const _replaceString = require('./replacestring');

// Set _spinner.
const _spinner = _ora({});

// get the configuration.
const _blockFieldJSON = _helper._get_fields_json()

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
            _chalk.bgKeyword('purple').white(`${field.slug || field.title}`) + _chalk.white(`\n[field is creating..]\n`)
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
                _chalk.white('\n [100% completed..]\n'));
        }, 100);
    }
}

/**
 * Render the field.
 * 
 * @since 1.0.0
 * 
 * @param {Object} field 
 */
module.exports._renderfield = (_current_field) => {
    let
        _template_path = _helper._gettp(_current_field.type),
        _template = _helper._getFileContent(_template_path.toString());

    if (!_template) {
        _helper._terminate_with_msg(`Template isn't found for field "${_current_field.title}"`, true);
    }

    // base control.
    if ("undefined" === typeof _current_field.baseControl || true === _current_field.baseControl) {
        _current_field.baseControl = true;

        let _basecontrolTemplate = _filesystem.readFileSync(
            _path.resolve(__dirname, _helper._gettp('basecontrol'))
        ).toString()

        const label = _current_field.label ? `__('${_current_field.label}')` : '';
        const help = _current_field.help ? `__('${_current_field.help}')` : '';

        _template = _replaceString(_basecontrolTemplate, {
            '#field-base-id#': _current_field.slug || '',
            '#field-base-label#': label,
            '#field-base-help#': help,
            '#field-base-html#': _template
        });
    }

    // replace common field for all fields.
    for (_replacetags in _helper._getrs()) {
        let _rt = new RegExp(_replacetags, "g")
        _template = _template.replace(_rt, _current_field[_helper._getrs()[_replacetags]] || '')
    }

    switch (_current_field.type) {
        case 'text':
        case 'button':
            _template = _replaceString(_template, {
                '#field-isDefault#': _current_field.default,
            })
            break;
        case 'checkbox':
            _template = _replaceString(_template, {
                '#field-isCheck#': _current_field.checked,
            })
            break;

        case 'radio':
            _template = _replaceString(_template, {
                '#field-option#': _current_field.option,
                '#field-options#': JSON.stringify(_current_field.options),
            })
            break;
        case 'select':
            _template = _replaceString(_template, {
                '#field-options#': JSON.stringify(_current_field.options),
            })
            break;
        case 'range':
            _template = _replaceString(_template, {
                '#range-min#': _current_field.min,
                '#range-max#': _current_field.max,
            })
            break;
        case 'button-group':
            if (_current_field.buttons.length <= 0) {
                _helper._terminate_with_msg(` "buttons" were not passed for field "${_current_field.title}"`, true);
            }

            // get the template of button group.
            let
                _baseButtonGroupTemp = _helper._getFileContent(_helper._gettp('button-group')),
                buttonsHtml = '';

            for (button in _current_field.buttons) {
                buttonsHtml = `${buttonsHtml} \n<Button isPrimary={${_current_field.buttons[button].isPrimary}} className="${_current_field.buttons[button].class}"> ${_current_field.buttons[button].label} </Button>`
            }

            _template = _baseButtonGroupTemp.replace(`#button-loop#`, buttonsHtml);
            break;
        default:
            _helper._terminate_with_msg(`"${_current_field.type}" is invalid field type.`, false)
    }

    // field created.
    field_spinner(_current_field, true);

    return _template;
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

    let _template = '';

    // Get the toggles.
    const _toggles = _helper._get_toggles();
    const _toggle_fields = {};

    // store field temporily.
    let _tmpblockfields = _filesystem.createWriteStream(
        _path.resolve(__dirname, '../tempFields.js'),
    );

    if ("undefined" !== typeof _toggles) {
        for (_toggle in _toggles) {
            let _toggle_code = '';

            for (field in _blockFieldJSON.fields) {
                const _curr_field = _blockFieldJSON.fields[field]
                if (
                    "undefined" !== _curr_field.toggle
                    && false !== _curr_field.toggle
                    && _toggle.toString() === _curr_field.toggle
                ) {
                    _toggle_code = `${_toggle_code} \n ${this._renderfield(_curr_field)}`
                }
            }
            _toggle_fields[_toggle] = _toggle_code
        }
    }

    if (Object.keys(_toggle_fields).length > 0) {
        for (_toggle_field in _toggle_fields) {

            // get the PanelBody.
            let _toggleField = _filesystem.readFileSync(_path.resolve(__dirname, _helper._gettp('toggle'))).toString()

            _toggleField = _replaceString(_toggleField, {
                '#toggle-isOpen#': _toggles[_toggle_field].isOpen.toString() || false,
                '#toggle-title#': _toggles[_toggle_field].title || '',
                '#toogle-body#': _toggle_fields[_toggle_field]
            })

            _template = `${_template} \n ${_toggleField}`;
        }
    }

    for (field in _blockFieldJSON.fields) {
        if (
            Object.keys(_toggles).includes(_blockFieldJSON.fields[field].toggle)
            && _blockFieldJSON.fields[field].toggle
        ) {
            continue;
        }
        _template = `${_template} \n ${this._renderfield(_blockFieldJSON.fields[field])}`
    }

    // write content.
    _tmpblockfields.write(_template);

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
        _renderpkg._get_package_strings(_blockFieldJSON.fields)
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

    console.log(
        _chalk
            .blue(`Inspect Controller has been generated, add this below code at the top of your block file.`) +
        _chalk
            .bgKeyword('black')
            .yellow(`\n\nimport { ${_helper.makeComponentName(_blockFieldJSON.name)}} from '${outputDir}/BlockControllers';`) +
        _chalk
            .blue(`\n\n and add this Tag to your block's edit method \n\n`) +
        _chalk
            .bgKeyword('black')
            .yellow(`<${_helper.makeComponentName(_blockFieldJSON.name)}/>`)
    )
}