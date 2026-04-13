import mongoose from "mongoose";
import type { InferSchemaType } from "mongoose";

export const OtpBackupCodeSchema = new mongoose.Schema(
  {
    userId: { type: String, required: true },
    codes: { type: String, required: true },
    nbCodeUsed: { type: Number, required: true, default: 0 },
    nbConsecutiveTests: { type: Number, required: true, default: 0 },
  },
  {
    timestamps: true,
  }
);

export type OtpBackupCodeDocument = InferSchemaType<typeof OtpBackupCodeSchema>;

export type OtpBackupCodeDoc = { _id: mongoose.Types.ObjectId } & OtpBackupCodeDocument;

export const OtpBackupCodeModel = mongoose.model<OtpBackupCodeDocument>(
  "OtpBackupCode",
  OtpBackupCodeSchema
);

