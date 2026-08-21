import { Response } from 'express';

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
  meta?: Record<string, any>;
}

export interface ApiErrorResponse {
  success: false;
  code: string;
  message: string;
  errors?: Array<{ field?: string; message: string }>;
}

export function sendSuccess<T>(
  res: Response,
  data: T,
  message?: string,
  statusCode = 200,
  meta?: Record<string, any>,
): Response {
  const body: ApiResponse<T> = { success: true, data };
  if (message) body.message = message;
  if (meta) body.meta = meta;
  return res.status(statusCode).json(body);
}

export function sendCreated<T>(res: Response, data: T, message?: string): Response {
  return sendSuccess(res, data, message, 201);
}

export function sendError(
  res: Response,
  statusCode: number,
  code: string,
  message: string,
  errors?: Array<{ field?: string; message: string }>,
): Response {
  const body: ApiErrorResponse = { success: false, code, message };
  if (errors) body.errors = errors;
  return res.status(statusCode).json(body);
}

/** Typed application error for use in services and controllers. */
export class AppError extends Error {
  public statusCode: number;
  public code: string;
  public errors?: Array<{ field?: string; message: string }>;

  constructor(
    statusCode: number,
    code: string,
    message: string,
    errors?: Array<{ field?: string; message: string }>,
  ) {
    super(message);
    this.name = 'AppError';
    this.statusCode = statusCode;
    this.code = code;
    this.errors = errors;
  }
}
