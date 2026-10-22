import { Request, Response } from "express";
import { registerUser } from "../services/auth.service";
import { registerSchema } from "../validations/auth.validation";
import { ZodError } from "zod";
import { loginSchema } from "../validations/auth.validation";
import { loginUser } from "../services/auth.service";
import asyncHandler from "../utils/asyncHandler";

// export const register = async (req: Request, res: Response) => {

//     try {

//         const data = registerSchema.parse(req.body);
//         const user = await registerUser(data.name, data.email, data.password, data.role);

//         res.status(201).json({
//             success: true,
//             user,
//         });

//     } catch (error) {

//         if (error instanceof ZodError) {
//         return res.status(400).json({
//             success: false,
//             errors: error.issues.map(issue => ({
//                 field: issue.path.join("."),
//                 message: issue.message,
//             })),
//         });
//     }


//         res.status(400).json({
//             success: false,
//             message: error instanceof Error ? error.message : "Something went wrong",
//         });

//     }

// };



export const register = asyncHandler(async (req, res) => {
    const data = registerSchema.parse(req.body);
    const user = await registerUser(data.name, data.email, data.password, data.role);
    res.status(201).json({
        success: true,
        message : "Registered Successffully",
        user,
    });
})


export const login = asyncHandler(async (req, res) => {
    const data = loginSchema.parse(req.body);
    const result = await loginUser(data.email, data.password);

    res.status(200).json({
        success: true,
        message : "Logined Successffully",
        ...result,
    });
});


