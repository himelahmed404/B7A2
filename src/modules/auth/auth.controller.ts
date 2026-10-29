import { type Request, type Response } from "express";
import sendResponse from "../../utility/sendResponse";
import { AuthService } from "./auth.service";


const loginUser = async (req:Request, res:Response) =>{
    try {
        const result = await AuthService.loginUserIntoDB(req.body);
    
        sendResponse(res, {
          status: 200,
          success: true,
          message: "Login successful",
          data: result,
        });
      } catch (error) {
        sendResponse(res, {
          status: 401,
          success: false,
          message: "Authentication failed",
          error: error instanceof Error ? error.message : String(error),
        });
      }
    };
    
    export const AuthController = {
      loginUser,
    };