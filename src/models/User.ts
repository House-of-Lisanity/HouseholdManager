import mongoose, { Schema, Document } from "mongoose";

export interface IUser extends Document {
  email: string;
  name: string;
  password: string;
  role: "admin" | "user";
  disabled: boolean;
  lastLoginAt: Date | null;
  refreshTokenHash: string | null;
  failedLoginAttempts: number;
  lockoutUntil: Date | null;
  passwordResetToken: string | null;
  passwordResetExpires: Date | null;
  emailVerified: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const UserSchema = new Schema<IUser>(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      enum: ["admin", "user"],
      default: "user",
    },
    disabled: { type: Boolean, default: false },
    lastLoginAt: { type: Date, default: null },
    refreshTokenHash: { type: String, default: null },
    failedLoginAttempts: { type: Number, default: 0 },
    lockoutUntil: { type: Date, default: null },
    passwordResetToken: { type: String, default: null },
    passwordResetExpires: { type: Date, default: null },
    emailVerified: { type: Boolean, default: false },
  },
  { timestamps: true }
);

if (mongoose.models.User) {
  delete mongoose.models.User;
}

export default mongoose.model<IUser>("User", UserSchema);
