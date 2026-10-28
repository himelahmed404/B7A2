import type { Request, Response } from "express";
import { UserService } from "./user.service";
import sendResponse from "../../utility/sendResponse";


const createUser = async (req: Request, res: Response) => {
    try {
        const result = await UserService.CreateUserIntoDB(req.body);

        sendResponse(res, {
            status: 200,
            success: true,
            message: "User created successfully",
            data: result,
        });
    } catch (error) {
        sendResponse(res, {
            status: 500,
            success: false,
            message: "Failed to create user",
            error: error instanceof Error ? error.message : String(error),

        });
        console.log(error)
    }

}


export const UserController = {
    createUser
}