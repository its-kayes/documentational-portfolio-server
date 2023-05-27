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

export const getSubscribersFromDB = async (next: NextFunction) => {
  const data = await Subscription.find({}).lean().sort({ createdAt: -1 });

  if (!data) return next(new AppError("Subscription not given", 400));

  return data;
};
