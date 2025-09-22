import { Request, Response, NextFunction } from 'express';
export interface RequestWithId extends Request {
    id: string;
}
export declare const addRequestId: (req: RequestWithId, res: Response, next: NextFunction) => void;
export declare const structuredLogger: (req: RequestWithId, res: Response, next: NextFunction) => void;
