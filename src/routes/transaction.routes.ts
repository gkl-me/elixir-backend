import { Router } from "express";
import { container } from "tsyringe";
import { ITransactionController } from "../controllers/transaction/interface/ITransactionController";
import { Token } from "../di/token";
import { authorize } from "../middlewares/authorize";
import { APP_ROLES } from "../constants/roles";
import { auth } from "../middlewares/auth";

const router = Router();

const transactionController = container.resolve<ITransactionController>(
  Token.TransactionController
);

router.get("/", auth, authorize(APP_ROLES.SUPER_ADMIN), (req, res, next) => {
  void transactionController.handleListTransactions(req, res, next);
});

export default router;
