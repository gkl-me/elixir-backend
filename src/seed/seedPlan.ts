import { Plan } from '../models/Plan'
import logger from '../middlewares/logger'
import { container } from 'tsyringe'
import { IStripeService } from '../providers/interfaces/IStripeService'


const plans= [
    {
        name:"Free",
        price:0,
        limits:{
            projects:5,
            teams:2,
            members:5,
            customRoles:0,
            storageBytes:100 * 1024 * 1024
        },
        features:{
            githubAutomation:false,
            automationScripts:false
        }
    },
    {
        name:'Pro',
        price:1000,
        limits:{
            projects:10,
            teams:5,
            members:10,
            customRoles:3,
            storageBytes:300 * 1024 * 1024
        },
        features:{
            githubAutomation:true,
            automationScripts:true
        }
    },{
        name:'Enterprice',
        price:2000,
        limits:{
            projects:-1,
            teams:-1,
            members:-1,
            customRoles:5,
            storageBytes:500 * 1024 * 1024
        },
        features:{
            githubAutomation:true,
            automationScripts:true
        }
    }
]

export async function seedPlan(){
    try {

        for(let plan of plans){

            let stripePriceId=null
            let stripeProductId=null

            if(plan.name!=='Free'){
                let res = await stripeListing(plan.name,plan.price)
                stripePriceId = res.stripePriceId
                stripeProductId = res.stripeProductId
            }

            //add to db 
                await Plan.updateOne({name:plan.name},{
                    $set:{
                        name:plan.name,
                        limits:plan.limits,
                        features:plan.features,
                        stripePriceId:stripePriceId,
                        stripeProductId:stripeProductId,
                        isActive:true,
                        price:plan.price
                    }
                },{
                    upsert:true
                })
        }

        console.log('Plans Successfully seed to the db')
    } catch (error) {
        logger.error(error)
    }
}


async function stripeListing(planName:string,planPrice:number){
    try {

        const stripeServie = container.resolve<IStripeService>('IStripeService')

        let stripeProductId = await stripeServie.findProduct(planName)


        if(!stripeProductId){

            stripeProductId = await stripeServie.createProduct(planName)

        }

        const latestPriceId = await stripeServie.findLatestPrice(stripeProductId)
        
        if(!latestPriceId){
            const newPriceId = await stripeServie.createPrice(stripeProductId,planPrice)
            return {stripeProductId,stripePriceId:newPriceId}
        }

        const latestPrice = await stripeServie.getPrice(latestPriceId)

        if(latestPrice?.unit_amount !== planPrice){
            const newPriceId = await stripeServie.createPrice(stripeProductId,planPrice)
            return {stripeProductId,stripePriceId:newPriceId}
        }

        return {
            stripeProductId,
            stripePriceId:latestPriceId
        }

    } catch (error) {
        throw new Error('Failed to create product or price in stripe')
    }
}