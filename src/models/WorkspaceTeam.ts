import { Document, model, Schema } from "mongoose";

export interface IWorkspaceTeam extends Document {
  workspaceId: string;
  name: string;
  description: string;
  memberIds: string[];
  createdByUserId: string;
  createdAt?: Date;
  updatedAt?: Date;
}

const WorkspaceTeamSchema = new Schema(
  {
    workspaceId: {
      type: String,
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    description: {
      type: String,
    },
    memberIds: {
      type: [String],
    },
    createdByUserId: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

export const WorkspaceTeam = model<IWorkspaceTeam>(
  "workspaceTeam",
  WorkspaceTeamSchema
);
