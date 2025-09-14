
import type { Request, Response, NextFunction } from 'express';
import { ZodError } from 'zod';

export function notFoundHandler(_req: Request, res: Response) {
  res.status(404).json({ error: 'Not Found' });
}

export function errorHandler(err: unknown, _req: Request, res: Response, _next: NextFunction) {
  console.error('Error handler caught:', err);
  
  if (err instanceof ZodError) {
    return res.status(400).json({ 
      error: 'ValidationError', 
      details: err.flatten() 
    });
  }
  
  const status = (err as any)?.status ?? 500;
  const message = status >= 500 ? 'Internal Server Error' : (err as any)?.message ?? 'Error';
  
  return res.status(status).json({ error: message });
}
