import { JwtPayload } from "jsonwebtoken";
import generateShortUrl from "../../../util/ShortUrlFun";
import { IUrl } from "./url.interface";
import { urlModel } from "./url.model";
import config from "../../../config";
import { StatusCodes } from "http-status-codes";
import ApiError from "../../../errors/ApiErrors";
import { clickQueue } from "../../../config/bullMQ.config";
import { redisService } from "../../redis/redis.service";
import { Types } from "mongoose";
import { clickRecordService } from "../clickRecord/clickRecord.service";

const createUrlShortIntoDB = async (payload: IUrl, user: JwtPayload) => {
  // exist or not
  const isExist = await urlModel
    .findOne({ originalUrl: payload.originalUrl })
    .lean();
  if (isExist) {
    return isExist;
  }
  while (true) {
    const shortUrl = await generateShortUrl(payload.originalUrl);
    payload.shortUrl = `${config.domain}/${shortUrl}`;
    payload.userId = user.id;
    const data = await urlModel.create(payload);
    return data;
  }
};

const getUrlShortToOriginalUrlIntoDB = async (
  sUrl: string,
  visitorId: string,
  meta: {
    browser: string;
    trafficSource: string;
    country: string;
  },
) => {
  const cached = await redisService.get(`url:${config.domain}/${sUrl}`);

  let originalUrl: string;
  let dbClicks: number | undefined;
  let expiresAt: Date | string | null | undefined;
  let useCache = false;
  let _id: Types.ObjectId;

  if (cached) {
    const parsed = JSON.parse(cached);

    if (!("expiresAt" in parsed) || !parsed._id) {
      await redisService.del(`url:${config.domain}/${sUrl}`);
    } else {
      expiresAt = parsed.expiresAt;
      if (expiresAt && new Date(expiresAt).getTime() < Date.now()) {
        await redisService.del(`url:${config.domain}/${sUrl}`);
        throw new ApiError(StatusCodes.NOT_FOUND, "URL expired");
      }
      originalUrl = parsed.originalUrl;
      _id = parsed._id;
      dbClicks = parsed.totalClicks;
      useCache = true;
      console.log("From Cache");
    }
  }

  if (!useCache) {
    const data = await urlModel
      .findOne({ shortUrl: `${config.domain}/${sUrl}` })
      .lean();
    if (!data) {
      throw new ApiError(StatusCodes.NOT_FOUND, "URL not found");
    }
    expiresAt = data.expiresAt;
    if (expiresAt && new Date(expiresAt).getTime() < Date.now()) {
      await redisService.del(`url:${config.domain}/${sUrl}`);
      throw new ApiError(StatusCodes.NOT_FOUND, "URL expired");
    }
    originalUrl = data.originalUrl;
    dbClicks = data.totalClicks;
    _id = data._id;
    console.log("From DB");
  }

  const existingCount = await redisService.hget(`count-click`, sUrl);
  if (existingCount === null) {
    let baseCount = Number(dbClicks) || 0;
    await redisService.hsetnx(`count-click`, sUrl, String(baseCount));
  }

  const totalClicks = await redisService.hincrby(`count-click`, sUrl, 1);
  if (totalClicks >= 50) {
    await redisService.post({
      key: `url:${config.domain}/${sUrl}`,
      value: JSON.stringify({
        _id: new Types.ObjectId(_id!),
        originalUrl: originalUrl!,
        totalClicks: Number(totalClicks),
        expiresAt: expiresAt ?? null,
      }),
      expiration: 10 * 60,
    });
  }
  await clickQueue.add("count-click", sUrl, { delay: 5000 });
  await clickRecordService.createClickRecord({
    urlId: _id!,
    userId: visitorId,
    clickTime: new Date(),
    country: meta.country,
    browser: meta.browser,
    trafficSource: meta.trafficSource,
  });
  return originalUrl!;
};

const getMyAllMyUrlShortIntoDB = async (user: JwtPayload) => {
  const data = await urlModel.find({ userId: user.id }).lean();
  if (!data) {
    throw new ApiError(StatusCodes.NOT_FOUND, "URLs not found");
  }
  return data;
};

const updateUrlShortIntoDB = async (id: string, payload: Partial<IUrl>) => {
  const data = await urlModel
    .findByIdAndUpdate(id, payload, { new: true })
    .lean();
  if (!data) {
    throw new ApiError(StatusCodes.NOT_FOUND, "URL not found");
  }
  return data;
};

export const urlService = {
  createUrlShortIntoDB,
  getUrlShortToOriginalUrlIntoDB,
  updateUrlShortIntoDB,
  getMyAllMyUrlShortIntoDB,
};
