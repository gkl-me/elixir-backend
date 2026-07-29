import { Document, model, Schema } from "mongoose";
import { PlanType } from "./Plan";

export type SUBSCRIPTION_STATUS = "active" | "canceled" | "past_due" | "paused" | "incomplete" | "incomplete_expired" | 'trialing' | 'unpaid'

export interface ISubscription extends Document {
  userId: string;
  workspaceId: string;

  stripeSubscriptionId: string;
  stripePriceId: string;
  stripeCustomerId?: string

  planId: string;
  planType: PlanType
  price: number

  status: SUBSCRIPTION_STATUS;

  currentPeriodStart?: Date;
  currentPeriodEnd?: Date;
  billingCycle: "monthly"
  cancelAtPeriodEnd?: boolean;

  createdAt?: Date;
  updatedAt?: Date;
}

const SubscriptionSchema = new Schema(
  {
    userId: {
      type: String,
      required: true,
    },
    workspaceId: {
      type: String,
    },
    stripePriceId: {
      type: String,
    },
    stripeSubscriptionId: {
      type: String,
    },
    status: {
      type: String,
      enum: ["active", "inactive", "canceled"],
      default: "inactive",
    },
    currentPeriodStart: {
      type: Date,
    },
    currentPeriodEnd: {
      type: Date,
    },
    cancelAtPeriodEnd: {
      type: Boolean,
      default: false
    },
    planId: {
      type: String,
    },
    planType: {
      type: String,
      enum: ["Free", "Pro", "Enterprice"]
    },
    billingCycle: {
      type: String,
      enum: ["monthly"],
      default: "monthly"
    },
    price: {
      type: Number,
    },
    stripeCustomerId: {
      type: String
    }

  },
  {
    timestamps: true,
  }
);

export const Subscription = model<ISubscription>(
  "Subscription",
  SubscriptionSchema
);
