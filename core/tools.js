/**
 * Validate and get the field name.
 * 
 * @since 1.0.0
 * @param {String} name 
 */
module.exports.validateFieldName = (name) => {
    return name.replace(/\s+/g, '-').toLowerCase()
}

/**
 * Remove white-space.
 * 
 * @since 1.0.0
 * @param {String} value 
 */
module.exports.makeComponentName = (value) => {
    return value.toString().replace(/\s+/g, '').replace('-', '');
}

/**
 * Get the react component template.
 * 
 * @since 1.0.0
 */
module.exports.getComponentTemplate = () => {
    return require('path').resolve(__dirname, '../gbf-scripts/blockComponent.js');
}

/**
 * Get the block field JSON.
 * 
 * @since 1.0.0
 */
module.exports._get_fields_json = () => {
    const _fs = require('fs');
    const approot = process.cwd();

    if (_fs.existsSync(`${approot}/block-fields.json`)) {
        try {
            const _fields = require(require('path').resolve(approot, './block-fields.json'))
            return _fields;
        } catch (err) {
            this._terminate_with_msg(err, true);
        }
    } else {
        this._terminate_with_msg(`block-fields.json is isn't exists, please refer to documentations!`, true)
    }
}

/**
 * Return template file to render the field.
 * 
 * @since 1.0.0
 * @param {String} type 
 */
module.exports._gettp = (type) => {
    // set default.
    type = type || 'text';

    const relatedTemp = {
        'text': '../gbf-scripts/fields/TextControl.js',
        'toggle': '../gbf-scripts/fields/PanelBody.js',
        'basecontrol': '../gbf-scripts/fields/BaseControl.js',
        'button-group': '../gbf-scripts/fields/ButtonGroup.js',
        'button': '../gbf-scripts/fields/Button.js',
        'checkbox': '../gbf-scripts/fields/CheckboxControl.js',
        'radio': '../gbf-scripts/fields/RadioControl.js',
        'range': '../gbf-scripts/fields/RangeControl.js',
        'select': '../gbf-scripts/fields/SelectControl.js',
        'datetime': '../gbf-scripts/fields/DateTimePicker.js',
        'tree': '../gbf-scripts/fields/TreeSelect.js',
        'textarea': '../gbf-scripts/fields/TextareaControl.js',
        'toogle': '../gbf-scripts/fields/ToggleControl.js',
        'color': '../gbf-scripts/fields/ColorPalette.js',
        'tooltip': '../gbf-scripts/fields/ToolTip.js'
    }

    return relatedTemp[type] || '';
}

/**
 * Get replace string.
 * 
 * @since 1.0.0
 */
module.exports._getrs = () => {

    return {
        '#field-id#': 'id',
        '#field-label#': 'label',
        '#field-title#': 'title',
        '#field-help#': 'help',
        '#field-class#': 'class',
        '#field-name#': 'name',
        '#field-date#': 'currentDate',
        '#field-attributeName#': 'attributeName'
    };
}

/**
 * Show message and terminate.
 * 
 * @since 1.0.0
 * 
 * @param {*} msg 
 * @param {boolean} msg 
 */
module.exports._terminate_with_msg = (msg, terminate = false) => {
    const _chalk = require('chalk');

    console.log(
        _chalk
            .bgKeyword('orange')
            .black(`Error: ${msg}`)
    )

    if (terminate) {
        process.exit(1);
    }
}

/**
 * get the file content.
 * 
 * @since 1.0.0
 * 
 * @param {String} file 
 */
module.exports._getFileContent = (file) => {
    const _fs = require('fs-extra');
    const _path = require('path');

    try {
        let _content = _fs.readFileSync(
            _path.resolve(__dirname, file.toString())
        );

        return _content.toString();
    } catch (e) {
        this._terminate_with_msg(e, true);
    }
}

/**
 * Get the toggles.
 * 
 * @since 1.0.0
 */
module.exports._get_toggles = () => {
    // Get the field json.
    const _fields = this._get_fields_json()

    if ("undefined" === typeof _fields.toggles) {
        return false;
    }

    if (_fields.toggles.length <= 0) {
        return false;
    }

    return _fields.toggles;
}