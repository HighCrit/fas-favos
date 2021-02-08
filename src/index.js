const express = require('express');
const consola = require('consola');
const { readdirSync, readFileSync } = require('fs');
const { join } = require('path');
const { Database } = require('sqlite3');
const { close } = require('./utils/close');

const db = new Database(process.env.DB_PATH, async (err) => {
    if (err) {
        consola.error(err);
        return close(db);
    } else {
        db.all('SELECT name FROM sqlite_master WHERE type=\'table\'', (err, tables) => {
            if (err) {
                consola.error(err);
                return close(db);
            } else if (tables.find(t => t.name === 'service')) {
                consola.success('Successfully connected to the database.');
                return close(db);
            }

            const sql = readFileSync(join(process.cwd(), 'sql', 'initialize.sql')).toString();
            db.exec(sql, (err) => {
                if (err) {
                    consola.error(err);
                }
                consola.success('Successfully initialized database.');
                close(db);
            });
        });
    }
});

const server = express();

server.use(express.static(process.env.FILES_ROOT));
server.use(express.json());

const routes = readdirSync(join(__dirname, 'routes'));
routes.forEach(route => {
    const r = require(join(__dirname, 'routes', route));
    server[r.method](r.path, ...r.middlewares, r.readRequest);
    consola.info(`Registered route at ${r.method.toUpperCase()} ${r.path}`);
});

server.listen(process.env.PORT, () => {
    consola.success(`Successfully listening at port: ${process.env.PORT}`);
}).on('error', consola.error);
