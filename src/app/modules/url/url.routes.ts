import { Router } from "express";
import { urlController } from "./url.controller";
import auth from "../../middlewares/auth";
import { USER_ROLES } from "../../../enums/user";
import validateRequest from "../../middlewares/validateRequest";
import { urlValidation } from "./url.validation";

const router = Router();
router
  .route("/")
  .post(
    auth(USER_ROLES.USER),
    validateRequest(urlValidation.createUrlSchema),
    urlController.createUrlShort,
  )
  .get(auth(USER_ROLES.USER), urlController.getMyAllMyUrlShort);

router.route("/:sUrl").get(urlController.getUrlShortToOriginalUrl);
router.route("/:id").patch(auth(USER_ROLES.USER), urlController.updateUrlShort);

export const urlRoutes = router;
