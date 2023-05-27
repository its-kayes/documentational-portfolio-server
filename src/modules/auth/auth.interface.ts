import { Document } from "mongoose";

export interface IUser {
  name: string;
  email: string;
  password: string;
  role: string;
  signInDate: Date;
  failedLoginAttempts: string[];
  lockUntil: Date;
  isVerified: boolean;
  verificationToken: number;
  loginHistory: {
    loginDate: Date;
    loginIP: string;
  }[];
  passwordResetToken: string;
}
export interface IRegisterType extends IUser {
  loginIP: string;
  confirmPassword: string;
}

export interface ILoginType {
  email: string;
  pass: string;
}

export interface IForgetPassType {
  email: string;
}

export interface IResetPassword {
  token: string;
  confirmPass: string;
  newPass: string;
}

export interface IDecodedToken {
  token: string;
  email: string;
  exp: number;
  iat: number;
}

export interface UserDocument extends Document {
  email: string;
  passwordResetToken: string;
}

export interface ICPassType {
  email: string;
  oldPass: string;
  newPass: string;
  confirmPass: string;
}
