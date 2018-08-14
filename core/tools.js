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
    return require('path').resolve(__dirname, '../gbf-scripts/blockComponent.tpl');
}

/**
 * Get the block field JSON.
 * 
 * @since 1.0.0
 */
module.exports._get_fields_json = () => {
    const _fs = require('fs');

    if (_fs.existsSync(require('path').resolve(__dirname, '../block-fields.json'))) {
        try {
            const _fields = require('../block-fields.json');
            return _fields;
        } catch (err) {
            this._terminate_with_msg(err);
        }
    } else {
        this._terminate_with_msg(`block-fields.json is isn't exists, please refer to documentations!`)
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
        'text': '../gbf-scripts/fields/TextControl.tpl',
        'toggle': '../gbf-scripts/PanelBody.tpl',
        'basecontrol': '../gbf-scripts/fields/BaseControl.tpl',
        'button-group': '../gbf-scripts/fields/ButtonGroup.tpl',
        'button': '../gbf-scripts/fields/Button.tpl',
        'checkbox': '../gbf-scripts/fields/CheckboxControl.tpl',
        'radio': '../gbf-scripts/fields/RadioControl.tpl',
        'range': '../gbf-scripts/fields/RangeControl.tpl',
        'select': '../gbf-scripts/fields/SelectControl.tpl',
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
        '#field-slug#': 'slug',
        '#field-title#': 'title',
        '#field-name#': 'name',
        '#field-value#': 'value',
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
        _chalk.bgKeyword('red').white(`Error: ${msg}`)
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

module.exports._get_toggles = () => {
    // get the configuration.
    const _block_fields = require('../block-fields.json');
}