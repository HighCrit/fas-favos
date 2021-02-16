function addHeader(key, value) {
    return (req, res, next) => {
        res.header(key, value);
        next();
    }
}

module.exports = { addHeader };
