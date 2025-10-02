import { type Request, type Response } from "express";

export async function suggest(_req: Request, res: Response): Promise<void> {
  res.status(501).json({ error: "Suggestion endpoint not yet implemented" });
}
