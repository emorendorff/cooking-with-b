import { Request, Response } from 'express';

export const errorHandler = (
  err: Error,
  _req: Request,
  res: Response,

): void => {
  console.error(err.stack);
  res.status(500).json({
    error: process.env.NODE_ENV === 'production' 
      ? 'Internal server error' 
      : err.message
  });
};