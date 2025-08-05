import express from 'express'


const router = express.Router()


router.post('/stripe',express.raw({type:'application/json'}),(req,res,next) =>{
    const stripeController = 
    console.log()
    res.json({})
})


export default router