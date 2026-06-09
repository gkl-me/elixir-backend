import { inject, injectable } from "tsyringe";
import { IWorkspaceInviteService } from "./interface/IWorkspaceInviteService";
import { Token } from "../../di/token";
import { IWorkspaceInviteRepository } from "../../repositories/workspace/interface/IWorkspaceInviteRepository";
import { IAcceptInviteDto, IAcceptInviteResDto, IListInvitesDto, IListInvitesResDto, IResendInviteDto, IRevokeInviteDto, ISendInviteDto, IValidateInviteDto, IValidateInviteResDto } from "../../interfaces/dtos/WorkspaceInviteDto";
import { logError } from "../../middlewares/loggerHelper";
import { workspaceInviteDtoMapper } from "../../interfaces/mapper/workspaceDtoMapper";
import { IEmailService } from "../../providers/interfaces/IEmailService";
import { ITokenManager } from "../../providers/interfaces/ITokenManager";
import { ENV } from "../../constants/env";
import { CustomError } from "../../errors/CustomError";
import { CONSTANT_MESSAGES } from "../../constants/messages";
import { STATUS_CODES } from "../../constants/statusCodes";
import { IWorkspaceRepository } from "../../repositories/workspace/interface/IWorkspaceRepository";
import { IWorkspaceMemberRepository } from "../../repositories/workspace/interface/IWorkspaceMemberRepository";
import { IUserRepository } from "../../repositories/user/interfaces/IUserRepository";


@injectable()
export class WorkspaceInviteService implements IWorkspaceInviteService {
    constructor(
        @inject(Token.WorkspaceInviteRepository) private readonly _workspaceInviteRepository: IWorkspaceInviteRepository,
        @inject(Token.TokenManager) private readonly _tokenManager: ITokenManager,
        @inject(Token.EmailService) private readonly _emailService: IEmailService,
        @inject(Token.WorkspaceRepository) private readonly _workspaceRepository: IWorkspaceRepository,
        @inject(Token.WorkspaceMemberRepository) private readonly _workspaceMemberRepository: IWorkspaceMemberRepository,
        @inject(Token.UserRepository) private readonly _userRepository: IUserRepository

    ) { }


    async listInvites(data: IListInvitesDto): Promise<IListInvitesResDto[] | []> {
        try {

            const { workspaceId } = data

            const invites = await this._workspaceInviteRepository.findAll({
                workspaceId
            })

            return invites?.length ? invites.map((i) => workspaceInviteDtoMapper.toListInvites(i)) : []

        } catch (error) {
            logError(error, {
                service: "WorkspaceInviteService.listInvites"
            })
            throw error
        }
    }

    async sendInvite(data: ISendInviteDto): Promise<void> {
        try {

            const { workspaceId, email, roleId, invitedByUserId } = data

            const existing = await this._workspaceInviteRepository.findOne({
                workspaceId,
                email,
                status: "pending"
            })

            if (existing) {
                existing.status = 'revoked'
                existing.revokedAt = new Date()
                await existing.save()
            }

            const token = this._tokenManager.generateRandomToken()
            const hashToken = this._tokenManager.hashToken(token)
            const expiresAt = new Date(Date.now() + ENV.INVITE_TTL)

            await this._workspaceInviteRepository.create({
                workspaceId,
                roleId,
                email,
                invitedByUserId,
                tokenHash: hashToken,
                expiresAt,
                status: 'pending',
                sentAt: new Date()
            })


            //email 
            await this._emailService.sendEmail(
                email,
                "Invites to workspace",
                "invite url"
            )

            return

        } catch (error) {
            logError(error, {
                service: "WorkspaceInviteService.sendInvites"
            })
            throw error
        }
    }

    async resendInvite(data: IResendInviteDto): Promise<void> {
        try {

            const { inviteId, workspaceId } = data

            const invite = await this._workspaceInviteRepository.findById(inviteId)
            if (!invite || invite.workspaceId.toString() !== workspaceId) {
                throw new CustomError(CONSTANT_MESSAGES.BAD_REQUEST, STATUS_CODES.BAD_REQUEST)
            }

            if (invite.status === 'pending') {
                throw new CustomError("Cant only resend pending invites", STATUS_CODES.BAD_REQUEST)
            }


            const token = this._tokenManager.generateRandomToken()
            const hashToken = this._tokenManager.hashToken(token)
            const expiresAt = new Date(Date.now() + ENV.INVITE_TTL)

            invite.tokenHash = hashToken
            invite.expiresAt = expiresAt
            invite.sentAt = new Date()
            invite.status = 'pending'
            await invite.save()

            await this._emailService.sendEmail(
                invite.email,
                "Invites to workspace",
                "invite url"
            )

            return

        } catch (error) {
            logError(error, {
                service: "WorkspaceInviteService.resendInvites"
            })
            throw error
        }
    }

