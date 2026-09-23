import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { config } from "../config/index";
import { AppError } from "../utils/AppError";
import { isJwtPayloadWithUserId } from "../utils/jwt.utils";

declare global {
    namespace Express {
        interface Request {
            userId?: string;
        }
    }
}

export function authenticate(req: Request, res: Response, next: NextFunction) {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        throw new AppError("Authentication required", 401);
    }

    const token = authHeader.split(" ")[1];
    if (!token) {
        throw new AppError("Malformed authorization header", 401);
    }

    try {
        const decoded = jwt.verify(token, config.jwtSecret);

        if (!isJwtPayloadWithUserId(decoded)) {
            throw new AppError("Invalid token payload", 401);
        }

        req.userId = decoded.userId;
        next();
    } catch (err) {
        if (err instanceof AppError) throw err;
        throw new AppError("Invalid or expired token", 401);
    }
}