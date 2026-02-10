import { IPlan } from "../../models/Plan";

export interface updatePlanDto{
    id:string,
    data:IPlan
}

export interface PlanResponseDto{
    id:string,
    name:string,
    price:number,
    limits:{
        projects:number,
        teams:number,
        members:number,
        customRoles:number,
        storageBytes:number
    },
    features:{
        githubAutomation:boolean,
        automationScripts:boolean
    }
    isActive:boolean
}

export interface PlanDTo{
    id:string,
    name:string,
    price:number,
    limits:{
        projects:number,
        teams:number,
        members:number,
        customRoles:number,
        storageBytes:number
    },
    features:{
        githubAutomation:boolean,
        automationScripts:boolean
    }
    isActive:boolean
}