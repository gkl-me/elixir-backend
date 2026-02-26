import { Worker } from "bullmq";
import { QUEUES } from "../queues";
import { redisConnection } from "../../config/redis";
import { STRIPE_JOBS } from "./stripe.job";
import { handleStripeEventProcessor } from "./stripe.processor";



export const stripeWorker = new Worker(QUEUES.STRIPE,
    async (job) => {
        switch(job.name){
            case STRIPE_JOBS.HANDLE_EVENT:
                await handleStripeEventProcessor(job)
                break;
            default:
                break;
        }
    },{
        connection:redisConnection
    }
)