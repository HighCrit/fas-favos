const consola = require('consola');

function close(db) {
    db.close((err) => {
        if (err) {
            consola.error(err);
        }
    });
}

module.exports = { close };
