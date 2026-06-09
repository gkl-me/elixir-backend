import { Router } from "express";
import { Token } from "../di/token";
import { IWorkspaceController } from "../controllers/workspace/interface/IWorkspaceController";
import { container } from "tsyringe";
import { auth } from "../middlewares/auth";
import { IWorkspaceRoleController } from "../controllers/workspace/interface/IWorkspaceRoleController";
import { checkPlanLimit } from "../middlewares/planLimitGuard";
import { requirePermission } from "../middlewares/workspacePermission";
import { WORKSPACE_PERMISSIONS } from "../constants/workspacePermissions";

const router = Router();

const workspaceController = container.resolve<IWorkspaceController>(
  Token.WorkspaceController
);
const workspaceRoleController = container.resolve<IWorkspaceRoleController>(Token.WorkspaceRoleController)

router.get("/context/:slug", auth, (req, res, next) => {
  void workspaceController.handleWorkspaceContext(req, res, next);
});



//workspace roles 
router.get("/:workspaceId/roles", auth, requirePermission(WORKSPACE_PERMISSIONS.ROLES_VIEW), (req, res, next) => {
  void workspaceRoleController.handleGetRoles(req, res, next)
})
router.post("/:workspaceId/roles", auth, checkPlanLimit('customRoles'), requirePermission(WORKSPACE_PERMISSIONS.ROLES_CREATE), (req, res, next) => {
  void workspaceRoleController.handleCreateRole(req, res, next)
})
router.patch("/:workspaceId/roles/:roleId", auth, requirePermission(WORKSPACE_PERMISSIONS.ROLES_UPDATE), (req, res, next) => {
  void workspaceRoleController.handleUpdateRole(req, res, next)
})
router.delete("/:workspaceId/roles/:roleId", auth, requirePermission(WORKSPACE_PERMISSIONS.ROLES_DELETE), (req, res, next) => {
  void workspaceRoleController.handleDeleteRole(req, res, next)
})


export default router;
