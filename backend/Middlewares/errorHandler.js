export default function errorHandler(err, req, res, next) {
  console.error(err);
  if (err.message && err.message.includes('해당 스타일에 이미 큐레이션을 등록한 사용자입니다.')) {
    res.status(400).json({ error: '이미 큐레이션을 등록하셨습니다.' });
  } else if (err?.code === 'P2025') {
    res.status(404).json({ error: 'id를 찾을 수 없습니다.' });
  } else if (err?.name === 'StructError') {
    res.status(400).json({
      error: 'Validation error',
      message: err.message,
    });
  } else if (err?.statusCode) {
    res.status(err.statusCode).json({ error: err.message });
  } else {
    res.status(500).json({ error: err.message });
  }
}
