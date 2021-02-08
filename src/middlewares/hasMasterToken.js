const { Response } = require("../objects/response/Response");

async function hasMasterToken (req, res, next) {
    const auth = req.header('Authorization');
    
    if (auth) {
        const token = auth.replace('Mutual ', '');
        if (token === process.env.MASTER_TOKEN) {
            return next();
        }
    }

    return res.status(401).json(new Response(false, 'You are not authorized to perform this action'));
}

module.exports = { hasMasterToken };
