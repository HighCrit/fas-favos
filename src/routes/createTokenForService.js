const consola = require('consola');
const { Database, OPEN_READWRITE }= require('sqlite3');
const { v4: uuidv4 } = require('uuid');
const { hasMasterToken } = require('../middlewares/hasMasterToken');
const { Response } = require('../objects/response/Response');
const { close } = require('../utils/close');

module.exports = {
    path: '/services/:service/tokens',
    method: 'post',
    middlewares: [hasMasterToken],
    readRequest: async (req, res) => {
        const db = new Database(process.env.DB_PATH, OPEN_READWRITE, (err) => {
            if (err) {
                consola.error(err);
                res.status(500).json(new Response(false, 'Failed to connect to the database.'));
                return close(db);
            }

            db.get('SELECT id FROM service WHERE name LIKE ?', [req.params.service], (err, row) => {
                if (err) {
                    consola.error('Failed to fetch service with name: ' + req.params.service);
                    res.status(500).json(new Response(false, 'Failed to fetch service with name: ' + req.params.service));
                    return close(db);
                }

                if (row) {
                    const token = uuidv4();
                    db.run('INSERT INTO token (service_id, token) VALUES (?, ?)', [row.id, token], (err) => {
                        if (err) {
                            consola.error(err);
                            res.status(500).json(new Response(false, 'Failed to create new token for service with name: ' + req.params.name));
                        } else {
                            consola.success(`Successfully created token: ${token} for service: ${req.params.service}`);
                            res.status(201).json(new Response(true, token));
                        }
                        return close(db);
                    });
                } else {
                    consola.warn('No service found with name: ' + req.params.service);
                    res.status(404).json(new Response(false, 'No service found with name: ' + req.params.service));
                    return close(db);
                }
            });
        });
    }
}
