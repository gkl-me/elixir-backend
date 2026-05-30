import { model, Schema, Document  } from "mongoose";



export interface ITransaction extends Document{
    userId:string,
    workspaceId:string,
    subscriptionId:string

    stripeInvoiceId:string,

    amount:number,

    status:"paid"|"failed"|"pending",
    paymentMethod?:string,

    paidAt?:Date,
    createAt?:Date,
    updatedAt?:Date
}


const TransactionSchema = new Schema({
    userId:{
        type:String,
        required:true
    },
    workspaceId:{
        type:String,
        required:true
    },
    stripeInvoiceId:{
        type:String,
    },
    amount:{
        type:Number
    },
    status:{
        type:String,
        enum:['paid','failed','pending'],
        default:'pending'
    },
    paidAt:{
        type:Date
    },
    paymentMethod:{
        type:String
    }
},{
    timestamps:true
})

export const Transaction = model<ITransaction>('Transaction',TransactionSchema)

