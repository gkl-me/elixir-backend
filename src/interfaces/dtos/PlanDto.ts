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
        maxProjects:number,
        maxTeams:number,
        maxUsersPerTeam:number
    },
    isActive:boolean
}

export interface PlanDTo{
    id:string,
    name:string,
    price:number,
    limits:{
        maxProjects:number,
        maxTeams:number,
        maxUsersPerTeam:number
    },
    isActive:boolean
}