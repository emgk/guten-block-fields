const _fs = require('fs-extra');
const _path = require('path');

// store packages.
let _packages = { 'wp.editor': [] };

// get packages.
const get_packages = (blockFields) => {
    return new Promise((resolve, reject) => {
        let _already_procced = [];

        // Go through each of the field.
        for (field in blockFields) {
            if (!_already_procced.includes(blockFields[field].type)) {
                // type checking.
                switch (blockFields[field].type) {
                    case 'text':
                        _packages['wp.editor'].push('PlainText');
                        break;
                }

                // processed.
                _already_procced.push(blockFields[field].type);
            }
        }

        // reject.
        if (_packages.length <= 0) {
            reject(`no field were passed`);
        }

        // resolve.
        resolve(_packages)
    })
}

/**
 * Generate string for import _packages.
 * 
 * @since 1.0.0
 * @param {Array} fields 
 */
module.exports._renderpkg = async (fields) => {
    await get_packages(fields)
        .then(packageList => {
            let tempPkg = _fs.createWriteStream(_path.resolve(__dirname, '../tempPKG.js'));

            for (component in packageList) {
                tempPkg.write(
                    `const { ${packageList[component].join(',')} } = ${component}; \n`
                )
            }
            tempPkg.close();
        }).catch(err => {
            chalk.red(
                console.log(err)
            );
        });
}