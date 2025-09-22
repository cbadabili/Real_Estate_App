import { ZodError } from 'zod';
export function notFoundHandler(_req, res) {
    res.status(404).json({ error: 'Not Found' });
}
export function errorHandler(err, _req, res, _next) {
    console.error('Error handler caught:', err);
    if (err instanceof ZodError) {
        return res.status(400).json({
            error: 'ValidationError',
            details: err.flatten()
        });
    }
    const status = err?.status ?? 500;
    const message = status >= 500 ? 'Internal Server Error' : err?.message ?? 'Error';
    return res.status(status).json({ error: message });
}
