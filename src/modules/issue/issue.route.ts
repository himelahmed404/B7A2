import { Router } from "express";
import { IssueController } from "./issue.controller";
import { auth } from "../../middleware/auth";

const router = Router();

router.post(
  "/",
  auth("contributor", "maintainer"),
  IssueController.createIssue,
);
router.get("/", IssueController.getAllIssues);
export const IssueRoutes = router;
