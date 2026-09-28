import { model, Schema } from "mongoose";
import { IClickRecord } from "./clickRecord.interface";

const clickRecordSchema = new Schema<IClickRecord>(
  {
    urlId: { type: Schema.Types.ObjectId, ref: "Url", required: true },
    userId: { type: String, required: true }, //hash of IP + user agent, used for unique visitors
    clickTime: { type: Date, default: Date.now },
    country: { type: String, required: true },
    browser: { type: String, required: true },
    trafficSource: { type: String, required: true },
  },
  { timestamps: true },
);

clickRecordSchema.index({ urlId: 1, userId: 1 });

export const clickRecordModel = model<IClickRecord>(
  "ClickRecord",
  clickRecordSchema,
);
