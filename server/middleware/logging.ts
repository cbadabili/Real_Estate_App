
import { Request, Response, NextFunction } from 'express';
import { randomUUID } from 'crypto';
import { analyticsService } from '../analytics-service';

export interface RequestWithId extends Request {
  id: string;
}

/**
 * Assign a unique request identifier and expose it via the X-Request-ID header.
 *
 * @param req - Express request augmented with the request identifier.
 * @param res - Express response instance that receives the header.
 * @param next - Callback to move execution to the next middleware.
 */
export const addRequestId = (req: RequestWithId, res: Response, next: NextFunction) => {
  const inboundId = req.get('x-request-id');
  const requestId = inboundId && inboundId.trim() ? inboundId : randomUUID();
  req.id = requestId;
  res.setHeader('X-Request-ID', requestId);
  next();
};

/**
 * Log structured request metadata and record analytics timings without
 * impacting response flow.
 *
 * @param req - Express request carrying the generated request ID.
 * @param res - Express response used to access status codes and attach hooks.
 * @param next - Callback that defers to downstream middleware/handlers.
 */
export const structuredLogger = (req: RequestWithId, res: Response, next: NextFunction) => {
  const start = Date.now();

  res.once('finish', () => {
    if (!req.path.startsWith('/api')) {
      return;
    }

    const duration = Date.now() - start;
    const logData = {
      timestamp: new Date().toISOString(),
      requestId: req.id,
      method: req.method,
      path: req.path,
      statusCode: res.statusCode,
      duration,
      userAgent: req.get('user-agent'),
      ip: req.ip || req.socket?.remoteAddress,
      query: Object.keys(req.query).length > 0 ? req.query : undefined,
    };

    console.log(JSON.stringify(logData));

    Promise.resolve(analyticsService.recordResponseTime(req.path, duration)).catch(err => {
      console.error('analyticsService error', { path: req.path, err: String(err) });
    });

    if (res.statusCode >= 400) {
      Promise.resolve(analyticsService.recordError(req.path, res.statusCode.toString())).catch(err => {
        console.error('analyticsService error', { path: req.path, err: String(err) });
      });
    }
  });

  next();
};
