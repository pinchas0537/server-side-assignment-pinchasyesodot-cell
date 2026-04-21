import logger from "../utils/Logger";
import { Request, Response, NextFunction } from "express";
import { ZodError, z } from "zod";

export const validateRequest =
    (schema: z.ZodSchema) =>
    async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            schema.parse(req.body);
            return next();
        } catch (error) {
            if (error instanceof ZodError) {
                logger.error(`Validation failed: ${JSON.stringify(error.issues)}`);
                res.status(400).json({
                    error: "Validation failed",
                    details: error.issues.map((err) => ({
                        field: err.path.join("."),
                        message: err.message,
                    })),
                });
            } else {
                res.status(500).json({ error: "Internal server error" });
            }
        }
    };