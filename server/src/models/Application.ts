import mongoose, { Schema, Document } from "mongoose";

export interface IApplication extends Document {
    student: mongoose.Types.ObjectId;
    job: mongoose.Types.ObjectId;
    status: "pending" | "accepted" | "rejected";
    createdAt: Date;
    updatedAt: Date;
}

const applicationSchema = new Schema<IApplication>(
    {
        student: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        job: {
            type: Schema.Types.ObjectId,
            ref: "Job",
            required: true,
        },
        status: {
            type: String,
            enum: ["pending", "accepted", "rejected",],
            default: "pending",
        },
    },
    {
        timestamps: true,
    }
);

export default mongoose.model<IApplication>(
    "Application",
    applicationSchema
);