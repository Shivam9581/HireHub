import { Router } from "express";
import authMiddleware from "../middlewares/auth.middleware";
import { getProfileController, updateProfileController, uploadResumeController, deleteResumeController } from "../controllers/user.controller";

import upload from "../middlewares/upload.middleware";
import authorizeMiddleware from "../middlewares/authorize.middleware";


const router = Router();

router.get("/profile", authMiddleware, getProfileController);
router.put("/profile", authMiddleware, updateProfileController);

router.post("/resume", authMiddleware, authorizeMiddleware("student"), upload.single("resume"), uploadResumeController);
router.delete("/resume", authMiddleware, authorizeMiddleware("student"), deleteResumeController);
export default router;