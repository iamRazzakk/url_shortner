import { model, Schema } from "mongoose";
import { IUrl } from "./url.interface";

const urlSchema = new Schema<IUrl>({
    originalUrl: {
        type: String,
        required: true,
    },
    shortUrl: {
        type: String,
        required: true,
    },
    userId: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },

    totalClicks: {
        type: Number,
        default: 0,
    },
    expiresAt: {
        type: Date,
        default: null,
    },
}, {
    timestamps: true,
    versionKey: false,
});


urlSchema.index({ shortUrl: 1 }, { unique: true });
urlSchema.index({ originalUrl: 1 }, { unique: true });  

export const urlModel = model<IUrl>("Url", urlSchema);