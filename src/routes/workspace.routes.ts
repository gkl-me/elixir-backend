import { Router } from "express";
import { Token } from "../di/token";
import { IWorkspaceController } from "../controllers/workspace/interface/IWorkspaceController";
import { container } from "tsyringe";
import { auth } from "../middlewares/auth";
import { IWorkspaceRoleController } from "../controllers/workspace/interface/IWorkspaceRoleController";
import { checkPlanLimit } from "../middlewares/planLimitGuard";
import { requirePermission } from "../middlewares/workspacePermission";
import { WORKSPACE_PERMISSIONS } from "../constants/workspacePermissions";
import { IWorkspaceInviteController } from "../controllers/workspace/interface/IWorkspaceInviteController";
import { IWorkspaceMemberController } from "../controllers/workspace/interface/IWorkspaceMemberController";

const router = Router();

const workspaceController = container.resolve<IWorkspaceController>(
  Token.WorkspaceController
);
const workspaceRoleController = container.resolve<IWorkspaceRoleController>(
  Token.WorkspaceRoleController
);
const workspaceInviteController = container.resolve<IWorkspaceInviteController>(
  Token.WorkspaceInviteController
);
const workspaceMemberController = container.resolve<IWorkspaceMemberController>(
  Token.WorkspaceMemberController
);

router.get("/context/:slug", auth, (req, res, next) => {
  void workspaceController.handleWorkspaceContext(req, res, next);
});

//workspace roles
router.get(
  "/:workspaceId/roles",
  auth,
  requirePermission(WORKSPACE_PERMISSIONS.ROLES_VIEW),
  (req, res, next) => {
    void workspaceRoleController.handleGetRoles(req, res, next);
  }
);
router.post(
  "/:workspaceId/roles",
  auth,
  checkPlanLimit("customRoles"),
  requirePermission(WORKSPACE_PERMISSIONS.ROLES_CREATE),
  (req, res, next) => {
    void workspaceRoleController.handleCreateRole(req, res, next);
  }
);
router.patch(
  "/:workspaceId/roles/:roleId",
  auth,
  requirePermission(WORKSPACE_PERMISSIONS.ROLES_UPDATE),
  (req, res, next) => {
    void workspaceRoleController.handleUpdateRole(req, res, next);
  }
);
router.delete(
  "/:workspaceId/roles/:roleId",
  auth,
  requirePermission(WORKSPACE_PERMISSIONS.ROLES_DELETE),
  (req, res, next) => {
    void workspaceRoleController.handleDeleteRole(req, res, next);
  }
);

// Invite validation & accept — MUST come before /:workspaceId/invites to avoid
// Express capturing 'invites' as a workspaceId
router.get("/invites/validate/:token", (req, res, next) => {
  void workspaceInviteController.handleValidateInvite(req, res, next);
});
router.post("/invites/accept", auth, (req, res, next) => {
  void workspaceInviteController.handleAcceptInvite(req, res, next);
});

//workspace invites
router.get(
  "/:workspaceId/invites",
  auth,
  requirePermission(WORKSPACE_PERMISSIONS.MEMBERS_INVITE),
  (req, res, next) => {
    void workspaceInviteController.handleListInvites(req, res, next);
  }
);
router.post(
  "/:workspaceId/invites",
  auth,
  checkPlanLimit("members"),
  requirePermission(WORKSPACE_PERMISSIONS.MEMBERS_INVITE),
  (req, res, next) => {
    void workspaceInviteController.handleSendInvite(req, res, next);
  }
);
router.get(
  "/:workspaceId/invites/:inviteId/resend",
  auth,
  requirePermission(WORKSPACE_PERMISSIONS.MEMBERS_INVITE),
  (req, res, next) => {
    void workspaceInviteController.handleResendInvite(req, res, next);
  }
);
router.patch(
  "/:workspaceId/invites/:inviteId/revoke",
  auth,
  requirePermission(WORKSPACE_PERMISSIONS.MEMBERS_INVITE),
  (req, res, next) => {
    void workspaceInviteController.handleRevokeInvite(req, res, next);
  }
);

//members
router.get(
  "/:workspaceId/members",
  auth,
  requirePermission(WORKSPACE_PERMISSIONS.MEMBERS_VIEW),
  (req, res, next) => {
    void workspaceMemberController.handleListMembers(req, res, next);
  }
);
router.patch(
  "/:workspaceId/members/:memberId",
  auth,
  requirePermission(WORKSPACE_PERMISSIONS.MEMBERS_ROLE_UPDATE),
  (req, res, next) => {
    void workspaceMemberController.handleUpdateMemberRole(req, res, next);
  }
);
router.delete(
  "/:workspaceId/members/:memberId",
  auth,
  requirePermission(WORKSPACE_PERMISSIONS.MEMBERS_REMOVE),
  (req, res, next) => {
    void workspaceMemberController.handleRemoveMember(req, res, next);
  }
);

export default router;
