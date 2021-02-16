const consola = require('consola');
const fs = require('fs');

async function rmdir(path) {
    consola.info('Deleting directory: ' + path);
    
    try {
        if (fs.existsSync(path)) {
            const files = fs.readdirSync(path);

            if (files.length > 0) {
                files.forEach((filename) => {
                    if (fs.statSync(path + '/' + filename).isDirectory()) {
                        rmdir(path + '/' + filename);
                    } else {
                        fs.unlinkSync(path + '/' + filename);
                    }
                });
            }
            fs.rmdirSync(path);
        } else {
            consola.error(`Directory: ${path} does not exist`);
        }
    } catch (err) {
        consola.error(err);
    }
}

module.exports = { rmdir };
