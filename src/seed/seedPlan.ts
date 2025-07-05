import Stripe from 'stripe'
import { Plan } from '../models/Plan'
import logger from '../middlewares/logger'

const stripe = new Stripe(process.env.STRIPE_KEY||"")

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

        const products = await stripe.products.list({
            limit:100
        })

        const existingProduct = products.data.find(p => p.metadata.planName == planName)
        if(existingProduct){
            stripeProductId=existingProduct.id
            const prices = await stripe.prices.list({
                product:stripeProductId,
                limit:1
            })

            stripePriceId=prices.data[0]?.id || null
        }else{

            const newProduct = await stripe.products.create({
                name:planName,
                metadata:{
                    planName
                }
            })

            const newPrice = await stripe.prices.create({
                product:newProduct.id,
                unit_amount:planPrice,
                currency:'usd',
                recurring:{
                    interval:'month'
                }
            })

            stripeProductId = newProduct.id
            stripePriceId = newPrice.id
        }

        return {
            stripeProductId,
            stripePriceId
        }
    } catch (error) {
        throw new Error('Failed to create product or price in stripe')
    }
}