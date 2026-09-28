import { Types } from "mongoose";

export interface IUrl {
    originalUrl: string;
    shortUrl: string;
    userId: Types.ObjectId;
    totalClicks: number;
    expiresAt?: Date;
}