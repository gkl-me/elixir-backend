import { Queue } from "bullmq";
import { redisConnection } from "../config/redis";


export const QUEUES = {
    EMAIL:'email_queue'
}

export const emailQueue = new Queue(QUEUES.EMAIL,{connection:redisConnection})
