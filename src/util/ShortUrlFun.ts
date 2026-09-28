import crypto from "crypto";
import config from "../config";


const generateShortUrl = async (originalUrl: string): Promise<string> => {
    const hash = crypto.createHash("sha256").update(originalUrl).digest();
    let value = BigInt(`0x${hash.toString("hex")}`);
    let shortUrl = "";

    while (shortUrl.length < Number(config?.shortUrlLength)) {
        shortUrl += config.base62[Number(value % BigInt(62))];
        value /= BigInt(62);
    }

    return shortUrl;
}

export default generateShortUrl;