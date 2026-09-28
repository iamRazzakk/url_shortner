import { clickRecordModel } from "../clickRecord/clickRecord.model";
import { Types } from "mongoose";
import { urlModel } from "../url/url.model";

const getUrlAnalyticsBasedOnUrlId = async (id: string) => {
  // totalClicks base kre just oita default 1 ta return krbe.
  const heightClickRecord = await urlModel
    .findOne()
    .sort({ totalClicks: -1 })
    .select("_id")
    .lean();

  const [
    totalClicks,
    clicksToday,
    clicksLast7Days,
    clicksLast30Days,
    clicksLastYear,
  ] = await Promise.all([
    clickRecordModel.countDocuments({ urlId: new Types.ObjectId(id) }),
    clickRecordModel.countDocuments({
      urlId: id || heightClickRecord?._id,
      createdAt: {
        $gte: new Date(new Date().setDate(new Date().getDate() - 1)),
      },
    }),
    clickRecordModel.countDocuments({
      urlId: id || heightClickRecord?._id,
      createdAt: {
        $gte: new Date(new Date().setDate(new Date().getDate() - 7)),
      },
    }),
    clickRecordModel.countDocuments({
      urlId: id || heightClickRecord?._id,
      createdAt: {
        $gte: new Date(new Date().setDate(new Date().getDate() - 30)),
      },
    }),
    clickRecordModel.countDocuments({
      urlId: id || heightClickRecord?._id,
      createdAt: {
        $gte: new Date(new Date().setDate(new Date().getDate() - 365)),
      },
    }),
  ]);
  return {
    totalClicks,
    clicksToday,
    clicksLast7Days,
    clicksLast30Days,
    clicksLastYear,
  };
};

export const analyticsService = {
  getUrlAnalyticsBasedOnUrlId,
};
