import { IWorkspaceTeam } from "../../../models/WorkspaceTeam";
import { IBaseRepository } from "../../base/interface/IBaseRepository";



export interface IWorkspaceTeamWithMember {
    _id: string
    name: string,
    memberCount: number,
    memberName: string[]
}

export interface IWorkspaceTeamWithMemberDetail {
    _id: string
    name: string,
    description?: string,
    members: {
        _id: string,
        name: string,
        email: string,
        avatarUrl?: string,
        role: string
    }[]
}

export interface IWorkspaceTeamRepository extends IBaseRepository<IWorkspaceTeam> {
    listTeams(workspaceId: string): Promise<IWorkspaceTeamWithMember[] | []>
    listTeamMembers(workspaceId: string, teamId: string): Promise<IWorkspaceTeamWithMemberDetail | null>
}