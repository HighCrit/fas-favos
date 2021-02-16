const consola = require('consola');
const { Database, OPEN_READWRITE }= require('sqlite3');
const { hasMasterToken } = require('../middlewares/hasMasterToken');
const { Response } = require('../objects/response/Response');
const { close } = require("../utils/close");

module.exports = {
    path: '/services',
    method: 'get',
    middlewares: [hasMasterToken],
    readRequest: async (req, res) => {
        const db = new Database(process.env.DB_PATH, OPEN_READWRITE, (err) => {
            if (err) {
                consola.error(err);
                res.status(500).json(new Response(false, 'Failed to connect to the database.'));
                return close(db);
            }

            db.all('SELECT name FROM service', (err, rows) => {
                if (err) {
                    consola.error('Failed to fetch services');
                    res.status(500).json(new Response(false, 'Failed to fetch services'));
                    return close(db);
                }

                if (rows.length > 0) {
                    res.status(200).json(new Response(true, rows));
                } else {
                    consola.warn('No services found');
                    res.status(404).json(new Response(false, 'No services found'));    
                }
                return close(db);
            });
        });
    }
}