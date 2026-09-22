// message.routes.ts
import { Router } from "express";
import { authenticate } from "../middlewares/auth.middleware";
import { getMessageHistory } from "../controllers/message.controller";

const router = Router();

router.get("/:otherUserId", authenticate, getMessageHistory);

export default router;