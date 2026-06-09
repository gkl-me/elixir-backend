import { IAcceptInviteDto, IAcceptInviteResDto, IListInvitesDto, IListInvitesResDto, IResendInviteDto, IRevokeInviteDto, ISendInviteDto, IValidateInviteDto, IValidateInviteResDto } from "../../../interfaces/dtos/WorkspaceInviteDto";
import { WorkspaceInviteStatus } from "../../../models/WorkspaceInvite";

export interface IWorkspaceInviteService {
    listInvites(data: IListInvitesDto): Promise<IListInvitesResDto[] | []>
    sendInvite(data: ISendInviteDto): Promise<void>
    resendInvite(data: IResendInviteDto): Promise<void>
    revokeInvite(data: IRevokeInviteDto): Promise<void>
    validateInvite(data: IValidateInviteDto): Promise<IValidateInviteResDto>
    acceptInvite(data: IAcceptInviteDto): Promise<IAcceptInviteResDto>
}