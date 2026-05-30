import express from "express";
import { auth } from "../middlewares/auth";
import { authorize } from "../middlewares/authorize";
import { container } from "tsyringe";
import { IPlanController } from "../controllers/plan/interface/IPlanController";
import { Token } from "../di/token";
import { APP_ROLES } from "../constants/roles";

const router = express.Router();

const planController = container.resolve<IPlanController>(Token.PlanController);

router.get("/", (req, res, next) => {
  void planController.handleFindAllPlans(req, res, next);
});

router.post(
  "/create",
  auth,
  authorize(APP_ROLES.SUPER_ADMIN),
  (req, res, next) => {
    void planController.handleCreatePlan(req, res, next);
  },
);

router.patch(
  "/toggle/:id",
  auth,
  authorize(APP_ROLES.SUPER_ADMIN),
  (req, res, next) => {
    void planController.handleTogglePlanStatus(req, res, next);
  },
);

export default router;