    async revokeInvite(data: IRevokeInviteDto): Promise<void> {
        try {

            const { inviteId, workspaceId } = data

            const invite = await this._workspaceInviteRepository.findById(inviteId)
            if (!invite || invite.workspaceId.toString() !== workspaceId) {
                throw new CustomError(CONSTANT_MESSAGES.BAD_REQUEST, STATUS_CODES.BAD_REQUEST)
            }

            if (invite.status !== 'pending') {
                throw new CustomError("Cant only revoke pending invites", STATUS_CODES.BAD_REQUEST)
            }

            invite.status = 'revoked'
            invite.revokedAt = new Date()
            await invite.save()

            return

        } catch (error) {
            logError(error, {
                service: "WorkspaceInviteService.revokeInvites"
            })
            throw error
        }
    }

    async validateInvite(data: IValidateInviteDto): Promise<IValidateInviteResDto> {
        try {

            const { inviteToken } = data

            const hashToken = this._tokenManager.hashToken(inviteToken)

            const invite = await this._workspaceInviteRepository.findOne({
                tokenHash: hashToken
            })

            if (!invite) {
                throw new CustomError(CONSTANT_MESSAGES.BAD_REQUEST, STATUS_CODES.BAD_REQUEST)
            }

            if (invite.status === 'pending') {
                throw new CustomError("Already Used token ", STATUS_CODES.BAD_REQUEST)
            }

            if (invite.status === 'revoked') {
                throw new CustomError("revoked invite", STATUS_CODES.BAD_REQUEST)
            }

            const isExpired = invite.expiresAt < new Date()

            if (isExpired) {
                invite.status = 'expired'
                await invite.save()
                throw new CustomError("invite expired", STATUS_CODES.BAD_REQUEST)
            }

            const workspace = await this._workspaceRepository.findById(invite.workspaceId)
            if (!workspace) {
                throw new CustomError(CONSTANT_MESSAGES.BAD_REQUEST, STATUS_CODES.BAD_REQUEST)
            }

            return {
                workspaceName: workspace.name,
                workspaceSlug: workspace.slug,
                email: invite.email
            }

        } catch (error) {
            logError(error, {
                service: "WorkspaceInviteService.validateInvites"
            })
            throw error
        }
    }

    async acceptInvite(data: IAcceptInviteDto): Promise<IAcceptInviteResDto> {
        try {

            const { inviteToken, userId } = data
            const hashToken = this._tokenManager.hashToken(inviteToken)

            const invite = await this._workspaceInviteRepository.findOne({
                tokenHash: hashToken
            })

            if (!invite) {
                throw new CustomError(CONSTANT_MESSAGES.BAD_REQUEST, STATUS_CODES.BAD_REQUEST)
            }

            if (invite.status !== 'pending') {
                throw new CustomError("Invite no longer valid", STATUS_CODES.BAD_REQUEST)
            }

            const isExpired = invite.expiresAt < new Date()

            if (isExpired) {
                invite.status = 'expired'
                await invite.save()
                throw new CustomError("invite expired", STATUS_CODES.BAD_REQUEST)
            }

            const alreadyMember = await this._workspaceMemberRepository.findOne({
                workspaceId: invite.workspaceId,
                userId,
                isRemoved: false,
            })

            if (alreadyMember) {
                throw new CustomError("You are already a member of this workspace", STATUS_CODES.BAD_REQUEST)
            }

            await this._workspaceMemberRepository.create({
                workspaceId: invite.workspaceId,
                roleId: invite.roleId,
                userId,
                isRemoved: false,
                invitedByUserId: invite.invitedByUserId
            })

            invite.status = 'accepted'
            invite.acceptedAt = new Date()
            await invite.save()

            await this._userRepository.update(userId, {
                lastActiveWorkspaceId: invite.workspaceId,
            })

            const workspace = await this._workspaceRepository.findById(invite.workspaceId)
            if (!workspace) {
                throw new CustomError(CONSTANT_MESSAGES.BAD_REQUEST, STATUS_CODES.BAD_REQUEST)
            }

            return {
                workspaceSlug: workspace.slug
            }

        } catch (error) {
            logError(error, {
                service: "WorkspaceInviteService.acceptInvite"
            })
            throw error
        }
    }
}