
import { Request, Response, NextFunction } from 'express';
import { randomUUID } from 'crypto';
import { analyticsService } from '../analytics-service';

export interface RequestWithId extends Request {
  id: string;
}

export const addRequestId = (req: RequestWithId, res: Response, next: NextFunction) => {
  req.id = randomUUID();
  res.setHeader('X-Request-ID', req.id);
  next();
};

export const structuredLogger = (req: RequestWithId, res: Response, next: NextFunction) => {
  const start = Date.now();
  const originalSend = res.send;

  res.send = function(body) {
    const duration = Date.now() - start;
    
    if (req.path.startsWith('/api')) {
      const logData = {
        timestamp: new Date().toISOString(),
        requestId: req.id,
        method: req.method,
        path: req.path,
        statusCode: res.statusCode,
        duration,
        userAgent: req.get('user-agent'),
        ip: req.ip || req.connection.remoteAddress,
        query: Object.keys(req.query).length > 0 ? req.query : undefined,
      };

      console.log(JSON.stringify(logData));

      // Track performance metrics
      analyticsService.recordResponseTime(req.path, duration);
      
      // Track errors
      if (res.statusCode >= 400) {
        analyticsService.recordError(req.path, res.statusCode.toString());
      }
    }

    return originalSend.call(this, body);
  };

  next();
};
