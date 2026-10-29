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

const updateIssue = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const issueId = req.params.id;
    const updateData = req.body;
    const user = req.user;

    const existingIssue = await IssueService.GetIssueByIdFromDB(
      issueId as string,
    );

    if (!existingIssue) {
      return sendResponse(res, {
        status: 404,
        success: false,
        message: "Issue not found",
      });
    }

    if (
      existingIssue.reporter_id !== user?.id &&
      user?.role !== "contributor"
    ) {
      sendResponse(res, {
        status: 403,
        success: false,
        message: "You are not authorized to update this issue",
      });
      return;
    }

    if (existingIssue.status !== "open") {
      sendResponse(res, {
        status: 400,
        success: false,
        message: "Issue is not open for updates",
      });
      return;
    }

    const result = await IssueService.UpdateIssueInDB(
      issueId as string,
      updateData,
    );

    sendResponse(res, {
      status: 200,
      success: true,
      message: "Issue updated successfully",
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

const deleteIssue = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const user = req.user;
    const issueId = req.params.id;

    if (user?.role !== "maintainer") {
      return sendResponse(res, {
        status: 404,
        success: false,
        message: "Only maintainer can do this",
      });
    }
    const existingIssue = await IssueService.GetIssueByIdFromDB(issueId as string);

    if (!existingIssue) {
      res.status(404).json({ success: false, message: "Issue not found" });
      return;
    }

    const result = await IssueService.DeleteIssueFromDB(issueId as string);
    sendResponse(res, {
      status: 200,
      success: true,
      message: "Issue Deleted successfully",
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
  updateIssue,
  deleteIssue,
};
