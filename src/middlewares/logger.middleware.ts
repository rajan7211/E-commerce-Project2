import { Request, Response, NextFunction } from "express";
import logger from "../config/logger.config";

//  HTTP requests
export const loggerMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const start = Date.now();

 res.on("finish", () => {
  const duration = Date.now() - start;

  const { method, originalUrl } = req;
  const { statusCode } = res;

  const logMessage = `${method} ${originalUrl} ${statusCode} - ${duration}ms`;

  if (statusCode >= 500) {
    logger.error(logMessage);
  } else if (statusCode >= 400) {
    logger.warn(logMessage);
  } else {
    logger.info(logMessage);
  }
});

  next();
};

export const errorLogger = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  logger.error("Error Occurred", {
    message: err.message,
    stack: err.stack,
    method: req.method,
    url: req.originalUrl,
    body: req.body,
    params: req.params,
    query: req.query,
  });

  next(err);
};








