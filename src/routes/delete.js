const consola = require('consola');
const { existsSync, unlinkSync } = require('fs');
const { authorizedForService } = require("../middlewares/authorizedForService");
const { Response } = require('../objects/response/Response');

module.exports = {
    path: '/:service/*',
    method: 'delete',
    middlewares: [authorizedForService],
    readRequest: async (req, res) => {
        try {
            if (existsSync(process.env.FILES_ROOT + req.path)) {
                unlinkSync(process.env.FILES_ROOT + req.path);
                consola.info('Deleted ' + req.path)
                return res.status(204).end();
            }
        } catch (err) {
            consola.error(err);
            return res.status(500).json(new Response(false, `An error occured while trying to delete ${req.path}`));
        }
        res.status(404).json(new Response(false, `Unable to delete ${req.path} file does not exist`));
    }
}
