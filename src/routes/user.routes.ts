import { Router } from "express";
import { container } from "tsyringe";
import { IUserController } from "../controllers/user/interface/IUserController";
import { Token } from "../di/token";
import { authorize } from "../middlewares/authorize";
import { auth } from "../middlewares/auth";
import { APP_ROLES } from "../constants/roles";

const router = Router();

const userController = container.resolve<IUserController>(Token.UserController);

router.get("/", auth, authorize(APP_ROLES.SUPER_ADMIN), (req, res, next) => {
  void userController.getAllUsers(req, res, next);
});
router.patch(
  "/:id/status",
  auth,
  authorize(APP_ROLES.SUPER_ADMIN),
  (req, res, next) => {
    void userController.toggleBlockStatus(req, res, next);
  }
);


router.get("/me", auth, (req, res, next) => {
  void userController.handleGetMe(req, res, next);
})

router.patch("/change-password", auth, (req, res, next) => {
  void userController.handleChangePassword(req, res, next);
});

router.get("/active-sessions", auth, (req, res, next) => {
  void userController.handleListActiveSessions(req, res, next);
});

router.put("/update-profile", auth, (req, res, next) => {
  void userController.handleUpdateProfile(req, res, next);
});

export default router;
