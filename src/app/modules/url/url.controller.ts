import { StatusCodes } from "http-status-codes";
import catchAsync from "../../../shared/catchAsync";
import sendResponse from "../../../shared/sendResponse";
import { urlService } from "./url.service";
import { request, Request, Response } from "express";
import { clickRecordService } from "../clickRecord/clickRecord.service";
import visitorIdFromRequest from "../../../util/visitorId";

const createUrlShort = catchAsync(async (req: Request, res: Response) => {
  const url = await urlService.createUrlShortIntoDB(req.body, req.user);
  sendResponse(res, {
    success: true,
    statusCode: StatusCodes.CREATED,
    message: "URL created successfully",
    data: url,
  });
});

const getUrlShortToOriginalUrl = catchAsync(
  async (req: Request, res: Response) => {
    const { sUrl } = req.params;
    const url = await urlService.getUrlShortToOriginalUrlIntoDB(
      sUrl,
      visitorIdFromRequest(req),
    );
    return res.redirect(url);
  },
);

const getMyAllMyUrlShort = catchAsync(async (req: Request, res: Response) => {
  const urls = await urlService.getMyAllMyUrlShortIntoDB(req.user);
  sendResponse(res, {
    success: true,
    statusCode: StatusCodes.OK,
    message: "URLs fetched successfully",
    data: urls,
  });
});

const updateUrlShort = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const payload = req.body;
  const url = await urlService.updateUrlShortIntoDB(id, payload);
  sendResponse(res, {
    success: true,
    statusCode: StatusCodes.OK,
    message: "URL updated successfully",
    data: url,
  });
});

export const urlController = {
  createUrlShort,
  getUrlShortToOriginalUrl,
  getMyAllMyUrlShort,
  updateUrlShort,
};
