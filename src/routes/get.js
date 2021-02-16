const { static } = require('express');

module.exports = {
    path: '/:service/*',
    method: 'get',
    middlewares: [],
    readRequest: static(process.env.FILES_ROOT)
}
