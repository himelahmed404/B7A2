import type { NextFunction, Request, Response } from "express";
import type { JwtPayload } from "jsonwebtoken";
import jwt from "jsonwebtoken";
import { pool } from "../db";
import sendResponse from "../utility/sendResponse";

export interface AuthRequest extends Request {
  user?: JwtPayload | string;
}

export const auth = (...requiredRoles: string[]) => {
  return async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      const token = req.headers.authorization;

      if (!token) {
        sendResponse(res, {
          status: 401,
          success: false,
          message: "You are not authorized! Token is missing."
        });
        return;
      }

      const decoded = jwt.verify(
        token,
        process.env.JWT_SECRET as string,
      ) as JwtPayload;

      const userData = await pool.query(`SELECT * FROM users WHERE email = $1`, [
        decoded.email,
      ]);

      const user = userData.rows[0];

      if (!user) {
        sendResponse(res, {
          status: 401,
          success: false,
          message: "You are not authorized! User not found."
        });
        return;
      }

      if (requiredRoles.length > 0 && !requiredRoles.includes(user.role)) {
        sendResponse(res, {
          status: 403,
          success: false,
          message: "You are not authorized! Insufficient permissions.",
        });
        return;
      }

      req.user = decoded;
      next();
    } catch (error) {
      next(error);
    }
  };
};
