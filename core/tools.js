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
        'text': '../gbf-scripts/fields/PlainText.tpl',
        'color': '../gbf-scripts/fields/ColorPalette.tpl',
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