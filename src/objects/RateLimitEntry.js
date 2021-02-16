class RateLimitEntry {
    constructor(ip, lastCall) {
        this.ip = ip;
        this.lastCall = lastCall;
        this.amount = 1;
    }

    incrementAmount(now) {
        this.amount++;
        this.lastCall = now;
    }
}