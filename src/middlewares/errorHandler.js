const isProd = process.env.NODE_ENV === 'production';

function notFound(_req, _res, next) {
  const err = new Error('경로를 찾을 수 없음');
  err.status = 404;
  err.code = 'NOT_FOUND';
  next(err);
}

function errorHandler(err, _req, res, _next) {
  if (!isProd) console.error('[ERROR]', err);

  const status = err.status || 500;
  const code = err.code || 'ERROR';
  const message = err.message || '서버 에러가 확인되었습니다.';
  return res.status(status).json({
    ok: false,
    error: { code, message, ...(err.details ? { details: err.details } : {}) }
  });
}

module.exports = { notFound, errorHandler };