import { Document, model, Schema } from "mongoose";

export interface IWorkspaceMember extends Document {
  workspaceId: string;
  userId: string;
  roleId: string;
  isRemoved: boolean;
  invitedByUserId: string;
  joinedAt?: Date;
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
    roleId: {
      type: String,
      required: true,
    },
    isRemoved: {
      type: Boolean,
      default: false,
    },
    invitedByUserId: {
      type: String,
    },
    joinedAt: {
      type: Date,
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
