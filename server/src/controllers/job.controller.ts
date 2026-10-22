import { Request, Response, NextFunction } from "express";
import asyncHandler from "../utils/asyncHandler";
import { createJob, getAllJobs, getJobById} from "../services/job.service";
import { createJobSchema } from "../validations/job.validation";

export const createJobController = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const data = createJobSchema.parse(req.body);
    const recruiterId = req.user?.id as string;
    const job = await createJob(data, recruiterId);

    res.status(201).json({
        success: true,
        message : "Job Created Successffully",
        job,
    });
});

export const getAllJobsController = asyncHandler(
    async (req: Request, res: Response) => {

        const result = await getAllJobs(req.query);

        res.status(200).json({
            success: true,
            message : "Jobs fetched successfully",
            ...result,
        });

    }
);

export const getJobByIdController = asyncHandler(
    async (req: Request, res: Response) => {

        const job = await getJobById(req.params.id as string);

        res.status(200).json({
            success: true,
            message : "Job fetched successfully",
            job,
        });

    }
);

import { updateJob } from "../services/job.service";

export const updateJobController = asyncHandler(async (req, res) => {
    const updatedJob = await updateJob(req.params.id as string, req.body, req.user?.id as string);

    res.status(200).json({
        success: true,
        message: "Job updated successfully",
        job: updatedJob,
    });
});


import { deleteJob } from "../services/job.service";

export const deleteJobController = asyncHandler(
    async (req, res) => {

        await deleteJob(req.params.id as string, req.user!.id);

        res.status(200).json({
            success: true,
            message: "Job deleted successfully",
        });

    }
);


import { getMyJobs } from "../services/job.service";

export const getMyJobsController = asyncHandler(
    async (req, res) => {
        const jobs = await getMyJobs(req.user!.id);
        res.status(200).json({
            success: true,
            message : "Jobs fetched successfully",
            jobs,
        });
    }
);


import { getRecruiterDashboard } from "../services/job.service";

export const getRecruiterDashboardController = asyncHandler(
    async (req, res) => {
        const dashBoard = await getRecruiterDashboard(req.user!.id);

        res.status(200).json({
            success : true, 
            message : "Dashboard fetched successfully",
            dashBoard,
        });
    }
);