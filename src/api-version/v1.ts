import { Router } from "express";
import { subscriptionRoutes } from "../modules/subscription/subscription.routes";
import { loveRoutes } from "../modules/love/love.routes";
import { authRoutes } from "../modules/auth/auth.routes";
import { isIpBlock } from "../middlewares/isIpBlock";

const router: Router = Router();

router.use("/subscription", subscriptionRoutes);
router.use("/love", loveRoutes);
router.use("/auth", isIpBlock, authRoutes);

export { router as v1 };

// Path: src\api-version\v2.ts
