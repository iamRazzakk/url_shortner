import { Request } from "express";
import crypto from "crypto";

const visitorIdFromRequest = (req: Request) => {
  const ip = req.ip;

  const userAgent = req.get("user-agent") || "unknown";

  return crypto.createHash("sha256").update(`${ip}-${userAgent}`).digest("hex");
};

export default visitorIdFromRequest;
