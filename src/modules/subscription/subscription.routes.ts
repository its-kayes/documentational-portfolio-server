import { Router } from "express";
import { addSubscriber, getSubscribers } from "./subscription.controller";
import { isLoggedIn } from "../../utils/verify";
const router: Router = Router();

router.post("/subscribe", addSubscriber);
router.get("/subscribers", isLoggedIn, getSubscribers);

export { router as subscriptionRoutes };
