/**
 * 전역 에러 처리 미들웨어 + AppError 유틸
 * 컨트롤러 에서는 next(Err.*) 한 줄 패턴으로 던지면 됩니다.
 * 실패 응답 포맷: { ok:false, error:{ code, message, details?, traceId } }
 * Pisema/Zod 에러 HTTP 상태 코드에 자동 매핑 됩니다.
 */
class AppError extends Error {
  /**
   * @param {number} statusCode HTTP 상태 코드 예) 400, 404, 500
   * @param {string} message  클라이언트로 보낼 메시지 (필요 시 사용자 친화적으로 )
   * @param {{ code?: string, details?: any, isOperational?: boolean }} [options]
   * code: 서비스 내부 에러코드 (예: BAD_REQUEST, NOT_FOUND)
   * datails: 필드 유효성 정보 등 추가 메타데이터
   * isOperationa: 운영성 에러 플래그 (알림/ 모니터링 구분)
   */
  constructor(statusCode = 500, message = 'Internal Server Error', { code = 'INTERNAL_ERROR', details, isOperational = true } = {}) {
    super(message);
    this.statusCode = statusCode;
    this.code = code;
    this.details = details;
    this.isOperational = isOperational;
    Error.captureStackTrace?.(this, this.constructor);
  }
}

// 컨트롤러에서 편하게 쓰는 헬퍼(한 줄 패턴: next(Err.badRequest('...'))) 
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

// Prisma 타입이 없을 수도 있어 optional require
let Prisma;
try {
  ({ Prisma } = require('@prisma/client'));
} catch {
  // optional
}

const isProd = process.env.NODE_ENV === 'production';

/**
 * 존재 하지 않는 라우트: 마지막에 등록해서 여기로 위임
 * @example app.use(notFound) 라우터 들 아래에 위치
 */
function notFound(req, _res, next) {
  next(Err.notFound(`경로를 찾을 수 없습니다: ${req.originalUrl}`));
}

/**
 * Prisma 오류를 표준 AppError로 반환
 * P2002: Unique 위반 → 409(CONFLICT)
 * P2025: 대상 없음 → 404(NOT_FOUND)
 * ValidationError → 400(BAD_REQUEST)
 */
function mapPrismaError(e) {
  if (!e) return null;
  if (e.code === 'P2002') return Err.conflict('중복된 값입니다.', { fields: e.meta?.target });
  if (e.code === 'P2025') return Err.notFound('대상을 찾을 수 없습니다.');
  if (Prisma?.PrismaClientValidationError && e instanceof Prisma.PrismaClientValidationError) {
    return Err.badRequest('잘못된 요청 값입니다.');
  }
  return null;
}

/**
 * Zod 유효성 에러 를 400으로 변환
 * details: [{ path,message}, ...]
 */
function mapZodError(e) {
  if (e?.name === 'ZodError') {
    const details = e.issues?.map(i => ({ path: i.path, message: i.message }));
    return Err.badRequest('유효성 검사 실패', details);
  }
  return null;
}

/**
 * 전역 에러 핸들러 
 * traceId 를 응답에 포함하여, 로그와ㅓ 1대1 매칭해 디버깅 속도를 높입니다.
 * 개발 환경에서만 stack을 노출 합니다.
 */
function errorHandler(err, req, res, _next) {
  let appErr =
    (err instanceof AppError && err) ||
    mapPrismaError(err) ||
    mapZodError(err) ||
    Err.internal();

  // 요청 단위 추척 합니다. ID(없으면 생성)
  const traceId = (req.id ||= `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`);
  if (!isProd) console.error('[ERROR]', { traceId, err });

  // 개발 환경에서는 원본 에러 객체도 기록 합니다.
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
