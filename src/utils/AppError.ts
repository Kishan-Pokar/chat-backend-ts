export class AppError extends Error {
    statusCode: number;
    isOperational: boolean;

    constructor(message: string, statusCode: number) {
        super(message);
        this.statusCode = statusCode;
        this.isOperational = true; // distinguishes "expected" errors (bad input, not found) from bugs
        Error.captureStackTrace(this, this.constructor);
    }
}