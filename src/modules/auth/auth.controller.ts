import bcrypt from "bcryptjs";
import { NextFunction, Request, Response } from "express";

import crypto from "node:crypto";
import jwt from "jsonwebtoken";
import catchAsync from "../../utils/catchAsync";
import {
  ICPassType,
  IDecodedToken,
  IForgetPassType,
  ILoginType,
  IRegisterType,
  IResetPassword,
  UserDocument,
} from "./auth.interface";
import AppError from "../../utils/appError";
import { User } from "./auth.model";
import {
  getIpAddress,
  getSixDigitCode,
  passwordReges,
  sendEmailWithSmtp,
  trackFailedAttempt,
} from "./auth.services";
import { IpBlock } from "./ipBlock.model";
import { FRONTEND_BASE_URL, JWT_SECRET } from "../../config/siteEnv";

// <--------------------------- User Register ------------------------>
export const registerController = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { name, email, password, confirmPassword, loginIP }: IRegisterType =
      req.body;
    if (!name || !email || !password || !confirmPassword || !loginIP)
      return next(new AppError("Missing required fields", 400));

    if (password !== confirmPassword)
      return next(
        new AppError("Password and Confirm Password doesn't match", 400)
      );

    if (!(await passwordReges(password)))
      return next(new AppError("Password must be 4 character long!", 401));

    const isRegister = await User.findOne({ email });
    if (isRegister) return next(new AppError("Email already registered", 400));

    const hashPassword = await bcrypt.hash(password, 10);
    const verificationToken = getSixDigitCode();

    const newUser = await User.create({
      name,
      email,
      password: hashPassword,
      loginHistory: [{ loginIP: await getIpAddress(req) }],
      verificationToken,
    });

    if (!newUser) return next(new AppError("Failed to create new user", 400));

    //        <---------- Send Token to Email ------------>

    const dataForSendMail = {
      to: email,
      name,
      verificationToken,
    };

    const response = await sendEmailWithSmtp(dataForSendMail);

    if (!response.status) {
      next(new AppError(`${response.message}`, 400));
    }

    //        <---------- Send Token to Email ------------>

    res.status(200).json({
      status: "success",
      message:
        "Registration successful. Please check your email for verification code",
    });
  }
);

// <---------------------- User Login ------------------------>
export const login = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { email, pass }: ILoginType = req.query as unknown as ILoginType;

    if (!email) return next(new AppError("Email Required", 401));
    if (!pass) return next(new AppError("Password Required", 401));

    if (!(await passwordReges(pass)))
      return next(new AppError("Password must be 4 character long!", 401));

    // <------ Is User Exit -------->
    const isUser = await User.findOne({ email: email }).select("password");
    if (!isUser) return next(new AppError("Invalid User", 404));

    // <------ Is User Verify -------->
    const isPassOk = await bcrypt.compare(pass, isUser.password);

    // <------ Track Failed Login Attempt -------->
    if (!isPassOk) {
      const saveAttempt: boolean = await trackFailedAttempt(
        await getIpAddress(req)
      );
      if (!saveAttempt)
        return next(new AppError("Failed to save login attempt", 400));
      return next(new AppError("Wrong Password", 401));
    }

    // <-------- Clear Failed Attempt -------->
    const clearLoginAttempts = await IpBlock.deleteMany({
      ip: await getIpAddress(req),
    });
    if (!clearLoginAttempts)
      return next(new AppError("Failed to clear login attempt", 400));

    return res.status(200).json({
      message: "Login Successfully",
      isPassOk,
      id: await getIpAddress(req),
    });
  }
);

