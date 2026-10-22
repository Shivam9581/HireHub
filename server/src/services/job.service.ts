import Job from "../models/Job";
import Application from "../models/Application";
import mongoose from "mongoose";

export const createJob = async (data: any,recruiterId: string) => {
    const job = await Job.create({...data,createdBy: recruiterId,});
    return job;
};

export const getAllJobs = async (query: any) => {
    const filter: any = {};

    if (query.keyword) {
        filter.title = {
            $regex: query.keyword, // Search for jobs with titles that match the keyword
            $options: "i", // Case-insensitive search
        };
    }
    if (query.location) {
        filter.location = {
        $regex: query.location,
        $options: "i",
        };
    }
    if (query.jobType) {
        filter.jobType = query.jobType;
    }
    
    const page = Number(query.page) || 1;
    const limit = Number(query.limit) || 10;
    const skip = (page - 1) * limit;

    const totalJobs = await Job.countDocuments(filter);

    const jobs = await Job.find(filter)
        .populate("createdBy", "name email")
        .sort({ createdAt: -1 }) // Sort jobs by creation date in descending order
        .skip(skip)
        .limit(limit);

    return {jobs, currentPage: page, totalPages: Math.ceil(totalJobs / limit), totalJobs};
};


export const getJobById = async (id: string) => {

    if (!mongoose.Types.ObjectId.isValid(id)) {
        throw new Error("Invalid Job ID");
    }

    const job = await Job.findById(id)
        .populate("createdBy", "name email");

    if (!job) {
        throw new Error("Job not found");
    }

    return job;
};


export const updateJob = async (id: string, data: any, recruiterId: string) => {
    const job = await Job.findById(id);

    if (!job) {
        throw new Error("Job not found");
    }

    if(job.createdBy.toString() !== recruiterId) {
        throw new Error("You are not authorized to update this job");
    }

    Object.assign(job, data); // Update the job with the new data
    await job.save(); // Save the updated job

    return job;
}

export const deleteJob = async (
    jobId: string,
    recruiterId: string
) => {
    const job = await Job.findById(jobId);

    if (!job) {
    throw new Error("Job not found");
    }

    if(job.createdBy.toString() !== recruiterId) {
        throw new Error("You are not authorized to delete this job");
    }

    await job.deleteOne(); // Delete the job
};


export const getMyJobs = async (recruiterId: string) => {
    const jobs = await Job.find({ createdBy: recruiterId })
        .populate("createdBy", "name email")
        .sort({ createdAt: -1 }); // Sort jobs by creation date in descending order

    return jobs;
};

export const getRecruiterDashboard = async (
    recruiterId: string
) => {

    const totalJobs = await Job.countDocuments({
        recruiter: recruiterId,
    });

    const jobs = await Job.find({
        recruiter: recruiterId,
    }).select("_id");

    const jobIds = jobs.map(job => job._id);

    const totalApplications = await Application.countDocuments({
        job: { $in: jobIds },
    });

    const pending = await Application.countDocuments({
        job: { $in: jobIds },
        status: "pending",
    });

    const accepted = await Application.countDocuments({
        job: { $in: jobIds },
        status: "accepted",
    });

    const rejected = await Application.countDocuments({
        job: { $in: jobIds },
        status: "rejected",
    });

    return {
        totalJobs,
        totalApplications,
        pending,
        accepted,
        rejected,
    };
};