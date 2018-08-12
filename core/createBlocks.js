const fs = require('fs');

fs.writeFile("/blocks/sample.js", "This is sample content", (err) => {
    if (err) {
        return console.log('Failed To create file!');
    }
    console.log('Block has been generated');
}); 