// <--------------------- Change Password -------------------->
export const changePassword = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { email, oldPass, newPass, confirmPass }: ICPassType = req.body;

    if (!email || !oldPass || !newPass || !confirmPass)
      return next(new AppError("Missing required fields", 400));

    if (newPass !== confirmPass)
      return next(
        new AppError("Password and Confirm Password doesn't match", 400)
      );

    if (!(await passwordReges(newPass)))
      return next(new AppError("Password requirement does't match", 400));

    // <------ Is User Exit -------->
    const isUser = await User.findOne({ email }).lean().select("password");
    if (!isUser) {
      const saveAttempt: boolean = await trackFailedAttempt(
        await getIpAddress(req)
      );
      if (!saveAttempt)
        return next(new AppError("Failed to save attempt", 400));
      return next(new AppError("Invalid User", 404));
    }

    // <------ Is User Verify -------->
    const isPrePassOk: boolean = await bcrypt.compare(oldPass, isUser.password);
    if (!isPrePassOk) {
      const saveAttempt: boolean = await trackFailedAttempt(
        await getIpAddress(req)
      );
      if (!saveAttempt)
        return next(new AppError("Failed to save attempt", 400));
      return next(new AppError("Wrong Old Password", 401));
    }

    // <------ Update Password -------->
    const hashPassword: string = await bcrypt.hash(newPass, 10);
    const updatePass = await User.findOneAndUpdate(
      { email },
      { password: hashPassword },
      { new: true, useFindAndModify: false, runValidators: true }
    )
      .lean()
      .select("email");

    if (!updatePass)
      return next(new AppError("Failed to update password", 400));

    // <-------- Clear Failed Attempt -------->
    const clearLoginAttempts = await IpBlock.deleteMany({
      ip: await getIpAddress(req),
    });
    if (!clearLoginAttempts)
      return next(new AppError("Failed to clear login attempt", 400));

    res.status(200).json({
      message: "Password Changed !",
    });
  }
);

// <-------------------- Forget Password ---------------------->
export const forgetPassword = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { email }: IForgetPassType = req.query as unknown as IForgetPassType;

    if (!email) return next(new AppError("Email required !", 404));

    const isUser = await User.findOne({ email })
      .lean()
      .select("passwordResetToken");
    if (!isUser) return next(new AppError("No user exist !", 404));

    const generateToken: string = crypto.randomBytes(64).toString("hex");

    const saveToken = await User.findOneAndUpdate(
      { email },
      { passwordResetToken: generateToken },
      { new: true }
    );
    if (!saveToken) return next(new AppError("Error to save reset token", 400));

    const tokenToJWT: string = jwt.sign(
      { token: generateToken, email },
      JWT_SECRET,
      {
        expiresIn: 60 * 60,
      }
    );

    const resetLink = `Please visit this link for reset your password! Link will be valid for next 3 minutes <a href="${FRONTEND_BASE_URL}/auth/forget-password/${tokenToJWT}"> link </a>`;

    return res.status(200).json({
      message: "Successfully request for forget Password",
      resetLink,
    });
  }
);

// <---------------------- Reset Password ------------------------------->
export const resetPassword = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { token, newPass, confirmPass }: IResetPassword = req.body;
    if (!token || !newPass || !confirmPass)
      return next(new AppError("Required property missing", 404));

    if (newPass !== confirmPass)
      return next(new AppError("Confirm Password doesn't match", 400));

    const decodeToken: IDecodedToken = jwt.verify(
      token,
      JWT_SECRET
    ) as IDecodedToken;
    if (!decodeToken) return next(new AppError("UnAuthorized Token", 402));

    const isUser = await User.findOne<UserDocument>({
      email: decodeToken.email,
    })
      .lean()
      .select(["passwordResetToken", "email"]);

    if (!isUser) return next(new AppError("User does't exits", 404));

    if (isUser.passwordResetToken !== decodeToken.token)
      return next(new AppError("Token doesn't match, UnAuthorized User", 402));

    const hashPassword: string = await bcrypt.hash(newPass, 10);

    const updatePassword = await User.findOneAndUpdate(
      { email: isUser.email },
      { password: hashPassword },
      { new: true }
    );

    if (!updatePassword)
      return next(new AppError("Error while updating password", 400));

    res.status(200).json({
      message: "Reset Password",
      decodeToken,
    });
  }
);
