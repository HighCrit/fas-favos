const consola = require('consola');
const fileupload = require('express-fileupload');
const { authorizedForService } = require("../middlewares/authorizedForService");
const { Response } = require('../objects/response/Response');

const fileuploadConfig = {
    createParentPath: true,
    preserveExtension: true,
    safeFileNames: true,
    useTempFiles: true,
    tempFileDir: '/tmp/fasfavos'
}

module.exports = {
    path: '/:service/*',
    method: 'post',
    middlewares: [authorizedForService, fileupload(fileuploadConfig)],
    readRequest: async (req, res) => {
        if (!req.files || !req.files.file) {
            return res.status(400).json(new Response(false, 'No file was uploaded'));
        }

        req.files.file.mv(process.env.FILES_ROOT + req.path, (err) => {
            if (err) {
                consola.error(err);
                return res.status(500).json(new Response(false, `Failed to upload ${req.files.file.name} to ${req.path}`));
            }

            consola.success(`Succesfully uploaded ${req.files.file.name} to ${req.path}`);
            return res.status(201).json(new Response(true, process.env.SITE_URL + req.path));
        });       
    }
}
