import { NextFunction, Request, Response } from "express";
import catchAsync from "../../utils/catchAsync";
import { ipLookup } from "../../utils/ipLookup";
import { saveLoveToDB } from "./love.services";
import AppError from "../../utils/appError";

export const giveLove = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { type, title } = req.body;
    const ipAddress = await ipLookup(req);

    const data = await saveLoveToDB(ipAddress, type, title, next);
    if (!data) return next(new AppError("Love not given", 400));

    res.status(200).json({
      status: "success",
      message: "Love given successfully",
    });
  }
);
