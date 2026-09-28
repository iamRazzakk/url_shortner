import { z } from "zod";

const urlValidationSchema = z.object({
    originalUrl: z.string({ required_error: "Original URL is required" }).optional().nullable(),
    shortUrl: z.string({ required_error: "Short URL is required" }).min(1).optional(),
    userId: z.string({ required_error: "User ID is required" }).min(1).optional(),
    totalClicks: z.number().default(0),
    expiresAt: z.date().nullable().optional(),
});



const createUrlSchema = urlValidationSchema.omit({ totalClicks: true, expiresAt: true, userId: true });
const updateUrlSchema = urlValidationSchema.partial();

export const urlValidation = {
    createUrlSchema,
    updateUrlSchema,
};