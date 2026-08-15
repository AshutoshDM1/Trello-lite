import type { Request, Response, NextFunction } from 'express';

const asyncHandler = (fn: (req: Request, res: Response, next?: NextFunction) => Promise<void>) => {
  return async (req: Request, res: Response, next?: NextFunction) => {
    try {
      if (next !== undefined) {
        await fn(req, res, next);
      } else {
        await fn(req, res);
      }
    } catch (error) {
      console.error(error as Error);
      res.status(500).json({ message: 'Internal server error' });
    }
  };
};

export default asyncHandler;
