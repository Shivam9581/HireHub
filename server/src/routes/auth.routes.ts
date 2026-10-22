import { Router } from "express";
import { register, login } from "../controllers/auth.controller";
import authMiddleware from "../middlewares/auth.middleware";

const router = Router();

router.post("/register", register);
router.post("/login", login);

router.get("/profile", authMiddleware, (req, res) => {
    res.status(200).json({
        id: req.user?.id,
        role: req.user?.role,
    });
});

// import authorizeMiddleware from "../middlewares/authorize.middleware";
// import upload from "../middlewares/upload.middleware";
// import { uploadResumeController } from "../controllers/resume.controller";


// router.patch(
//     "/resume",
//     authMiddleware,
//     authorizeMiddleware("student"),
//     upload.single("resume"),
//     uploadResumeController
// );

export default router;