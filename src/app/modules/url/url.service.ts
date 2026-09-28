import { JwtPayload } from "jsonwebtoken";
import generateShortUrl from "../../../util/ShortUrlFun";
import { IUrl } from "./url.interface";
import { urlModel } from "./url.model";
import config from "../../../config";

const createUrlShortIntoDB = async (payload: IUrl, user: JwtPayload) => {
    // exist or not
    const isExist = await urlModel.findOne({ originalUrl: payload.originalUrl }).lean();

    if (isExist) {
        return isExist;
    }
    while (true) {

        // generate short url
        const shortUrl = await generateShortUrl(payload.originalUrl);
        payload.shortUrl = `${config.domain}/${shortUrl}`;
        payload.userId = user.id;
        const data = await urlModel.create(payload);
        return data;
    }




}

export const urlService = {
    createUrlShortIntoDB,
}