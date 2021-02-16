const consola = require("consola");
const { Response } = require("../objects/response/Response");

const RATELIMIT_PERIOD = 600000; // 10 minutes
const LIMIT = 3;
const rateLimitHolder = new Map();

function getIp(req) {
    return req.headers["x-forwarded-for"] | "localhost";
}

function rateLimit(req) {
    const ip = getIp(req);
    const time = Date.now();

    if (!rateLimitHolder.has(ip)) {
        return rateLimitHolder.set(ip, new RateLimitEntry(ip, time));
    }

    rateLimitHolder.get(ip).incrementAmount(time);
}

function isRateLimited(req) {
    const ip = getIp(req);
    const time = Date.now();

    // Check if ip has ratelimit entry
    if (!rateLimitHolder.has(ip)) {
        return false;
    }

    const entry = rateLimitHolder.get(ip);
    // Check if request limit has been exceeded
    if (entry.amount > LIMIT) {
        return false;
    }

    // Check if ratelimit period has expired
    if (time - entry.lastCall > RATELIMIT_PERIOD) {
        return false;
    }
    
    return true;
}

module.exports = { isRateLimited, rateLimit };
