import asyncHandler from "../utils/asyncHandler";
import {
    getProfile,
    UpdateProfile,
    uploadResume,
    deleteResume,
} from "../services/user.service";
import { updateProfileSchema } from "../validations/user.validation";

export const getProfileController = asyncHandler(async (req, res) => {
    const user = await getProfile(req.user!.id);

    res.status(200).json({
        success: true,
        message: "Profile fetched successfully",
        user,
    });
});

export const updateProfileController = asyncHandler(async (req, res) => {
    const data = updateProfileSchema.parse(req.body);

    const user = await UpdateProfile(req.user!.id, data);

    res.status(200).json({
        success: true,
        message: "Profile updated successfully",
        user,
    });
});

export const uploadResumeController = asyncHandler(async (req, res) => {
    if (!req.file) {
        res.status(400).json({
            success: false,
            message: "Please upload a PDF resume",
        });
        return;
    }

    const resume = await uploadResume(req.user!.id, req.file.buffer);

    res.status(200).json({
        success: true,
        message: "Resume uploaded successfully",
        resume,
    });
});

export const deleteResumeController = asyncHandler(async (req, res) => {
    await deleteResume(req.user!.id);

    res.status(200).json({
        success: true,
        message: "Resume deleted successfully",
    });
});