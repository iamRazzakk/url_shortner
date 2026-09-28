import { Router } from "express";
import { analyticsController } from "./analytics.controller";
import { USER_ROLES } from "../../../enums/user";
import auth from "../../middlewares/auth";

const router = Router();

router
  .route("/:id")
  .get(
    auth(USER_ROLES.SUPER_ADMIN),
    analyticsController.getUrlAnalyticsBasedOnUrlId,
  );


export const analyticsRoutes = router;