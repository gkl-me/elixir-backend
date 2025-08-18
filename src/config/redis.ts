import { RedisOptions } from "ioredis";
import { ENV } from "../constants/env";



export const redisConfig:RedisOptions = {
    host:ENV.REDIS_HOST,
    port:parseInt(ENV.REDIS_PORT),
    password:ENV.REDIS_PASSWORD,
    maxRetriesPerRequest:3
}