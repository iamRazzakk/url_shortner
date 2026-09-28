import { Types } from "mongoose";
export interface IClickRecord {
  urlId: Types.ObjectId;
  userId: string;
  country: string;
  browser: string;
  trafficSource: string;
  clickTime: Date;
}
