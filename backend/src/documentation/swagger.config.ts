import swaggerJsdoc from 'swagger-jsdoc';

const options: swaggerJsdoc.Options = {
  // Swagger 문서의 기본 구조 정의
  definition: {
    openapi: '3.0.0', // OpenAPI 버전
    info: {
      title: 'How Do I Look API Document',
      version: '1.0.0',
      description: 'How Do I Look 백엔드 API 명세서입니다.',
    },
    // JWT 인증을 위한 설정
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
          description: '로그인 후 발급받은 JWT 토큰을 입력하세요.',
        },
      },
    },
  },
  // Swagger 문서를 생성할 대상 파일들
  apis: ['./src/documentation/swagger/**/*.yaml'],
};

export const specs = swaggerJsdoc(options);
