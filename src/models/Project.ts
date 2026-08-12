import { Document, model, Schema } from "mongoose";

export type ProjectStatus = "active" | "on_hold" | "completed" | "archived";
export type ProjectPriority = "urgent" | "high" | "medium" | "low";

export interface IProject extends Document {
  key: string;
  name: string;
  description: string;
  status: ProjectStatus;
  priority: ProjectPriority;
  tags: string[];
  startDate: Date;
  dueDate: Date;
  workspaceId: string;
  teams: string[];

  createdAt?: Date;
  updatedAt?: Date;
}

const ProjectSchema = new Schema(
  {
    key: {
      type: String,
      required: true,
      index: true,
    },
    name: {
      type: String,
      required: true,
    },
    description: {
      type: String,
    },
    status: {
      type: String,
      enum: ["active", "on_hold", "completed", "archived"],
      default: "active",
    },
    priority: {
      type: String,
      enum: ["urgent", "high", "medium", "low"],
      default: "medium",
    },
    tags: {
      type: [String],
      default: [],
    },
    startDate: {
      type: Date,
    },
    dueDate: {
      type: Date,
    },
    workspaceId: {
      type: String,
      required: true,
      index: true,
    },
    teams: {
      type: [String],
      default: [],
    },
  },
  { timestamps: true }
);

export const project = model<IProject>("Project", ProjectSchema);
