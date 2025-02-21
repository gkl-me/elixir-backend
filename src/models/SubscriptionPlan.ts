import { Document, model, Schema } from "mongoose";

export interface ISubscriptionPlan extends Document {
  name: string;
  type: string;
  price: number;
  cycle: string;
  features: [string];
  isActive: boolean;
  isDeleted:boolean;
  maxTeams: number;
  maxProjects: number;
  createdAt?: Date;
  updatedAt?: Date;
}

const SubscriptionPlanSchema = new Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  type: {
    type: String,
    required: true,
    enum: ["user", "company"],
  },
  price: {
    type: Number,
    required: true,
  },
  cycle: {
    type: String,
    required: true,
    enum: ["monthly", "quarterly", "annually"],
  },
  features: [
    {
      type: String,
      required: true,
      trim: true,
    },
  ],
  isActive: {
    type: Boolean,
    default: false,
  },
  maxTeams: {
    type: Number,
    required: true,
  },
  maxProjects: {
    type: Number,
    required: true,
  },
  isDeleted: {
    type: Boolean,
    default: false,
  },
});

export const SubscriptionPlan = model<ISubscriptionPlan>(
  "subscriptionplan",
  SubscriptionPlanSchema
);
