// import asyncHandler from "../utils/asyncHandler";
// import { uploadResume } from "../services/resume.service";


// export const uploadResumeController = asyncHandler(
//     async (req, res) => {
//         if (!req.file) {
//             throw new Error("Resume is required");
//         }

//         const user = await uploadResume(
//             req.user!.id,
//             req.file.buffer
//         );

//         res.status(200).json({
//             success: true,
//             message : "Resume uploaded successfully",
//             user,
//         });

//     }
// );