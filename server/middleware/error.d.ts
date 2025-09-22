import type { Request, Response, NextFunction } from 'express';
export declare function notFoundHandler(_req: Request, res: Response): void;
export declare function errorHandler(err: unknown, _req: Request, res: Response, _next: NextFunction): Response<any, Record<string, any>>;
