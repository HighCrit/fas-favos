class Response {
    constructor(success, result) {
        this.success = success;
        this.result = result;
        this.timestamp = Date.now();
    }
}

module.exports = { Response };
