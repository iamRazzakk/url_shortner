import { StatusCodes } from "http-status-codes";
import catchAsync from "../../../shared/catchAsync";
import sendResponse from "../../../shared/sendResponse";
import { clickRecordService } from "./clickRecord.service";
import { Request, Response } from "express";

const createClickRecord = catchAsync(async (req: Request, res: Response) => {
  const result = await clickRecordService.createClickRecord(req.body);
  sendResponse(res, {
    success: true,
    statusCode: StatusCodes.CREATED,
    message: "Click record created successfully",
    data: result,
  });
});

const getClickRecordByUrlId = catchAsync(
  async (req: Request, res: Response) => {
    const { id } = req.params;
    const result = await clickRecordService.getClickRecordByUrlId(
      id,
      req.query,
    );
    sendResponse(res, {
      success: true,
      statusCode: StatusCodes.OK,
      message: "Click record fetched successfully",
      data: result,
    });
  },
);

export const clickRecordController = {
  createClickRecord,
  getClickRecordByUrlId,
};
