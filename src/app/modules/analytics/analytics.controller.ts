import { StatusCodes } from "http-status-codes";
import catchAsync from "../../../shared/catchAsync";
import sendResponse from "../../../shared/sendResponse";
import { analyticsService } from "./analytics.service";
import { Request, Response } from "express";

const getUrlAnalyticsBasedOnUrlId = catchAsync(
  async (req: Request, res: Response) => {
    const { id } = req.params;
    const result = await analyticsService.getUrlAnalyticsBasedOnUrlId(id);
    sendResponse(res, {
      success: true,
      statusCode: StatusCodes.OK,
      message: "Url analytics fetched successfully",
      data: result,
    });
  },
);

export const analyticsController = {
  getUrlAnalyticsBasedOnUrlId,
};
