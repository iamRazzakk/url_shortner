import { Types } from "mongoose";
export interface IClickRecord {
  urlId: Types.ObjectId;
  userId: string;
  clickTime: Date;
}
