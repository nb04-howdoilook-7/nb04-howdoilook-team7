/**
 * Global Error Handler
 * - AppError: 명시적(운영) 에러 타입
 * - Err: 자주 쓰는 HTTP 에러 헬퍼(400/401/403/404/409/500)
 * - mapPrismaError/mapZodError: 라이브러리 에러 → AppError 변환
 * - notFound: 존재하지 않는 라우트 → AppError 위임
 * - errorHandler: 전역 에러 응답 { ok:false, error:{ code, message, details?, traceId } }
 */
class AppError extends Error {
  constructor(statusCode = 500, message = 'Internal Server Error', { code = 'INTERNAL_ERROR', details, isOperational = true } = {}) {
    super(message);
    this.statusCode = statusCode;
    this.code = code;
    this.details = details;
    this.isOperational = isOperational;
    Error.captureStackTrace?.(this, this.constructor);
  }
}

const Err = {
  badRequest: (msg = 'Bad Request', details) =>
    new AppError(400, msg, { code: 'BAD_REQUEST', details }),
  unauthorized: (msg = 'Unauthorized', details) =>
    new AppError(401, msg, { code: 'UNAUTHORIZED', details }),
  forbidden: (msg = 'Forbidden', details) =>
    new AppError(403, msg, { code: 'FORBIDDEN', details }),
  notFound: (msg = 'Not Found', details) =>
    new AppError(404, msg, { code: 'NOT_FOUND', details }),
  conflict: (msg = 'Conflict', details) =>
    new AppError(409, msg, { code: 'CONFLICT', details }),
  internal: (msg = 'Internal Server Error', details) =>
    new AppError(500, msg, { code: 'INTERNAL_ERROR', details }),
};

let Prisma;
try { ({ Prisma } = require('@prisma/client')); } catch { }

const isProd = process.env.NODE_ENV === 'production';

function notFound(req, _res, next) {
  next(Err.notFound(`경로를 찾을 수 없습니다: ${req.originalUrl}`));
}

function mapPrismaError(e) {
  if (!e) return null;
  if (e.code === 'P2002') return Err.conflict('중복된 값입니다.', { fields: e.meta?.target });
  if (e.code === 'P2025') return Err.notFound('대상을 찾을 수 없습니다.');
  if (Prisma?.PrismaClientValidationError && e instanceof Prisma.PrismaClientValidationError) {
    return Err.badRequest('잘못된 요청 값입니다.');
  }
  return null;
}

function mapZodError(e) {
  if (e?.name === 'ZodError') {
    const details = e.issues?.map(i => ({ path: i.path, message: i.message }));
    return Err.badRequest('유효성 검사 실패', details);
  }
  return null;
}

function errorHandler(err, req, res, _next) {
  let appErr =
    (err instanceof AppError && err) ||
    mapPrismaError(err) ||
    mapZodError(err) ||
    Err.internal();

  const traceId = (req.id ||= `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`);
  if (!isProd) console.error('[ERROR]', { traceId, err });

  res.status(appErr.statusCode).json({
    ok: false,
    error: {
      code: appErr.code,
      message: appErr.message,
      ...(appErr.details ? { details: appErr.details } : {}),
      traceId,
      ...(isProd ? {} : { stack: err?.stack?.split('\n') }),
    },
  });
}

module.exports = { notFound, errorHandler, AppError, Err };
