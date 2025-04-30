import { Request, Response, NextFunction } from 'express';

type AsyncHandler = (
  req: Request,
  res: Response,
  next: NextFunction
) => Promise<any>;

export function withErrorHandling(handler: AsyncHandler) {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      console.log('try: ', req.body);
      await handler(req, res, next);
    } catch (error: any) {
      console.error(`❌ Error in ${req.method} ${req.url}:`, error);

      const statusCode = error.statusCode ?? 500;
      res.status(statusCode).json({
        error: {
          message: error.message ?? 'Internal Server Error',
          details: error.details ?? null,
        },
      });
    }
  };
}
