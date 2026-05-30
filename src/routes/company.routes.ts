import express from "express";
import { authorize } from "../middlewares/authorize";
import { auth } from "../middlewares/auth";
import { container } from "tsyringe";
import { ICompanyController } from "../controllers/company/interface/ICompanyController";
import { Token } from "../di/token";
import { APP_ROLES } from "../constants/roles";

const router = express.Router();

const companyController = container.resolve<ICompanyController>(
  Token.CompanyController
);

router.get("/", auth, authorize(APP_ROLES.SUPER_ADMIN), (req, res, next) => {
  void companyController.handleGetAllCompany(req, res, next);
});

export default router;
