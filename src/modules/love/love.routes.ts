import { Router } from "express";
import { giveLove } from "./love.controller";

const router: Router = Router();

router.post("/give", giveLove);

export { router as loveRoutes };
