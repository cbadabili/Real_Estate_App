import { randomUUID } from 'crypto';
import { analyticsService } from '../analytics-service';
export const addRequestId = (req, res, next) => {
    req.id = randomUUID();
    res.setHeader('X-Request-ID', req.id);
    next();
};
export const structuredLogger = (req, res, next) => {
    const start = Date.now();
    res.on('finish', () => {
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
        try {
            analyticsService.recordResponseTime(req.path, duration);
            if (res.statusCode >= 400) {
                analyticsService.recordError(req.path, res.statusCode.toString());
            }
        }
        catch (err) {
            console.error('analyticsService error', { path: req.path, err: String(err) });
        }
    });
    next();
};
