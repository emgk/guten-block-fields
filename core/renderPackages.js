const _fs = require('fs-extra');
const _path = require('path');

// store packages.
let _packages = { 'wp.editor': [] };

// get packages.
const get_packages = (blockFields) => {
    let _already_procced = [];

    // Go through each of the field.
    for (field in blockFields) {
        if (!_already_procced.includes(blockFields[field].type)) {
            // type checking.
            switch (blockFields[field].type) {
                case 'text':
                    _packages['wp.editor'].push('TextControl');
                    break;
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
module.exports._renderpkg = (fields) => {
    // get packages.
    get_packages(fields);

    // create file.
    let tempPkg = _fs.createWriteStream(_path.resolve(__dirname, '../tempPKG.js'));

    for (component in _packages) {
        tempPkg.write(
            `const { ${_packages[component].join(',')} } = ${component}; \n`
        )
    }
    tempPkg.end();
}