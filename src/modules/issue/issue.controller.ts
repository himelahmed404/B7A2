import type { Request, NextFunction, Response } from "express";
import { IssueService } from "./issue.service";
import sendResponse from "../../utility/sendResponse";

const createIssue = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const issueData = {
      ...req.body,
      reporter_id: req.user?.id,
    };
    const result = await IssueService.CreateIssueIntoDB(issueData);

    sendResponse(res, {
      status: 201,
      success: true,
      message: "Issue created successfully",
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

export const IssueController = {
  createIssue,
};
