import { z } from "zod";

export const applyJobSchema = z.object({
    jobId: z.string().min(1, "Job ID is required"),
});


export const updateApplicationStatusSchema = z.object({

    status: z.enum([
        "pending",
        "accepted",
        "rejected",
    ])

});