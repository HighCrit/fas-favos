const consola = require('consola');
const fileupload = require('express-fileupload');
const { v4: uuidv4 } = require('uuid');
const { join } = require('path'); 
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
    path: '/:service',
    method: 'post',
    middlewares: [authorizedForService, fileupload(fileuploadConfig)],
    readRequest: async (req, res) => {
        if (!req.files || Object.keys(req.files).length === 0) {
            return res.status(400).json(new Response(false, 'No files were uploaded'));
        }

        const errored = [];
        const uploaded = [];

        for (let file of Object.keys(req.files)) { 
            const path = req.path + '/' + uuidv4() + '.' + req.files[file].name.split('.').pop();
            try {
                await req.files[file].mv(process.env.FILES_ROOT + path);
                uploaded.push(process.env.SITE_URL + path);
                consola.success(`Succesfully uploaded ${req.files[file].name} at ${path}`);
            } catch (err) {
                consola.error(err);
                errored.push(process.env.SITE_URL + path);
            } 
        }

        if (errored.length !== 0) {
            return res.status(500).json(new Response(false, errored));
        }
        return res.status(201).json(new Response(true, uploaded));
    }
}
