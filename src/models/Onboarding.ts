import { Document, model, Schema } from "mongoose";

type PlanType = "Free" | "Pro" | "Enterprice";

export interface IOnboarding extends Document {
  userId: string;
  currentStep: number;
  isCompleted: boolean;

  paymentStatus: "pending" | "incomplete" | "success" | "failed";

  planType: PlanType;
  planId: string;
  planPrice: number;

  workspaceName?: string;

  company?: {
    name: string;
    type: string;
    email: string;
    phone: string;
    size: number;
  };

  sessionId?: string;

  workspaceSlug?: string

  createdAt?: Date;
  updatedAt?: Date;
}

const OnboardingSchema = new Schema(
  {
    userId: {
      type: String,
      required: true,
      unique: true,
    },
    currentStep: {
      type: Number,
      default: 1,
    },
    isCompleted: {
      type: Boolean,
      default: false,
    },
    paymentStatus: {
      type: String,
      enum: ["pending", "incomplete", "success", "failed"],
      default: "pending",
    },
    planType: {
      type: String,
      enum: ["Free", "Pro", "Enterprice"],
      default: "Free",
    },
    planId: {
      type: String,
    },
    planPrice: {
      type: Number,
    },
    workspaceName: {
      type: String,
    },
    sessionId: {
      type: String,
    },
    company: {
      name: {
        type: String,
      },
      email: {
        type: String,
      },
      size: {
        type: Number,
      },
      type: {
        type: String,
      },
      phone: {
        type: String,
      },
    },
    workspaceSlug: {
      type: String,
    }
  },
  {
    timestamps: true,
  }
);

export const Onboarding = model<IOnboarding>("Onboarding", OnboardingSchema);
