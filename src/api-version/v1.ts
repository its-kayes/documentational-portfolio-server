import { Router } from "express";
import { subscriptionRoutes } from "../modules/subscription/subscription.routes";

const router: Router = Router();

router.use("/subscription", subscriptionRoutes);

export { router as v1 };
