const redis = require('redis');
require('dotenv').config();

let redisClient;

// MOCK CLIENT (The Spare Tire)
// If Real Redis fails, this Dummy Object takes the hits so the server survives.
const mockClient = {
    connect: async () => console.log(">> [SYSTEM]: RUNNING IN NO-CACHE MODE."),
    on: () => {},
    get: async () => null,
    set: async () => null,
    isOpen: true
};

if (process.env.REDIS_URI) {
    redisClient = redis.createClient({
        url: process.env.REDIS_URI
    });
} else {
    redisClient = mockClient;
}

redisClient.on('error', (err) => {
    // SILENT FAILOVER
    // We do not scream. We just acknowledge the cache is dead.
});

const connectRedis = async () => {
    try {
        await redisClient.connect();
        console.log(">> [SYSTEM]: REDIS CACHE ACTIVE.");
    } catch (e) {
        console.log(">> [WARNING]: REDIS CONNECTION FAILED. SWITCHING TO BYPASS MODE.");
        // Swap the failed client with the mock client so the app keeps running
        redisClient = mockClient;
    }
};

module.exports = { redisClient, connectRedis };