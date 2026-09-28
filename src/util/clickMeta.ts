import { Request } from "express";

const browserFromUserAgent = (userAgent: string) => {
  const ua = userAgent.toLowerCase();
  if (ua.includes("edg/")) return "edge";
  if (ua.includes("chrome/")) return "chrome";
  if (ua.includes("firefox/")) return "firefox";
  if (ua.includes("safari/")) return "safari";
  return "other";
};

const trafficSourceFromReferer = (referer: string, ownDomain: string) => {
  if (!referer) return "direct";

  let host = "";
  try {
    host = new URL(referer).hostname.toLowerCase();
  } catch {
    return "other";
  }
  if (host === ownDomain || host.endsWith(`.${ownDomain}`)) return "direct";
  if (
    host.includes("facebook.") ||
    host === "fb.com" ||
    host.endsWith(".fb.com")
  )
    return "facebook";
  if (
    host === "t.co" ||
    host.includes("twitter.") ||
    host === "x.com" ||
    host.endsWith(".x.com")
  )
    return "twitter";
  if (host.includes("google.")) return "google";
  if (host.includes("linkedin.") || host === "lnkd.in") return "linkedin";
  if (host.includes("whatsapp.") || host === "wa.me") return "whatsapp";
  return "other";
};

const clickMetaFromRequest = (req: Request, ownDomain: string) => {
  const browser = browserFromUserAgent(req.get("user-agent") || "");
  const trafficSource = trafficSourceFromReferer(
    req.get("referer") || "",
    ownDomain,
  );
  const country = req.get("cf-ipcountry") || "unknown";
  return {
    browser,
    trafficSource,
    country,
  };
};

export const clickMeta = {
  browserFromUserAgent,
  trafficSourceFromReferer,
  clickMetaFromRequest,
};
