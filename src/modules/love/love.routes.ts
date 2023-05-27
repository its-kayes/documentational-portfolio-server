import { Router } from "express";
import { getLoves, giveLove } from "./love.controller";

const router: Router = Router();

router.post("/give", giveLove);
router.get("/get", getLoves);

export { router as loveRoutes };
