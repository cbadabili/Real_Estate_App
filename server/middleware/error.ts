
import type {
  ErrorRequestHandler,
  Request,
  RequestHandler,
  Response,
} from 'express';
import { ZodError } from 'zod';

export const notFoundHandler: RequestHandler = (_req, res) => {
  res.status(404).json({ error: 'Not Found' });
};

export const errorHandler: ErrorRequestHandler = (err, _req, res, _next) => {
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
};
