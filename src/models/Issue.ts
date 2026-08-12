import { Document, model, Schema } from "mongoose";

export type IssueType = "story" | "bug";
export type IssuePriority = "urgent" | "high" | "medium" | "low";
export type IssueStatus = "todo" | "in_progress" | "in_review" | "done";

export interface IIssue extends Document {
  title: string;
  key: string;
  description: string;
  type: IssueType;
  storyPoints: number;
  priority: IssuePriority;
  status: IssueStatus;
  assignee: string;
  reporter: string;

  projectId: string;
  workspaceId: string;
  sprintId?: string;

  labels: string[];
  createdAt?: Date;
  updatedAt?: Date;
}

const IssueSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
    },
    key: {
      type: String,
      required: true,
    },
    description: {
      type: String,
    },
    type: {
      type: String,
      enum: ["story", "bug"],
      default: "story",
    },
    priority: {
      type: String,
      enum: ["urgent", "high", "medium", "low"],
      default: "medium",
    },
    storyPoints: {
      type: Number,
    },
    status: {
      type: String,
      enum: ["todo", "in_progress", "in_review", "done"],
      default: "todo",
    },
    assignee: {
      type: String,
    },
    reporter: {
      type: String,
    },
    projectId: {
      type: String,
      required: true,
    },
    workspaceId: {
      type: String,
      required: true,
    },
    labels: {
      type: [String],
      default: [],
    },
    sprintId: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

export const issue = model<IIssue>("Issue", IssueSchema);
