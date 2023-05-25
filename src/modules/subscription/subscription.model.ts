import { ISubscription } from "./subscription.interface";
import { Schema, model } from "mongoose";

const subscriptionModel = new Schema<ISubscription>(
  {
    email: {
      type: String,
      required: [true, "Email is required"],
    },
    ipAddress: {
      type: String,
    },
    subscribedAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
    timestamps: true,
  }
);

export const Subscription = model<ISubscription>(
  "subscriber",
  subscriptionModel
);
