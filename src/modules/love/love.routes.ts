import { Router } from "express";
import { getLoves, giveLove } from "./love.controller";
import { isLoggedIn } from "../../utils/verify";

const router: Router = Router();

router.post("/give", giveLove);
router.get("/get", isLoggedIn, getLoves);

export { router as loveRoutes };
