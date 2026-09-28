import { JwtPayload } from "jsonwebtoken";
import generateShortUrl from "../../../util/ShortUrlFun";
import { IUrl } from "./url.interface";
import { urlModel } from "./url.model";
import config from "../../../config";
import { StatusCodes } from "http-status-codes";
import ApiError from "../../../errors/ApiErrors";
import { clickQueue } from "../../../config/bullMQ.config";
import { redisService } from "../../redis/redis.service";

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

const getUrlShortToOriginalUrl = async (sUrl: string) => {
  const cached = await redisService.get(`url:${config.domain}/${sUrl}`);

  let data;
  let fromCache = false;

  if (cached) {
    data = JSON.parse(cached);
    fromCache = true;
    console.log("From Cache");
  } else {
    data = await urlModel
      .findOne({ shortUrl: `${config.domain}/${sUrl}` })
      .lean();
    if (!data) {
      throw new ApiError(StatusCodes.NOT_FOUND, "URL not found");
    }
    console.log("From DB");
  }
  const existingCount = await redisService.hget(`count-click`, sUrl);
  if (existingCount === null) {
    let baseCount = Number(data.totalClicks) || 0;
    if (fromCache) {
      const row = await urlModel
        .findOne({ shortUrl: `${config.domain}/${sUrl}` })
        .select("totalClicks")
        .lean();
      baseCount = Number(row?.totalClicks) || 0;
    }
    await redisService.hsetnx(`count-click`, sUrl, String(baseCount));
  }

  data.totalClicks = await redisService.hincrby(`count-click`, sUrl, 1);
  if (!fromCache && data.totalClicks >= 50) {
    await redisService.post({
      key: `url:${config.domain}/${sUrl}`,
      value: JSON.stringify(data),
      expiration: 10 * 60,
    });
  }
  await clickQueue.add("count-click", sUrl, { delay: 5000 });
  return data;
};

export const urlService = {
  createUrlShortIntoDB,
  getUrlShortToOriginalUrl,
};
