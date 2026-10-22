import Application from "../models/Application";
import Job from "../models/Job";
import User from "../models/User";

export const applyJob = async (
    jobId: string,
    studentId: string
) => {

    const job = await Job.findById(jobId);

    if (!job) {
        throw new Error("Job not found");
    }

    const student = await User.findById(studentId).select("resume");
    if(!student){
        throw new Error("User not Found");
    }
    if(!student.resume?.url){
        throw new Error("Please upload your resume before applying for a job");
    }

    const alreadyApplied = await Application.findOne({student: studentId,job: jobId,});

    if (alreadyApplied) {
        throw new Error("You have already applied for this job");
    }

    const application = await Application.create({

        student: studentId,

        job: jobId,

    });

    return application;

};



export const getMyApplications = async (
    studentId: string
) => {
    const applications = await Application.find({student: studentId,})
    .populate(
        "job",
        "title company location salary jobType"
    );

    return applications;

};


export const getApplicants = async (jobId: string, recruiterId: string) => {
    const job = await Job.findById(jobId);
    if (!job) {
        throw new Error("Job not found");
    }

    if (job.createdBy.toString() !== recruiterId) {

        throw new Error("Unauthorized");

    }

    const applicants = await Application.find({
        job: jobId,
    })
    .populate(
        "student",
        "name email resume"
    );

    return applicants;

};



export const updateApplicationStatus = async (
    applicationId: string,
    recruiterId: string,
    status: "pending" | "accepted" | "rejected"
    ) => {
    const application = await Application.findById(applicationId);

    if (!application) {
        throw new Error("Application not found");
    }

    const job = await Job.findById(application.job);

    if (!job) {
        throw new Error("Job not found");
    }

    if (job.createdBy.toString() !== recruiterId) {
        throw new Error("Unauthorized");
    }

    application.status = status;
    await application.save();

    return application;

};