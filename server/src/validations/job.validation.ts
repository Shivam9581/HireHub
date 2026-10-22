import { z } from "zod";

export const createJobSchema = z.object({
    title: z.string().min(3),
    company: z.string().min(2),
    location: z.string().min(2),
    description: z.string().min(10),
    salary: z.number().positive(),
    jobType: z.enum([
        "Full-time",
        "Part-time",
        "Internship",
    ]),

    experience: z.string(),
    skills: z.array(z.string()),
});