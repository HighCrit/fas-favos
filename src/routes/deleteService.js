const consola = require('consola');
const { Database, OPEN_READWRITE }= require('sqlite3');
const { hasMasterToken } = require('../middlewares/hasMasterToken');
const { Response } = require('../objects/response/Response');
const { close } = require('../utils/close');

module.exports = {
    path: '/services/:service',
    method: 'delete',
    middlewares: [hasMasterToken],
    readRequest: async (req, res) => {
        const db = new Database(process.env.DB_PATH, OPEN_READWRITE, (err) => {
            if (err) {
                consola.error(err);
                res.status(500).json(new Response(false, 'Failed to connect to the database.'));
                return close(db);
            }

            db.run('DELETE FROM service WHERE name LIKE ?', [req.params.service], function (err) {
                if (err) {
                    consola.error(err);
                    res.status(500).json(new Response(false, 'Failed to delete service'));
                } else if (this.changes) {
                    consola.success('Successfully deleted service with name: ' + req.params.service);
                    res.status(204).end();
                } else {
                    consola.warn('No service found with name: ' + req.params.service);
                    res.status(404).json(new Response(false, 'No service found with name: ' + req.params.service));
                }
                return close(db);
            });
        });
    }
}
