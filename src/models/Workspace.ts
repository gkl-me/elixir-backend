import { Document, model, Schema } from "mongoose";

export type WorkspaceType = "personal" | "company";

export interface IWorkspace extends Document {
  name: string;
  slug: string;
  type: WorkspaceType;
  ownerId: string;
  companyId?: string;
  subscriptionId?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

const WorkspaceSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true
    },
    slug: {
      type: String,
      required: true,
      unique: true,
    },
    type: {
      type: String,
      enum: ["personal", "company"],
      default: "personal",
    },
    ownerId: {
      type: String,
      required: true,
    },
    companyId: {
      type: String,
    },
    subscriptionId: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

export const Workspace = model<IWorkspace>("Workspace", WorkspaceSchema);
