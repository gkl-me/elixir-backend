import { Document, model, Schema } from "mongoose";

export type WorkspaceInviteStatus =
  | "pending"
  | "accepted"
  | "revoked"
  | "expired";

export interface IWorkspaceInvite extends Document {
  workspaceId: string;
  email: string;
  roleId: string;
  invitedByUserId: string;
  tokenHash: string;
  status: WorkspaceInviteStatus;
  sentAt: Date;
  expiresAt: Date;
  acceptedAt?: Date;
  acceptedByUserId?: string;
  revokedAt?: Date;
  createdAt?: Date;
  updatedAt?: Date;
}

const WorkspaceInviteSchema = new Schema(
  {
    workspaceId: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    roleId: {
      type: String,
      required: true,
    },
    invitedByUserId: {
      type: String,
      required: true,
    },
    tokenHash: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      enum: ["pending", "accepted", "revoked", "expired"],
      default: "pending",
    },
    sentAt: {
      type: Date,
      required: true,
    },
    expiresAt: {
      type: Date,
      required: true,
    },
    acceptedByUserId: {
      type: String,
    },
    acceptedAt: {
      type: Date,
    },
    revokedAt: {
      type: Date,
    },
  },
  {
    timestamps: true,
  }
);

export const WorkspaceInvite = model<IWorkspaceInvite>(
  "WorkspaceInvite",
  WorkspaceInviteSchema
);
