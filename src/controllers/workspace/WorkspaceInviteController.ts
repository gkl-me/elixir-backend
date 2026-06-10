import { inject, injectable } from "tsyringe";
import { Token } from "../../di/token";
import { IWorkspaceInviteService } from "../../services/workspace/interface/IWorkspaceInviteService";
import { IWorkspaceInviteController } from "./interface/IWorkspaceInviteController";
import { Request, Response, NextFunction } from "express";
import { extractStringParams } from "../../helper/stringParamUtils";
import { successResponse } from "../../helper/responseHanlder";
import { STATUS_CODES } from "../../constants/statusCodes";
import { resendInviteEmail, sendInviteEmail } from "../../queues/email/email.producer";



@injectable()
export class WorkspaceInviteController implements IWorkspaceInviteController {
    constructor(
        @inject(Token.WorkspaceInviteService)
        private readonly workspaceInviteService: IWorkspaceInviteService,
    ) { }


    async handleListInvites(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {

            const { workspaceId } = extractStringParams(req.params, ['workspaceId'])
            const invites = await this.workspaceInviteService.listInvites({
                workspaceId
            })

            successResponse(res, "Workspace invite list ", STATUS_CODES.OK, {
                invites
            })

        } catch (error) {
            next(error)
        }
    }

    async handleSendInvite(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {

            const { workspaceId } = extractStringParams(req.params, ['workspaceId'])

            //validate request body 
            const { email, roleId } = req.body
            const invitedByUserId = req.user.userId

            await sendInviteEmail(
                email,
                workspaceId,
                roleId,
                invitedByUserId
            )

            successResponse(res, "Invite sent successfully", STATUS_CODES.OK, {})

        } catch (error) {
            next(error)
        }
    }

    async handleResendInvite(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {

            const { inviteId, workspaceId } = extractStringParams(req.params, ['inviteId', 'workspaceId'])

            await resendInviteEmail(inviteId, workspaceId)

            successResponse(res, "Invite resent successfully", STATUS_CODES.OK, {})

        } catch (error) {
            next(error)
        }
    }

    async handleRevokeInvite(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {

            const { inviteId, workspaceId } = extractStringParams(req.params, ['inviteId', 'workspaceId'])

            await this.workspaceInviteService.revokeInvite({
                inviteId,
                workspaceId
            })

            successResponse(res, "Invite revoked successfully", STATUS_CODES.OK, {})

        } catch (error) {
            next(error)
        }
    }

    async handleValidateInvite(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {

            const { token } = extractStringParams(req.params, ['token'])

            const validation = await this.workspaceInviteService.validateInvite({
                inviteToken: token,
            })

            successResponse(res, "Invite validated successfully", STATUS_CODES.OK, {
                validation
            })

        } catch (error) {
            next(error)
        }
    }

    async handleAcceptInvite(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {


            const { inviteToken } = req.body
            const userId = req.user.userId

            const accepted = await this.workspaceInviteService.acceptInvite({
                inviteToken,
                userId
            })

            successResponse(res, "Invite accepted successfully", STATUS_CODES.OK, {
                ...accepted
            })

        } catch (error) {
            next(error)
        }
    }
}