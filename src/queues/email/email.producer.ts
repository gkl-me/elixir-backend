

import { emailQueue } from "../queues";
import logger from "../../middlewares/logger";
import { EMAIL_JOBS } from "./email.job";


export async function sendVerificationEmailJob(email:string){
    try {

        emailQueue.add(EMAIL_JOBS.SEND_VERIFY_EMAIL,{
            email
        })
        
    } catch (error) {
        logger.error(error)
    }
}

export async function sendOtpEmailJob(email:string){
    try {

        emailQueue.add(EMAIL_JOBS.SEND_OTP_EMAIL,{
            email,
        })
        
    } catch (error) {
        logger.error(error)
    }
}