import { IClickRecord } from "./clickRecord.interface";
import { clickRecordModel } from "./clickRecord.model";



const createClickRecord = async (payload: IClickRecord) => {
  const res = await clickRecordModel.findOneAndUpdate(
    { urlId: payload.urlId, userId: payload.userId },
    { $set: { clickTime: new Date() } },
    { upsert: true, new: true, setDefaultsOnInsert: true },
  );
  return res;
};


export const clickRecordService = {
  createClickRecord,
};
