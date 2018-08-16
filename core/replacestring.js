/**
 * Replace multiple string at once.
 * 
 * @since 1.0.0
 *  
 * @param {string} base 
 * @param {Object} arr 
 */
module.exports = (base, arr = {}) => {
    base = base || '';

    if (Object.keys(arr).length > 0) {

        let _replaceString = base;

        for (tag in arr) {
            _replaceString = _replaceString.replace(tag, arr[tag] || '')
        }

        return _replaceString;
    }

    return base;
}