// Create Token
import { Response } from "express";
import jwt from "jsonwebtoken";
import { JWT_SECRET } from "../config/siteEnv";

export const sendTokens = (user: any) => {
  const token = jwt.sign({ id: user._id }, JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });

  return token;
};

// export const sendToken = (
//   user: any,
//   statusCode: number,
//   res: Response,
//   message: string
// ) => {
//   const token = jwt.sign({ id: user._id }, JWT_SECRET, {
//     expiresIn: process.env.JWT_EXPIRES_IN,
//   });

//   // const token = jwt.sign(user, process.env.JWT_SECRET, {
//   //     expiresIn: process.env.JWT_EXPIRES_IN,
//   // });

//   res.status(statusCode).json({
//     token,
//     status: "success",
//     data: user,
//     message,
//   });
// };
