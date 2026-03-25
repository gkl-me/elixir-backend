import IORedis from 'ioredis'
import { ENV } from '../constants/env'


export const redisConnection = new IORedis({
    host: ENV.REDIS_HOST,
    port: parseInt(ENV.REDIS_PORT),
    maxRetriesPerRequest: null
})



redisConnection.on('connect', () => {
    console.log("Redis connected")
})


redisConnection.on('error', (err) => {
    console.log("Redis Error", err)
})


process.on("SIGINT", async () => {
    console.log("🛑 Closing Redis...");
    await redisConnection.quit();
    process.exit(0);
});