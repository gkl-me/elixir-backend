import { inject, injectable } from "tsyringe";
import { IPlanController } from "./interface/IPlanController";
import { IPlanService } from "../../services/plan/interfaces/IPlanService";
import { Token } from "../../di/token";
import { NextFunction, Request, Response } from "express";
import { successResponse } from "../../helper/responseHanlder";
import { PLAN_MESSAGES } from "../../constants/messages";
import { STATUS_CODES } from "../../constants/statusCodes";
import { extractStringQueryParams } from "../../helper/queryParamUtils";

@injectable()
export class PlanController implements IPlanController {
  constructor(@inject(Token.PlanService) private _planService: IPlanService) {}

  async handleCreatePlan(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const data = req.body;

      //validate the data and parse the data before using it!!

      const updatedPlan = await this._planService.createPlan(data);

      successResponse(res, PLAN_MESSAGES.UPDATE_SUCCESS, STATUS_CODES.OK, {
        plan: updatedPlan,
      });
    } catch (error) {
      next(error);
    }
  }

  async handleFindAllPlans(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const params = extractStringQueryParams(req.query, ["page", "limit"]);
      const processedParams = {
        page: params?.page ? parseInt(params.page) : 1,
        limit: params?.limit ? parseInt(params.limit) : 6,
      };

      const { plans, totalPage, currentPage } =
        await this._planService.findAllPlans(processedParams);
      successResponse(res, PLAN_MESSAGES.FETCH_SUCCESS, STATUS_CODES.OK, {
        plans,
        totalPage,
        currentPage,
      });
    } catch (error) {
      next(error);
    }
  }

  async handleTogglePlanStatus(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const params = extractStringQueryParams(req.params, ["id"]);
      const planId = params?.id || "";

      await this._planService.togglePlanStatus({ planId });

      successResponse(res, "Plan status changed", STATUS_CODES.OK, {});
    } catch (error) {
      next(error);
    }
  }
}
