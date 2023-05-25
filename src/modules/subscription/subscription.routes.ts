import { Router } from "express";
import { addSubscriber } from "./subscription.controller";
const router: Router = Router();

router.post("/subscribe", addSubscriber);

export { router as subscriptionRoutes };
