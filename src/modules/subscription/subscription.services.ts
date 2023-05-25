import { NextFunction } from "express";
import AppError from "../../utils/appError";
import { Subscription } from "./subscription.model";

export const addSubscriberToDB = async (
  email: string,
  ipAddress: string,
  next: NextFunction
): Promise<unknown> => {
  const subscription = await Subscription.create({ email, ipAddress });
  if (!subscription) return next(new AppError("Subscription failed", 400));

  return subscription;
};
