import { StatusCodes } from "http-status-codes";
import catchAsync from "../../../shared/catchAsync";
import sendResponse from "../../../shared/sendResponse";
import { urlService } from "./url.service";
import { Request, Response } from "express";

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
    const url = await urlService.getUrlShortToOriginalUrl(sUrl);
    sendResponse(res, {
      success: true,
      statusCode: StatusCodes.OK,
      message: "URL fetched successfully",
      data: url,
    });
  },
);

export const urlController = {
  createUrlShort,
  getUrlShortToOriginalUrl,
};
