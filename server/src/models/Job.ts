import mongoose, {Schema, Document} from "mongoose";
import { title } from "node:process";

export interface IJob extends Document {
    title: string;
    company: string;
    location: string;
    description: string;
    salary: number;
    jobType: "Full-time" | "Part-time" | "Internship";
    experience: string;
    skills: string[];
    createdBy: mongoose.Types.ObjectId;
}

const jobSchema = new Schema<IJob>(
    {
    title :{
        type: String,
        required: true,
        trim: true,
    },
    company: {
            type: String,
            required: true,
            trim: true,
        },

        location: {
            type: String,
            required: true,
            trim: true,
        },

        description: {
            type: String,
            required: true,
        },

        salary: {
            type: Number,
            required: true,
        },

        jobType: {
            type: String,
            enum: ["Full-time", "Part-time", "Internship"],
            required: true,
        },

        experience: {
            type: String,
            required: true,
        },

        skills: {
            type: [String],
            default: [],
        },

        createdBy: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
    },
    {
        timestamps: true,  
    }
    
);

export default mongoose.model<IJob>("Job", jobSchema);