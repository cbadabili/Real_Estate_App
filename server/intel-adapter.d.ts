import type { Request, Response } from "express";
export declare function intelSearch(req: Request, res: Response): Promise<Response<any, Record<string, any>> | undefined>;
export declare function intelSuggest(req: Request, res: Response): Promise<Response<any, Record<string, any>> | undefined>;
