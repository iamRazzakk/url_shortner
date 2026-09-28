import QueryBuilder from "../../builder/queryBuilder";
import { IClickRecord } from "./clickRecord.interface";
import { clickRecordModel } from "./clickRecord.model";

const createClickRecord = async (payload: IClickRecord) => {
  const res = await clickRecordModel.findOneAndUpdate(
    { urlId: payload.urlId, userId: payload.userId },
    { $set: { clickTime: new Date(), country: payload.country, browser: payload.browser, trafficSource: payload.trafficSource } },
    { upsert: true, new: true, setDefaultsOnInsert: true },
  );
  return res;
};

const getClickRecordByUrlId = async (
  id: string,
  query: Record<string, any>,
) => {
  const qb = new QueryBuilder(clickRecordModel.find({ urlId: id }), query);
  const [data, meta] = await Promise.all([
    qb.modelQuery.exec(),
    qb.getPaginationInfo(),
  ]);

  return {
    data,
    meta,
  };
};

export const clickRecordService = {
  createClickRecord,
  getClickRecordByUrlId,
};
