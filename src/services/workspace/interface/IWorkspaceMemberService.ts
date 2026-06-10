import {
  IListMemberDto,
  IListMemberResDto,
  IRemoveMemberDto,
  IUpdateMemberDto,
} from "../../../interfaces/dtos/WorkspaceMemberDto";

export interface IWorkspaceMemberService {
  listMember(data: IListMemberDto): Promise<IListMemberResDto[] | []>;
  updateMemberRole(data: IUpdateMemberDto): Promise<void>;
  removeMember(data: IRemoveMemberDto): Promise<void>;
}
