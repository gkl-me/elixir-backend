import { IPlan, PlanType } from "../../models/Plan";

export interface updatePlanDto {
  id: string;
  data: IPlan;
}

export interface PlanResponseDto {
  id: string;
  name: string;
  type: PlanType;
  price: number;
  limits: {
    projects: number;
    teams: number;
    members: number;
    customRoles: number;
    storageBytes: number;
  };
  features: {
    githubAutomation: boolean;
    automationScripts: boolean;
  };
  isActive: boolean;
}

export interface ICreatePlanDTo {
  type: PlanType;
  name: string;
  price: number;
  limits: {
    projects: number;
    teams: number;
    members: number;
    customRoles: number;
    storageBytes: number;
  };
  features: {
    githubAutomation: boolean;
    automationScripts: boolean;
  };
  isActive: boolean;
}

export interface ITogglePlanStatusDto {
  planId: string;
}

export interface IGetPlanDto {
  page: number;
  limit: number;
}
