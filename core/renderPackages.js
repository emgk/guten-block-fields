const fs = require('fs-extra');
const path = require('path');

let packages = {
    'wp.editor': [] // Store packages.
};

// Get packages.
const getPackages = (blockFields) => {
    return new Promise((resolve, reject) => {

        // Go through each of the field.
        for (field in blockFields) {
            switch (blockFields[field].type) {
                case 'text':
                    packages['wp.editor'].push('PlainText');
                    packages['wp.editor'].push('RichText');
                    break;
            }
        }

        if (packages.length <= 0) {
            reject(`no field were passed`);
        }

        resolve(packages)
    })
}

module.exports = async (fields) => {
    // Get the packages.
    await getPackages(fields)
        .then(packageList => {
            // list of packages to import.
            let tempPkg = fs.createWriteStream(path.resolve(__dirname, '../tempPKG.js'));

            for (component in packageList) {
                tempPkg.write(`const { ${packageList[component].join(',')} } = ${component}; \n`)
            }

            // Close file.
            tempPkg.close();
        }).catch(err => {
            chalk.red(
                console.log(err)
            );
        });
}