import { Router } from "express";
import { subscriptionRoutes } from "../modules/subscription/subscription.routes";
import { loveRoutes } from "../modules/love/love.routes";

const router: Router = Router();

router.use("/subscription", subscriptionRoutes);
router.use("/love", loveRoutes);

export { router as v1 };
