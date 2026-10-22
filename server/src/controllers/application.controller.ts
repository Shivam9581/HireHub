import asyncHandler from "../utils/asyncHandler";
import { applyJobSchema } from "../validations/application.validation";
import { applyJob } from "../services/application.service";

export const applyJobController = asyncHandler(
    async (req, res) => {
        const data = applyJobSchema.parse(req.body);
        const application = await applyJob(
            data.jobId,
            req.user!.id
        );

        res.status(201).json({
            success: true,
            message: "Job applied successfully",
            application,
        });

    }

);

import { getMyApplications } from "../services/application.service";

export const getMyApplicationsController = asyncHandler(
    async (req, res) => {

        const applications = await getMyApplications(
            req.user!.id
        );

        res.status(200).json({
            success: true,
            count: applications.length,
            message : "Applications fetched successfully",
            applications,
        });

    }
);

import { getApplicants } from "../services/application.service";

export const getApplicantsController = asyncHandler(

    async (req, res) => {

        const applicants = await getApplicants(
            req.params.id,
            req.user!.id
        );

        res.status(200).json({

            success: true,

            count: applicants.length,
            message : "Applicants fetched successfully",
            applicants,

        });

    }

);

import { updateApplicationStatus} from "../services/application.service";
import { updateApplicationStatusSchema } from "../validations/application.validation";

export const updateApplicationStatusController = asyncHandler(

    async (req, res) => {

        const data = updateApplicationStatusSchema.parse(req.body);

        const application = await updateApplicationStatus(

            req.params.id,

            req.user!.id,

            data.status

        );

        res.status(200).json({

            success: true,
            message :"Application Updated Successfully",
            application,

        });

    }

);