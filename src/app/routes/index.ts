import express from "express";
import { UserRoutes } from "../modules/user/user.routes";
import { AuthRoutes } from "../modules/auth/auth.routes";
import { urlRoutes } from "../modules/url/url.routes";
import { analyticsRoutes } from "../modules/analytics/analytics.routes";
import { clickRecordRoutes } from "../modules/clickRecord/clickRecord.routes";
const router = express.Router();

const apiRoutes = [
  { path: "/user", route: UserRoutes },
  { path: "/auth", route: AuthRoutes },
  { path: "/url", route: urlRoutes },
  { path: "/analytics", route: analyticsRoutes },
  { path: "/click-record", route: clickRecordRoutes },
];

apiRoutes.forEach((route) => router.use(route.path, route.route));
export default router;
