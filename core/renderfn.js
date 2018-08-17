const _filesystem = require('fs');
const _ora = require('ora');
const _path = require('path');

// for shell script
const _shell = require('shelljs');

// terminal
const _chalk = require('chalk');

// format JS code.
const _prettier = require("prettier");

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

// store inspector controllers.
let _inspectorControllers = '';

/**
 * Show status of the field generator.
 * 
 * @since 1.0.0
 * 
 * @param {object} field 
 * @param {boolean} iscompleted 
 */
const field_spinner = (field, iscompleted) => {
    _spinner.start(
        console.log(
            _chalk.bgKeyword('purple').white(`${field.id || field.title}`) + _chalk.white(`\n[field is creating..]\n`)
        )
    )

    // If isn't completed.
    if (!iscompleted) {
        _spinner.fail(
            _chalk.bgKeyword('red').black(`"${field.id || field.title}" unable to generated.`)
        )
    } else {
        // Completed.
        setTimeout(() => {
            _spinner.succeed(
                _chalk
                    .bgKeyword('white')
                    .black(` ${field.id || field.title} `) +
                _chalk
                    .white('\n [100% completed..]\n'));
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

    // If field id is missing.
    if ("undefined" === typeof _current_field.id) {
        _helper._terminate_with_msg(`Make sure all fields has unique id, or refer to https://github.com/emgk/guten-block-fields#readme for more info.`, true);
    }

    // Require field type.
    if ("undefined" === typeof _current_field.type) {
        _helper._terminate_with_msg(`Make sure all fields has type, or refer to https://github.com/emgk/guten-block-fields#readme for more info.`, true);
    }

    // Tooltip
    if ("undefined" === typeof _current_field.tooltip) {
        let _tooltip = _filesystem.readFileSync(
            _path.resolve(__dirname, _helper._gettp('tooltip'))
        ).toString()

        let _field_template = _replaceString(_tooltip, {
            '#field-tooltip': _current_field.tooltip,
            '#field-render': _template
        })

        _template = _field_template;
    }

    // base control.
    if (
        "undefined" === typeof _current_field.baseControl ||
        true === _current_field.baseControl
    ) {
        _current_field.baseControl = true;

        let _basecontrolTemplate = _filesystem.readFileSync(
            _path.resolve(__dirname, _helper._gettp('basecontrol'))
        ).toString()

        const label = _current_field.baseControlOptions ? `label={__('${_current_field.baseControlOptions.label || ""}')}` : '';
        const help = _current_field.baseControlOptions ? `help={__('${_current_field.baseControlOptions.help || ""}')}` : '';

        _template = _replaceString(_basecontrolTemplate, {
            '#field-base-id#': _current_field.id || '',
            '#field-base-label#': label,
            '#field-base-help#': help,
            '#field-blockname#': _helper.makeComponentName(_blockFieldJSON.name).toLowerCase(),
            '#field-base-html#': _template
        });
    }

    // replace common field for all fields.
    for (_replacetags in _helper._getrs()) {
        let _rt = new RegExp(_replacetags, "g")
        _template = _template.replace(_rt, _current_field[_helper._getrs()[_replacetags]] || '')
    }

    // Replace value.
    _template = _template.replace(/#field-value#/g, "undefined" !== typeof _current_field.value ? `value="${_current_field.value}"` : ``)

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
                '#field-option-selected#': "undefined" !== typeof _current_field.option ? `selected="${_current_field.option}"` : ``,
                '#field-options#': JSON.stringify(_current_field.options),
            })
            break;
        case 'textarea':
            _template = _replaceString(_template, {
                '#field-row#': _current_field.rows || ``,
            })
            break;
        case 'select':
            _template = _replaceString(_template, {
                '#field-options#': JSON.stringify(_current_field.options),
            })
            break;
        case 'toggle':
            _template = _replaceString(_template, {
                '#field-checked#': "undefined" !== typeof _current_field.checked ? _current_field.checked : ``,
            })
            break;
        case 'datetime':
            _template = _replaceString(_template, {
                '#field-hours#': "undefined" !== typeof _current_field.is12hours ? _current_field.is12hours : true,
                '#field-locale#': _current_field.locale || ``
            })
            break;
        case 'range':
            _template = _replaceString(_template, {
                '#range-min#': _current_field.min,
                '#range-max#': _current_field.max,
            })
            break;
        case 'tree':
            _template = _replaceString(_template, {
                '#field-optionlabel#': _current_field.optionlabel || ``,
                '#field-selectedId#': _current_field.selectedId || ``,
                '#field-tree#': "undefined" === typeof _current_field.tree ? JSON.stringify(_current_field.tree) : `[]`
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
                buttonsHtml = `${buttonsHtml} \n<Button isPrimary={${_current_field.buttons[button].isPrimary}} className="${_current_field.buttons[button].class}" onClick={() => {}}>{__("${_current_field.buttons[button].label}")}</Button>`
            }

            _template = _template.replace(`#button-loop#`, buttonsHtml);
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

    if ("undefined" === typeof _blockFieldJSON.fields) {
        _helper._terminate_with_msg(`No field were passed, Please refer to our documentaion`, true)
    }

    // when no field were passed.
    if (_blockFieldJSON.fields.length <= 0) {
        _helper._terminate_with_msg(`Oops! seems like no fields were mentioned. Please refer to our documentation.`, true)
    }

    let _template = '';

    // Get the toggles.
    const
        _toggles = _helper._get_toggles(),
        _toggle_fields = {};

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
                '#toggle-blockname#': _helper.makeComponentName(_blockFieldJSON.name).toLowerCase(),
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
    _inspectorControllers = `${_inspectorControllers} ${_template}`;
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
        _spinner
            .fail(
                _chalk
                    .red(`no fields to process`)
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
        _inspectorControllers
    )

    _filesystem.writeFileSync(
        `${outputDir}/BlockControllers.js`,
        _prettier.format(_react_component, { semi: false, parser: "babylon", useTabs: true, bracketSpacing: true, jsxBracketSameLine: true, arrowParens: 'always' })
    )

    // write php.
    _filesystem.readFile(
        _path.resolve(__dirname, '../gbf-scripts/code/block-editor.php'),
        (err, content) => {
            content = content.toString().replace(/#component#/g, _helper.makeComponentName(_blockFieldJSON.name).toLowerCase());
            content = content.toString().replace(/#editorStylePath#/g, `/css/editor-style.css`);
            _filesystem.writeFile(
                `${outputDir}/block-editor.php`, content, (res) => {
                    // success.
                })
        }
    )

    // check if exists.
    if (!_filesystem.existsSync(`${outputDir}/css`)) {
        _shell.mkdir('-p', `${outputDir}/css`);
    }


    // write css
    _filesystem.readFile(
        _path.resolve(__dirname, '../gbf-scripts/css/fields-style.css'),
        (err, content) => {
            content = content.toString().replace(/#component#/g, _helper.makeComponentName(_blockFieldJSON.name).toLowerCase());
            _filesystem.writeFile(
                `/css/editor-style.css`, content, (res) => {
                    // success.
                })
        }
    )

    console.log(
        _chalk
            .green(`Inspect Controller has been generated`) +
        _chalk
            .blue(`\n\nStep 1: Add this code at the top of your block file.`) +
        _chalk
            .bgKeyword('black')
            .yellow(`\n\nimport { ${_helper.makeComponentName(_blockFieldJSON.name)}} from '${outputDir}/BlockControllers';`) +
        _chalk
            .blue(`\n\nStep 2: Add this into your block's edit method. \n\n`) +
        _chalk
            .bgKeyword('black')
            .yellow(`<${_helper.makeComponentName(_blockFieldJSON.name)}/>`) +
        _chalk
            .blue(`\n\nStep 3: Add this code to your plugin's main php file.\n`) +
        _chalk
            .bgKeyword('black')
            .yellow(`\n <?php include( plugin_dir_path( __FILE__ ) . '${outputDir.replace('.\/', '')}/block-editor.php'); ?>\n`)
    )
}