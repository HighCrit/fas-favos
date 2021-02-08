const consola = require('consola');
const { Database, OPEN_READWRITE }= require('sqlite3');
const { hasMasterToken } = require('../middlewares/hasMasterToken');
const { Response } = require('../objects/response/Response');
const { close } = require("../utils/close");

module.exports = {
    path: '/services/:service/tokens',
    method: 'get',
    middlewares: [hasMasterToken],
    readRequest: async (req, res) => {
        const db = new Database(process.env.DB_PATH, OPEN_READWRITE, (err) => {
            if (err) {
                consola.error(err);
                res.status(500).json(new Response(false, 'Failed to connect to the database.'));
                return close(db);
            }

            db.all('SELECT t.token FROM service AS s, token AS t WHERE s.id = t.service_id AND s.name LIKE ?', [req.params.service], (err, rows) => {
                if (err) {
                    consola.error('Failed to fetch service with name: ' + req.params.service);
                    res.status(500).json(new Response(false, 'Failed to fetch service with name: ' + req.params.service));
                    return close(db);
                }

                if (rows.length > 0) {
                    res.status(200).json(new Response(true, rows.map(r => r.token)));
                } else {
                    consola.warn('No tokens found for service with name: ' + req.params.service);
                    res.status(404).json(new Response(false, 'No tokens found for service with name: ' + req.params.service));    
                }
                return close(db);
            });
        });
    }
}
