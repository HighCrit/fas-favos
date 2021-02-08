const consola = require('consola');
const { Database, OPEN_READWRITE } = require("sqlite3");
const { Response } = require('../objects/response/Response');
const { close } = require('../utils/close');

async function authorizedForService(req, res, next) {
    const auth = req.header('Authorization');

    if (auth) {
        const token = auth.replace('Mutual ', '');
        const db = new Database(process.env.DB_PATH, OPEN_READWRITE, (err) => {
            if (err) {
                consola.error(err);
                res.status(500).json(new Response(false, 'Failed to connect to the database.'));
                return close(db);
            }

            db.get('SELECT * FROM service AS s, token AS t WHERE s.id = t.service_id AND s.name LIKE ? AND t.token LIKE ?', [req.params.service, token], (err, row) => {
                if (err) {
                    consola.error(err);
                    res.status(500).json(new Response(false, 'Unable to verify authorizations'));
                } else if (row) {
                    next();
                } else {
                    res.status(401).json(new Response(false, 'You are not authorized to perform this action'));
                }
                return close(db);
            });
        })
    } else {
        return res.status(401).json(new Response(false, 'You are not authorized to perform this action'));
    }
}

module.exports = { authorizedForService };
