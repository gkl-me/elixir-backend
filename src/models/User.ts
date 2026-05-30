import { Document, model, Schema } from "mongoose";

export interface IUser extends Document {
  name: string;
  email: string;
  bio: string;
  jobTitle: string;
  password?: string;
  isVerified: boolean;
  isBlocked: boolean;
  createdAt?: Date;
  updatedAt?: Date;
  avatarUrl?: string;
  googleId?: string;
  role: "user" | "superAdmin";
  githubId?: string;
  githubUsername?: string;
  stripeCustomerId?: string;
  lastActiveWorkspaceId?: string;
}

const UserSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
    isBlocked: {
      type: Boolean,
      default: false,
    },
    password: {
      type: String,
    },
    avatarUrl: {
      type: String,
    },
    role: {
      type: String,
      enum: ["user", "superAdmin"],
      default: "user",
    },
    googleId: {
      type: String,
    },
    githubId: {
      type: String,
    },
    githubUsername: {
      type: String,
    },
    stripeCustomerId: {
      type: String,
    },
    lastActiveWorkspaceId: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

export const User = model<IUser>("User", UserSchema);
