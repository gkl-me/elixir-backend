


export interface IGetOnboardingDto{
    userId:string
}

type PlanType = 'Free' |'Pro'|'Enterprice'

export interface IResponeOnboardingDto{
    userId:string,
    currentStep:number,
    isCompleted:boolean,

    paymentStatus:'idle'|'completed'|'failed'|'processing',

    planName:PlanType,
    planId:string,
    planPrice:number,

    workspaceName?:string,

    company?:{
        name:string,
        type:string,
        email:string,
        phone:string,
        size:number
    }
}