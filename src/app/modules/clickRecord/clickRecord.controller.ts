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



export const clickRecordController = {
  createClickRecord,
};