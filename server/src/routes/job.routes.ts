// import { Router } from "express";
// import authMiddleware from "../middlewares/auth.middleware";
// import authorizeMiddleware from "../middlewares/authorize.middleware";
// import { createJobController , getAllJobsController, getJobByIdController, updateJobController, deleteJobController} from "../controllers/job.controller";

// const router = Router();

// router.post("/",
//     authMiddleware,
//     authorizeMiddleware("recruiter"),
//     createJobController
// );
// router.get("/:id", getJobByIdController);
// router.get("/", getAllJobsController);

// router.put("/:id",
//     authMiddleware,
//     authorizeMiddleware("recruiter"),
//     updateJobController
// );

// router.delete("/:id",
//     authMiddleware,
//     authorizeMiddleware("recruiter"),
//     deleteJobController
// );


// import { getApplicantsController } from "../controllers/application.controller";
// router.get(
//     "/:id/applicants",
//     authMiddleware,
//     authorizeMiddleware("recruiter"),
//     getApplicantsController
// );

// import {getMyJobsController} from "../controllers/job.controller";

// router.get(
//     "/my",
//     authMiddleware,
//     authorizeMiddleware("recruiter"),
//     getMyJobsController
// );

// import { getRecruiterDashboardController } from "../controllers/job.controller";

// router.get(
//     "/dashboard", 
//     authMiddleware,
//     authorizeMiddleware("recruiter"),
//     getRecruiterDashboardController
// );

// router.get("/:id", getJobByIdController);

// export default router;


import { Router } from "express";

import authMiddleware from "../middlewares/auth.middleware";
import authorizeMiddleware from "../middlewares/authorize.middleware";

import {
  createJobController,
  getAllJobsController,
  getJobByIdController,
  updateJobController,
  deleteJobController,
  getMyJobsController,
  getRecruiterDashboardController,
} from "../controllers/job.controller";

import {
  getApplicantsController,
} from "../controllers/application.controller";

const router = Router();


// Create job
router.post(
  "/",
  authMiddleware,
  authorizeMiddleware("recruiter"),
  createJobController
);


// Get all jobs
router.get(
  "/",
  getAllJobsController
);


// My jobs
router.get(
  "/my",
  authMiddleware,
  authorizeMiddleware("recruiter"),
  getMyJobsController
);


// Recruiter dashboard
router.get(
  "/dashboard",
  authMiddleware,
  authorizeMiddleware("recruiter"),
  getRecruiterDashboardController
);


// Get applicants for a job
router.get(
  "/:id/applicants",
  authMiddleware,
  authorizeMiddleware("recruiter"),
  getApplicantsController
);


// Update job
router.put(
  "/:id",
  authMiddleware,
  authorizeMiddleware("recruiter"),
  updateJobController
);


// Delete job
router.delete(
  "/:id",
  authMiddleware,
  authorizeMiddleware("recruiter"),
  deleteJobController
);


// Get single job
router.get(
  "/:id",
  getJobByIdController
);


export default router;