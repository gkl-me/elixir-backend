import { inject, injectable } from "tsyringe";
import { IPlanService } from "./interfaces/IPlanService";
import { Token } from "../../di/token";
import { IPlanRepository } from "../../repositories/plan/interfaces/IPlanRepository";
import {
  ICreatePlanDTo,
  IGetPlanDto,
  ITogglePlanStatusDto,
  PlanResponseDto,
} from "../../interfaces/dtos/PlanDto";
import { CustomError } from "../../errors/CustomError";
import { STATUS_CODES } from "../../constants/statusCodes";
import { CONSTANT_MESSAGES } from "../../constants/messages";
import { planDtoMapper } from "../../interfaces/mapper/planDtoMapper";
import { IStripeService } from "../../providers/interfaces/IStripeService";
import logger from "../../middlewares/logger";

@injectable()
export class PlanService implements IPlanService {
  constructor(
    @inject(Token.PlanRepository) private _planRepository: IPlanRepository,
    @inject(Token.StripeService) private _stripeService: IStripeService,
  ) {}

  async createPlan(data: ICreatePlanDTo): Promise<PlanResponseDto | null> {
    try {
      //disable all exiting plan with same type
      await this._planRepository.updateMany(
        { type: data.type },
        { $set: { isActive: false } },
      );

      let stripeProductId;
      let stripePriceId;
      if (data.type !== "Free") {
        stripeProductId = await this._stripeService.findProduct(data.type);

        if (!stripeProductId) {
          stripeProductId = await this._stripeService.createProduct(data.type);
        }
        stripePriceId = await this._stripeService.createPrice(
          stripeProductId,
          data.price,
        );
      }

      const newPlan = await this._planRepository.create({
        ...data,
        isActive: true,
        stripePriceId,
        stripeProductId,
      });

      return planDtoMapper.toPlanResponse(newPlan);
    } catch (error) {
      throw error;
    }
  }

  async findAllPlans(
    data: IGetPlanDto,
  ): Promise<{
    plans: PlanResponseDto[] | null;
    totalPage: number;
    currentPage: number;
  }> {
    try {
      const { page, limit } = data;
      const skip = (page - 1) * limit;

      const allPlans = await this._planRepository.findAll(
        {},
        {
          sort: { isActive: -1, createdAt: 1 },
          skip,
          limit,
        },
      );
      const totalPage = Math.ceil((allPlans?.length || 6) / 6);
      let plans = null;

      if (allPlans && allPlans.length) {
        plans = allPlans.map((plan) => planDtoMapper.toPlanResponse(plan));
      }

      return { plans, totalPage, currentPage: page };
    } catch (error) {
      if (error instanceof CustomError) {
        throw error;
      }
      throw new CustomError(
        CONSTANT_MESSAGES.INTERNAL_SERVER_ERROR,
        STATUS_CODES.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async togglePlanStatus(data: ITogglePlanStatusDto): Promise<void> {
    try {
      const { planId } = data;

      const plan = await this._planRepository.findById(planId);
      if (!plan)
        throw new CustomError(
          CONSTANT_MESSAGES.BAD_REQUEST,
          STATUS_CODES.BAD_REQUEST,
        );

      if (!plan.isActive) {
        await this._planRepository.updateMany(
          {
            type: plan.type,
            _id: { $ne: plan._id },
          },
          {
            $set: { isActive: false },
          },
        );
      }

      plan.isActive = !plan.isActive;
      await plan.save();
    } catch (error) {
      logger.error("error from toggle plan status", error);
      throw error;
    }
  }
}
