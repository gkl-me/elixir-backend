import mongoose, { Document, model } from "mongoose";

export interface ICompany extends Document {
  name: string;
  type: string;
  size: number;
  email: string;
  phone: string;
  website?: string;
  isBlocked: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

const CompanySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    type: {
      type: String,
      required: true,
    },
    size: {
      type: Number,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    website: {
      type: String,
    },
    phone: {
      type: String,
    },
    isBlocked: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

export const Company = model<ICompany>("company", CompanySchema);
