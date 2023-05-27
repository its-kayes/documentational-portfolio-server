import { NextFunction } from "express";
import { Love } from "./love.model";
import AppError from "../../utils/appError";

export const saveLoveToDB = async (
  ipAddress: string,
  type: string,
  title: string,
  next: NextFunction
) => {
  const saveLove = await Love.create({
    ipAddress,
    type,
    title,
  });

  if (!saveLove) return next(new AppError("Love not given", 400));

  return saveLove;
};

export const getLovesFromDB = async (next: NextFunction) => {
  const data = await Love.find({}).lean().sort({ createdAt: -1 });

  if (!data) return next(new AppError("Love not given", 400));

  return data;
};
