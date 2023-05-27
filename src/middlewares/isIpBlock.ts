import { NextFunction, Request, Response } from "express";
import { getIpAddress } from "../modules/auth/auth.services";
import { IpBlock } from "../modules/auth/ipBlock.model";
import AppError from "../utils/appError";

export const isIpBlock = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<string | never | void> => {
  const ip: string = await getIpAddress(req);
  const isIpBlocked = await IpBlock.aggregate([
    {
      $match: {
        ip,
        hitTime: {
          $gte: new Date(new Date().getTime() - 5 * 60 * 1000),
          $lte: new Date(),
        },
      },
    },
    {
      $project: {
        _id: 0,
        hitTime: 1,
      },
    },
  ]);

  if (isIpBlocked.length >= 4) {
    return next(
      new AppError(
        "Too many failed request from this IP, please try 5 minutes later",
        429
      )
    );
  }

  next();
};
