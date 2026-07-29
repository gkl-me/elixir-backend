import { model, Schema, Document } from "mongoose";
import { PlanType } from "./Plan";

export interface ITransaction extends Document {

  transactionRef: string,
  invoiceNumber: string,

  workspaceName: string,
  customerEmail: string,

  userId: string;
  workspaceId: string;
  subscriptionId: string;

  stripeInvoiceId?: string;
  stripeChargeId?: string;
  invoicePdfUrl?: string

  planType: PlanType

  amount: number;
  currency: string

  status: "success" | "failed" | "pending";
  paymentMethod?: string;
  last4: string

  createAt?: Date;
  updatedAt?: Date;
}

const TransactionSchema = new Schema(
  {
    transactionRef: {
      type: String,
      required: true,
    },
    invoiceNumber: {
      type: String,
      required: true
    },
    workspaceName: {
      type: String,
    },
    customerEmail: {
      type: String,
    },
    userId: {
      type: String,
      required: true,
    },
    workspaceId: {
      type: String,
      required: true,
    },
    subscriptionId: {
      type: String,
    },
    stripeInvoiceId: {
      type: String,
    },
    amount: {
      type: Number,
    },
    status: {
      type: String,
      enum: ["success", "failed", "pending"],
      default: "pending",
    },
    paymentMethod: {
      type: String,
      default: "Card"
    },
    last4: {
      type: String,
      default: "000"
    },
    stripeChargeId: {
      type: String,
    },
    invoicePdfUrl: {
      type: String
    },
    planType: {
      type: String,
      enum: ["Free", "Pro", "Enterprice"]
    },
    currency: {
      type: String
    }
  },
  {
    timestamps: true,
  }
);

export const Transaction = model<ITransaction>(
  "Transaction",
  TransactionSchema
);
