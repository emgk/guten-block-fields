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
        'color': '../gbf-scripts/fields/ColorPalette.tpl',
        'toggle': '../gbf-scripts/PanelBody.tpl',
        'basecontrol': '../gbf-scripts/fields/BaseControl.tpl',
        'button-group': '../gbf-scripts/fields/ButtonGroup.tpl',
        'button': '../gbf-scripts/fields/Button.tpl',
        'checkbox': '../gbf-scripts/fields/CheckboxControl.tpl',
        'radio': '../gbf-scripts/fields/RadioControl.tpl',
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