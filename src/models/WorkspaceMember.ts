import { model, Schema } from "mongoose";

export type WorkspaceRole = "owner" | "member" | "admin";
export type MembershipStatus = "active" | "blocked";

export interface IWorkspaceMember extends Document {
  workspaceId: string;
  userId: string;
  role: WorkspaceRole;
  status: MembershipStatus;
  invitedByUserId: string;
  createAt?: Date;
  updateAt?: Date;
}

const WorkspaceMemberSchema = new Schema(
  {
    workspaceId: {
      type: String,
      required: true,
    },
    userId: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      enum: ["owner", "admin", "member"],
      required: true,
    },
    status: {
      type: String,
      enum: ["active", "blocked"],
      default: "active",
      required: true,
    },
    invitedByUserId: {
      type: String,
    },
  },
  {
    timestamps: true,
  },
);

export const WorkspaceMember = model<IWorkspaceMember>(
  "WorkspaceMember",
  WorkspaceMemberSchema,
);
