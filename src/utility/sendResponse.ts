import type { Response } from "express";

type responseData<T> = {
  status: number;
  success: boolean;
  message: string;
  data?: T;
  error?: any;
};

const sendResponse = <T>(res: Response, payload: responseData<T>) => {
  res.status(payload.status).json({
    success: payload.success,
    message: payload.message,
    data: payload.data,
    error: payload.error,
  });
};

export default sendResponse;