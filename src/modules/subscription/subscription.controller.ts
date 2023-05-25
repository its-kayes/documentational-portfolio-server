import { NextFunction, Request, Response } from "express";
import AppError from "../../utils/appError";
import catchAsync from "../../utils/catchAsync";
import { ipLookup } from "../../utils/ipLookUp";
import { addSubscriberToDB } from "./subscription.services";

export const addSubscriber = catchAsync(
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const { email } = req.body;
    const ipAddress = await ipLookup(req);

    if (!email) return next(new AppError("Please provide an email", 400));
    if (!ipAddress)
      return next(new AppError("Please provide an IP address", 400));

    const subscription = await addSubscriberToDB(email, ipAddress, next);

    res.status(201).json({
      status: "success",
      subscription,
    });
  }
);
