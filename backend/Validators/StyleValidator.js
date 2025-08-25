import * as z from 'zod';

const sortBy = ['latest', 'mostViewed', 'mostCurated'];
const searchBy = ['nickname', 'title', 'content', 'tag'];
const rankBy = ['total', 'trendy', 'personality', 'practicality', 'costEffectiveness' ]; // prettier-ignore
const imageType = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];

// prettier-ignore
const categoyInfo = z.object({
  name: z.string(),
  brand: z.string(),
  price: z.number().nonnegative(),
}).strict();

// prettier-ignore
const categories = z.object({
  top: categoyInfo.optional(),
  bottom: categoyInfo.optional(),
  outer: categoyInfo.optional(),
  dress: categoyInfo.optional(),
  shoes: categoyInfo.optional(),
  bag: categoyInfo.optional(),
  accessory: categoyInfo.optional(),
}).strict();

// prettier-ignore
const postStyleSchema = z.object({
  title: z.string().min(1, '제목을 입력해주세요.'),
  content: z.string().min(1, '내용을 입력해주세요.'),
  categories,
  tags: z.array(z.string()).min(1, '태그를 최소 1개 이상 입력해주세요.'),
  imageUrls: z.array(z.string().refine(val => val.startsWith('http') || val.startsWith('../'), {
    message: '이미지 경로가 올바르지 않습니다.' // 웹이나 로컬 이미지 주소를 의미하는 접두어만 허용
  })).min(1, '이미지를 최소 1개 이상 업로드해주세요.'),
  // 미들웨어를 거치면서 Image로 변환하지만
  // 유효성 검증을 미들웨어에서 제일 처음 수행하니 입력되는 데이터 포맷대로 설정
}).strict();

// prettier-ignore
const idSchema = z.object({
  id: z.string().regex(/^\d+$/).transform(Number),
}).strict();

// prettier-ignore
const getStyleListSchema = z.object({
  page: z.string().regex(/^\d+$/).transform(Number).optional().default(1),
  pageSize: z.string().regex(/^\d+$/).transform(Number).optional().default(10),
  sortBy: z.enum(sortBy).optional().default('latest'),
  searchBy: z.enum(searchBy).optional().default('nickname'),
  keyword: z.string().optional(),
  tag: z.string().optional(),
}).strict();

// prettier-ignore
const getRankingSchema = z.object({
  page: z.string().regex(/^\d+$/).transform(Number).optional().default(1),
  pageSize: z.string().regex(/^\d+$/).transform(Number).optional().default(10),
  rankBy: z.enum(rankBy).optional().default('total'),
}).strict();

const imageSchema = z.object({
  // 이미 multer에서 imagefilter로 거르긴 함함
  mimetype: z.enum(imageType),
  filename: z.string(),
  path: z.string(),
});

function styleValidator() {
  return (req, res, next) => {
    try {
      switch (req.method) {
        case 'GET':
          if (req.params.id) {
            req.parsedId = idSchema.parse(req.params);
          } else {
            req.parsedQuery = getStyleListSchema.parse(req.query);
          }
          break;
        case 'POST':
          if (req.file) {
            imageSchema.parse(req.file);
          } else {
            postStyleSchema.parse(req.body);
          }
          break;
        case 'PUT':
          req.parsedId = idSchema.parse(req.params);
          postStyleSchema.partial().parse(req.body);
          break;
        case 'DELETE':
          req.parsedId = idSchema.parse(req.params);
          break;
        default:
          return res.status(400).json({ error: '잘못된 요청 메소드 입니다.' });
      }
      next();
    } catch (e) {
      console.error(e);
      // 추후에 디테일한 에러 핸들링 추가
      return res.status(400).json({ error: '유효성 검증 실패!', message: e });
    }
  };
}
function rankingValidator() {
  return (req, res, next) => {
    try {
      req.parsedQuery = getRankingSchema.parse(req.query);
      next();
    } catch (e) {
      console.error(e);
      // 추후에 디테일한 에러 핸들링 추가
      return res.status(400).json({ error: '유효성 검증 실패!', message: e });
    }
  };
}

export { styleValidator, rankingValidator };
