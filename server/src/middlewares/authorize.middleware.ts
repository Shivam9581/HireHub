import { NextFunction, Request, Response } from "express";

const authorizeMiddleware = (...roles: Array<"student" | "recruiter">) => {
    return (req: Request, res: Response, next: NextFunction) => {
        if (!req.user) {
            return res.status(401).json({
                success: false,
                message: "Unauthorized",
            });
        }

        if (!roles.includes(req.user.role)) {
            return res.status(403).json({
                success: false,
                message: "Forbidden",
            });
        }

        next();
    };
};


export default authorizeMiddleware;
