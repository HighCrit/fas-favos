const { authorizedForService } = require("../middlewares/authorizedForService");

module.exports = {
    path: '/:service',
    method: 'post',
    middlewares: [authorizedForService],
    readRequest: async (req, res) => {
        res.status(200).end();
    }
}
