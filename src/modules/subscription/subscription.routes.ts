import { Router } from "express";
import { addSubscriber, getSubscribers } from "./subscription.controller";
const router: Router = Router();

router.post("/subscribe", addSubscriber);
router.get("/subscribers", getSubscribers);

export { router as subscriptionRoutes };
