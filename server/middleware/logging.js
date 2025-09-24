import { randomUUID } from 'crypto';
import { analyticsService } from '../analytics-service';
export const addRequestId = (req, res, next) => {
    req.id = randomUUID();
    res.setHeader('X-Request-ID', req.id);
    next();
};
export const structuredLogger = (req, res, next) => {
    const start = Date.now();
    const originalSend = res.send;
    res.send = function (body) {
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
            // Track performance metrics (never block responses)
            try {
                analyticsService.recordResponseTime(req.path, duration);
                if (res.statusCode >= 400) {
                    analyticsService.recordError(req.path, res.statusCode.toString());
                }
            }
            catch (err) {
                console.error('analyticsService error', { path: req.path, err: String(err) });
            }
        }
        return originalSend.call(this, body);
    };
    next();
};
