const _fs = require('fs-extra');
const _path = require('path');

// store packages.
let _packages = {
    'wp.editor': [],
    'wp.components': []
}

// get packages.
const get_packages = (blockFields) => {
    let _already_procced = [];

    // Go through each of the field.
    for (field in blockFields) {
        if (!_already_procced.includes(blockFields[field].type)) {
            // type checking.
            switch (blockFields[field].type) {
                case 'text':
                    _packages['wp.components'].push('TextControl');
                    break;
                case 'checkbox':
                    _packages['wp.components'].push('CheckboxControl')
                    break;
                case 'range':
                    _packages['wp.components'].push('RangeControl')
                    break;
                case 'select':
                    _packages['wp.components'].push('SelectControl')
                    break;
                case 'radio':
                    _packages['wp.components'].push('RadioControl')
                    break;
                case 'button':
                case 'button-group':
                    _packages['wp.components'].push('Button')
                    _packages['wp.components'].push('ButtonGroup')
                    break;
            }

            // import toggle lib
            if (true === blockFields[field].toggle) {
                _packages['wp.components'].push('PanelBody');
            }

            // import BaseControl.
            if (true === blockFields[field].baseControl) {
                _packages['wp.components'].push('BaseControl')
            }

            // processed.
            _already_procced.push(blockFields[field].type);
        }
    }
}

/**
 * Generate string for import _packages.
 * 
 * @since 1.0.0
 * @param {Array} fields 
 */
module.exports._get_package_strings = (fields) => {
    // get packages.
    get_packages(fields);

    // store package list here.
    let pkgs = '';

    for (component in _packages) {
        if (_packages[component].length === 0) {
            continue;
        }

        // append packages.
        pkgs = `${pkgs}const { ${_packages[component].filter((el, i, a) => i === a.indexOf(el)).join(', ')} } = ${component}; \n`;
    }

    return pkgs;
}