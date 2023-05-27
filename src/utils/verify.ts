import { NextFunction, Request, Response } from "express";
import catchAsync from "./catchAsync";
import AppError from "./appError";
import jwt, { JwtPayload } from "jsonwebtoken";
import { User } from "../modules/auth/auth.model";
import { JWT_SECRET } from "../config/siteEnv";
import { IUser } from "../modules/auth/auth.interface";

interface AuthRequest extends Request {
  user?: IUser;
}

export const isLoggedIn = catchAsync(
  async (req: AuthRequest, res: Response, next: NextFunction) => {
    const token = req.headers.token;

    // If user is not logged in or no token provided, throw this error
    if (!token)
      return next(new AppError("Please log in to access this resource", 403));

    const decodedData = jwt.verify(token as string, JWT_SECRET) as JwtPayload;

    // Token exists but is not valid, throw this error
    if (!decodedData.id) return next(new AppError("Invalid token", 403));

    req.user = (await User.findById(decodedData.id)) as IUser;
    next();
  }
);
