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
    return value.replace(/\s+/g, '');
}