const consola = require('consola');
const { Database, OPEN_READWRITE } = require('sqlite3');
const { json } = require('express');
const { hasMasterToken } = require('../middlewares/hasMasterToken');
const { Response } = require('../objects/response/Response');
const { close } = require('../utils/close');

module.exports = {
    path: '/services',
    method: 'post',
    middlewares: [hasMasterToken, json()],
    readRequest: async (req, res) => {
        if (!req.body || !req.body.name || !req.body.name.length === 0) {
            return res.status(400).json(new Response(false, 'Required variables are: name'));
        }

        const db = new Database(process.env.DB_PATH, OPEN_READWRITE, (err) => {
            if (err) {
                consola.error(err);
                res.status(500).json(new Response(false, 'Failed to connect to the database.'));
                return close(db);
            }

            db.run('INSERT INTO service (name) VALUES (?)', [req.body.name], (err) => {
                if (err) {
                    consola.error(err);
                    res.status(500).json(new Response(false, 'Failed to create service'));
                } else {
                    consola.success('Successfully created service with name: ' + req.body.name);
                    res.status(201).json(new Response(true, 'Successfully created service with name: ' + req.body.name));
                }
                return close(db);
            });
        });
    }
}
