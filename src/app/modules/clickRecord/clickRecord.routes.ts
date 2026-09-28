import { Router } from "express";
import { clickRecordController } from "./clickRecord.controller";
import { USER_ROLES } from "../../../enums/user";
import auth from "../../middlewares/auth";

const router = Router();

router
  .route("/:id")
  .get(
    // auth(USER_ROLES.SUPER_ADMIN),
    clickRecordController.getClickRecordByUrlId,
  );


  export const clickRecordRoutes = router;
