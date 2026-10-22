import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import env from "../config/env";

const authMiddleware = (req: Request,res: Response,next: NextFunction) => {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
        return res.status(401).json({
            success: false,
            message: "Token missing",
        });
    }

    const token = authHeader.split(" ")[1];

    if (!token) {
        return res.status(401).json({
            success: false,
            message: "Invalid token format",
        });
    }

    try {
        const decoded = jwt.verify(token, env.JWT_SECRET);
        req.user = decoded as Express.Request["user"];
        console.log(decoded);
        console.log(req.user?.id);
        console.log(req.user?.role);
        next();

    } catch {

        return res.status(401).json({
            success: false,
            message: "Invalid token",
        });

    }

};

export default authMiddleware;