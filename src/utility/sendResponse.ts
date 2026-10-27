import type { Response } from "express";

type resposData<T> = {
  status: number;
  success: boolean;
  message: string;
  data?: T;
  error?: any;
};

const sendResponse = <T>(res: Response, responseData: resposData<T>) => {
  res.status(responseData.status).json({
    success: responseData.success,
    message: responseData.message,
    data: responseData.data,
    error: responseData.error,
  });
};

export default sendResponse;