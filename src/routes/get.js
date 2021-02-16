const { static } = require('express');
const { addHeader } = require('../middlewares/addHeader');

module.exports = {
    path: '/:service/*',
    method: 'get',
    middlewares: [addHeader('X-Robots-Tag', 'noindex, nofollow')],
    readRequest: static(process.env.FILES_ROOT)
}
