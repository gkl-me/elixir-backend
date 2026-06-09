import { ICreateRoleDto, ICreateRoleResDto, IDeleteRoleDto, IGetRolesDto, IGetRolesResDto, IUpdateRoleDto, IUpdateRoleResDto } from "../../../interfaces/dtos/WorkspaceRoleDto";


export interface IWorkspaceRoleService {
    getRoles(data: IGetRolesDto): Promise<IGetRolesResDto[] | []>,
    createRole(data: ICreateRoleDto): Promise<ICreateRoleResDto>,
    updateRole(data: IUpdateRoleDto): Promise<IUpdateRoleResDto>,
    deleteRole(data: IDeleteRoleDto): Promise<void>
}