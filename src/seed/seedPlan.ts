import { Plan } from '../models/Plan'
import logger from '../middlewares/logger'
import { container } from 'tsyringe'
import { IStripeService } from '../providers/interfaces/IStripeService'


const plans= [
    {
        name:"Free",
        price:0,
        limits:{
            maxProjects:5,
            maxTeams:2,
            maxUsersPerTeam:10
        }
    },
    {
        name:'Pro',
        price:1000,
        limits:{
            maxProjects:10,
            maxTeams:5,
            maxUsersPerTeam:20
        }
    },{
        name:'Enterprice',
        price:2000,
        limits:{
            maxProjects:0,
            maxTeams:0,
            maxUsersPerTeam:0
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

        let stripeProductId=null;
        let stripePriceId=null;

        const stripeServie = container.resolve<IStripeService>('IStripeService')

        const existingProductId = await stripeServie.findProduct(planName)
        if(existingProductId){
            stripeProductId=existingProductId

            const latestPriceId = await stripeServie.findLatestPrice(stripeProductId)

            stripePriceId=latestPriceId|| null
        }else{

            const newProductId = await stripeServie.createProduct(planName)

            const newPriceId = await stripeServie.createPrice(newProductId,planPrice)

            stripeProductId = newProductId
            stripePriceId = newPriceId
        }

        return {
            stripeProductId,
            stripePriceId
        }
    } catch (error) {
        throw new Error('Failed to create product or price in stripe')
    }
}