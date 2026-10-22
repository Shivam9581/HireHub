import { NextFunction, Request, Response } from "express";
import { ZodError } from "zod";

const errorHandler = (
    error: any,
    req: Request,
    res: Response,
    next: NextFunction
) => {

    if (error instanceof ZodError) {
        return res.status(400).json({
            success: false,
            errors: error.issues.map(issue => ({
                field: issue.path.join("."),
                message: issue.message,
            })),
        });
    }

    return res.status(400).json({
        success: false,
        message: error.message || "Internal Server Error",
    });
};

export default errorHandler;