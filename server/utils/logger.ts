import type { Request } from 'express';
import type { RequestWithId } from '../middleware/logging';

type LogLevel = 'info' | 'warn' | 'error';

interface LogContext {
  req?: Request;
  userId?: number | string;
  meta?: Record<string, unknown>;
  error?: unknown;
}

const NODE_ENV = process.env.NODE_ENV ?? 'development';

const normalizeRequestId = (req?: Request): string | undefined => {
  if (!req) {
    return undefined;
  }
  const requestWithId = req as Request & Partial<RequestWithId>;
  return requestWithId.id ?? undefined;
};

const serializeError = (error: unknown) => {
  if (!error) {
    return undefined;
  }

  if (error instanceof Error) {
    return {
      name: error.name,
      message: error.message,
      stack: NODE_ENV === 'development' ? error.stack : undefined,
    };
  }

  if (typeof error === 'object') {
    try {
      return JSON.parse(JSON.stringify(error));
    } catch {
      return { message: String(error) };
    }
  }

  return { message: String(error) };
};

const print = (level: LogLevel, payload: Record<string, unknown>) => {
  const body = JSON.stringify(payload);
  switch (level) {
    case 'warn':
      console.warn(body);
      break;
    case 'error':
      console.error(body);
      break;
    default:
      console.log(body);
  }
};

const log = (level: LogLevel, event: string, context: LogContext = {}) => {
  const { req, userId, meta, error } = context;

  const base: Record<string, unknown> = {
    level,
    event,
    timestamp: new Date().toISOString(),
    requestId: normalizeRequestId(req),
    method: req?.method,
    path: req?.path,
    userId,
  };

  if (meta && Object.keys(meta).length > 0) {
    base.meta = meta;
  }

  const serializedError = serializeError(error);
  if (serializedError) {
    base.error = serializedError;
  }

  const sanitized = Object.fromEntries(
    Object.entries(base).filter(([, value]) => value !== undefined),
  );

  print(level, sanitized);
};

export const logInfo = (event: string, context?: LogContext) => log('info', event, context);
export const logWarn = (event: string, context?: LogContext) => log('warn', event, context);
export const logError = (event: string, context?: LogContext) => log('error', event, context);
