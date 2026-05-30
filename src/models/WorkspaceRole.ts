import { Document, model, Schema } from "mongoose";

export interface IWorkspaceRole extends Document {
  workspaceId: string;
  key: string;
  name: string;
  permissions: string[];
  createdByUserId: string;
  isEditable: boolean;
  isDeletable: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

const WorkspaceRoleSchema = new Schema(
  {
    workspaceId: {
      type: String,
      required: true,
    },
    key: {
      type: String,
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    permissions: [
      {
        type: String,
      },
    ],
    createdByUserId: {
      type: String,
    },
    isEditable: {
      type: Boolean,
      default: true,
    },
    isDeletable: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

export const WorkspaceRole = model<IWorkspaceRole>(
  "WorkspaceRole",
  WorkspaceRoleSchema
);
