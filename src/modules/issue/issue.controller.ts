import type { Request, NextFunction, Response } from "express";
import { IssueService } from "./issue.service";
import sendResponse from "../../utility/sendResponse";
import type { Query } from "../../types";

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

const getAllIssues = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const result = await IssueService.GetAllIssuesFromDB(req.query as Query);

    sendResponse(res, {
      status: 200,
      success: true,
      message: "All issues fetched successfully",
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

const getIssueById = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const issueId = req.params.id;
    const result = await IssueService.GetIssueByIdFromDB(issueId as string);

    sendResponse(res, {
      status: 200,
      success: true,
      message: "Issue fetched successfully",
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

export const IssueController = {
  getIssueById,
  createIssue,
  getAllIssues,
};
