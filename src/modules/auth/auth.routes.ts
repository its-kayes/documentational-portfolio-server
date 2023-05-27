import { Router } from "express";
import {
  registerController,
  login,
  forgetPassword,
  changePassword,
  resetPassword,
} from "./auth.controller";

const router: Router = Router();

// router.post("/register", registerController);
router.get("/login", login);
// router.post("/change-password", changePassword);
// router.get("/forget-password", forgetPassword);
// router.post("/reset-password", resetPassword);

export { router as authRoutes };
