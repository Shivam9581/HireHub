import { Router } from "express";
import authMiddleware from "../middlewares/auth.middleware";
import authorizeMiddleware from "../middlewares/authorize.middleware";
import { applyJobController, getMyApplicationsController} from "../controllers/application.controller";

const router = Router();

router.get(
    "/my",
    authMiddleware,
    authorizeMiddleware("student"),
    getMyApplicationsController
);


router.post(
    "/",
    authMiddleware,
    authorizeMiddleware("student"),
    applyJobController
);


import { updateApplicationStatusController } from "../controllers/application.controller";

router.patch("/:id/status", 
    authMiddleware,
    authorizeMiddleware("recruiter"),
    updateApplicationStatusController
)


export default router;


