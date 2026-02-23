import { Request, Response, NextFunction } from "express";
import { ApiError } from "../utils/ApiError";
import fs from "fs";

const errorHandler = (
    err: any,
    req: Request,
    res: Response,
    next: NextFunction
) => {
    // Cleanup local files if an error occurred during request processing
    if (req.file) {
        fs.unlink(req.file.path, (err) => {
            if (err) console.error("Error deleting local file in error handler:", err);
        });
    }
    if (req.files) {
        const files = Array.isArray(req.files)
            ? req.files
            : Object.values(req.files).flat();

        files.forEach((file: any) => {
            fs.unlink(file.path, (err) => {
                if (err) console.error("Error deleting local file in error handler:", err);
            });
        });
    }

    let error = err;

    if (!(error instanceof ApiError)) {
        const statusCode = error.statusCode || 500;
        const message = error.message || "Something went wrong";
        error = new ApiError(statusCode, message, error?.errors || [], err.stack);
    }

    const response = {
        ...error,
        message: error.message,
        ...(process.env.NODE_ENV === "development" ? { stack: error.stack } : {}),
    };

    return res.status(error.statusCode).json(response);
};

export { errorHandler };
