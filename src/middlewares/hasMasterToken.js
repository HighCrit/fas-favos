const { Response } = require("../objects/response/Response");
const { isRateLimited, rateLimit } = require("../utils/ratelimit");

async function hasMasterToken (req, res, next) {
    if (isRateLimited(req)) {
        return res.status(429).json(new Response(false, 'You\'re being ratelimited!'));
    }

    const auth = req.get('Authorization');
    
    if (auth) {
        const token = auth.replace('Mutual ', '');
        if (token === process.env.MASTER_TOKEN) {
            return next();
        }
    }

    rateLimit(req);
    return res.status(401).json(new Response(false, 'You are not authorized to perform this action'));
}

module.exports = { hasMasterToken };
