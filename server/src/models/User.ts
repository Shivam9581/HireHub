import mongoose, { Schema, Document } from "mongoose";

export interface IUser extends Document {
    name: string;
    email: string;
    password: string;
    role: "student" | "recruiter";
    resume: {
        url: string,
        publicId: string,
    }
}


const userSchema = new Schema<IUser>(
    {
        name: {
            type: String,
            required: true,
            trim: true,
        },

        email: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
            trim: true,

        },

        password: {
            type: String,
            required: true,
            default: "",
        },

        role: {
            type: String,
            enum: ["student", "recruiter"],
            default: "student",
        },

        resume: {
            url: {
                type: String,
            },
            publicId: {
                type: String,
            },
        },
    },
    {
        timestamps: true,
    }
);

export default mongoose.model<IUser>("User", userSchema);