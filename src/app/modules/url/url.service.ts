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

  let originalUrl: string;
  let dbClicks: number | undefined;

  if (cached) {
    originalUrl = JSON.parse(cached)?.originalUrl;
    dbClicks = JSON.parse(cached)?.totalClicks;
    console.log("dbClicks", Number(dbClicks) || 0);
    console.log("From Cache");
  } else {
    const data = await urlModel
      .findOne({ shortUrl: `${config.domain}/${sUrl}` })
      .lean();
    if (!data) {
      throw new ApiError(StatusCodes.NOT_FOUND, "URL not found");
    }
    originalUrl = data?.originalUrl;
    dbClicks = data?.totalClicks;
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
      value: JSON.stringify({ originalUrl, totalClicks }),
      expiration: 10 * 60,
    });
  }
  await clickQueue.add("count-click", sUrl, { delay: 5000 });
  return originalUrl;
};

export const urlService = {
  createUrlShortIntoDB,
  getUrlShortToOriginalUrl,
};
