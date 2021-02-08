const consola = require('consola');
const { Database, OPEN_READWRITE }= require('sqlite3');
const { hasMasterToken } = require('../middlewares/hasMasterToken');
const { Response } = require('../objects/response/Response');
const { close } = require('../utils/close');

module.exports = {
    path: '/services/:service/tokens/:token',
    method: 'delete',
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
                    db.run('DELETE FROM token WHERE service_id = ? AND token LIKE ?', [row.id, req.params.token], function (err) {
                        if (err) {
                            consola.error(err);
                            res.status(500).json(new Response(false, `Failed to delete a token from service with name: ${req.params.service}`));
                        } else if (this.changes) {
                            consola.success('Successfully deleted token from service with name: ' + req.params.service);
                            res.status(204).end();
                        } else {
                            consola.warn('Token not found in service with name: ' + req.params.service);
                            res.status(404).json(new Response(false, 'Token not found in service with name: ' + req.params.service));
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
