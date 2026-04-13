import mongoose from "mongoose";
import type { InferSchemaType } from "mongoose";

export const UserSchema = new mongoose.Schema(
  {
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, required: true },
    otpSecret: { type: String, default: null },
    otpEnable: { type: Number, required: true, default: 0 },
  },
  {
    timestamps: true,
  }
);

export type UserDocument = InferSchemaType<typeof UserSchema>;


export type UserDoc = { _id: mongoose.Types.ObjectId } & UserDocument;

export const UserModel = mongoose.model<UserDocument>("User", UserSchema);

