<p align="center">
<img src="https://capsule-render.vercel.app/api?type=rect&height=200&color=ffffff&text=How%20Do%20I%20Look&fontSize=100&textBg=false&descSize=20&animation=twinkling&fontAlign=50&fontColor=000000&desc=오늘의%20당신을%20위한%20진솔한%20패션%20조언.&descAlignY=85&descAlign=50">
<p/>

![서비스 소개](https://github.com/user-attachments/assets/c9b2aa9c-f901-4eaf-9518-3db9cc61c47b)

---------------------

# How do I look - team7

[Team Notion](https://www.notion.so/24c91db9d97f80629930c74864d07de8?pvs=21)

## 👨‍👩‍👧‍👦 팀원

| Name   | Contect                                                |
| ------ | ------------------------------------------------------ |
| 박다슬 | [Park-DaSeul](https://github.com/Park-DaSeul)          |
| 오연진 | [yonjinoh (오연진)](https://github.com/yonjinoh)       |
| 김동현 | [aprkal12 (DongHyun Kim)](https://github.com/aprkal12) |

## 프로젝트 소개

- "How do I look"은 사용자들이 자신의 스타일을 공유하고 다른 사용자들로부터 피드백을 받으며, 다양한 패션 스타일을 탐색하고 영감을 얻을 수 있는 소셜 패션 플랫폼입니다.
- 프로젝트 기간: 2025.08.11 ~ 2025.08.29

![서비스 소개 이미지2](https://github.com/user-attachments/assets/5343c467-3595-454a-8496-9d52aacf77d5)
![서비스 소개 이미지](https://github.com/user-attachments/assets/2a1cd491-8b4e-4b5c-a408-5397ad7e10b4)

### 주요 기능

- **스타일 공유**: 자신의 데일리룩이나 특별한 날의 스타일을 사진과 함께 공유할 수 있습니다.
- **큐레이션**: 다른 사용자의 스타일에 큐레이션을 달고 소통할 수 있습니다.
- **랭킹 시스템**: 인기 있는 스타일을 확인할 수 있습니다.
- **인기 태그 목록 기반 탐색**: 다양한 태그를 통해 원하는 스타일을 쉽게 찾아볼 수 있습니다.
- **마이페이지**: 내가 올린 스타일, 좋아요한 스타일 등 활동 내역과 내 정보를 관리할 수 있습니다.

## ⚙️ 기술 스택

### backend

- **Runtime / Framework**: Node.js / Express.js
- **Database**: Prisma (ORM)
- **Authentication**: JSON Web Token (JWT), Bcrypt
- **Image Handling**: Cloudinary (Storage), Multer (Middleware)
- **API Request Logging**: Morgan
- **Validation**: Zod
- **Caching**: Redis
- **Scheduled Jobs**: node-cron
- **Email**: Nodemailer
- **Code Formatting**: Prettier

### Frontend

- **Framework**: Next.js, React
- **Language**: TypeScript
- **Styling**: SCSS, CSS Modules, Emotion
- **State Management**: React Context
- **Linting/Formatting**: ESLint, Prettier

## 팀원별 구현 기능 상세

### 김동현
<details>
<summary>구현한 페이지</summary>

#### 메인 스타일 목록 화면, 스타일 상세 조회
  ![Image](https://github.com/user-attachments/assets/2329770e-7159-4252-b2d5-a3d55db85be2)
  
#### 스타일 생성
  ![Image](https://github.com/user-attachments/assets/eb09af38-9b5c-4987-9a8d-30c0b8078365)
  
#### 스타일 수정, 삭제
  ![Image](https://github.com/user-attachments/assets/89e5ca4e-7d57-431f-a62d-44879ec9fb20)

#### 랭킹 페이지
  ![Image](https://github.com/user-attachments/assets/6b5c42c7-c451-4c2c-b02f-8b194aa3b046)

#### 마이 페이지
  ![Image](https://github.com/user-attachments/assets/a1dc2fe1-111f-405d-bb9a-eb93482d62f5)

#### 프로필 페이지에서 유저 정보 수정
  ![Image](https://github.com/user-attachments/assets/765392a8-b78d-4308-aa42-194a91ac95c1)

</details>

<details>
<summary>구현 내용 정리</summary>

<br> <br/>

- **스타일 API**
  - 스타일 목록, 상세 조회 기능 구현
  - 스타일 생성, 수정, 삭제 기능 구현
- **태그목록, 랭킹 베이스 API**
  - 태그 목록 조회, 랭킹 시스템 베이스 API 작성
- **유저 API**
  - 마이페이지 구현
    - 유저 정보 표시
    - 유저 정보 수정, 삭제 기능 구현
    - 프로필 이미지 설정 및 각 스타일, 큐레이션, 코멘트에 반영
    - 유저가 작성한 스타일 리스트 조회 기능 구현
  - JWT 인증 로직에 프론트 서버 쿠키 도입
    - 로그인을 통해 받은 JWT 토큰을 서버사이드와 브라우저 localStorage간의 공유를 위한 쿠키 도입
- **미들웨어 작성**
  - errorHandler.js → 전역 에러 핸들러 작성 및 각 라우터 적용
  - hashing.js → 비밀번호 해싱 미들웨어를 통해 회원가입, 유저 정보 수정 시 해싱된 비밀번호 저장
  - ImagePreprocessor.js → 이미지 컬럼 전처리
- **유틸 함수 작성**
  - VerifyPassword.js → 로그인, 유저정보 수정 시 해싱된 비밀번호 검증을 위한 유틸 함수 구현
  - imageUpload.js → 이미지 로컬 저장을 위한 multer 업로드 유틸 함수 구현
- **DB 스키마 설계**
  - 팀원들과 공동 작업
  - 스타일, 유저 테이블 설계
- **프로젝트 코드 구조 리팩토링**
  - 기존 router - service 구조를 에러 핸들링과 역할 분리를 더 도입해 router - controller - service 구조로 리팩토링 진행
  - asyncHandler와 errorHander를 통해 서비스 함수들의 전역적인 에러 캐치와 핸들링 구조로 변경
- **프로젝트 배포**
  - 프로젝트 배포 버전 브랜치 관리 및 배포 진행
  - render(백엔드, 프론트, DB) , vercel(프론트)

</details>

### 박다슬

<details>
<summary>구현한 페이지</summary>

#### 인기 태그
  <img alt="Image" src="https://github.com/user-attachments/assets/21e3d1b0-79cc-453a-aa32-2e92dedb7a79" />

</details>

<details>
<summary>구현한 페이지</summary>

<br> <br/>

- 답글 API
  - 답글 생성, 수정, 삭제 기능 구현

</details>

### 오연진

<details>
<summary>구현한 페이지</summary>

#### 큐레이션 조회/생성
  ![Image](https://github.com/user-attachments/assets/0d8cb6de-ad34-439c-afc1-f8b6af79046a)

#### 큐레이션 수정
  ![Image](https://github.com/user-attachments/assets/a17d4866-e644-4fcd-a07a-5357779a9833)

#### 큐레이션 삭제
  ![Image](https://github.com/user-attachments/assets/15b929ba-3fd4-4200-ad08-74ff738c0865)

#### 회원가입
  ![Image](https://github.com/user-attachments/assets/d404c22f-f422-4f33-b5a9-8ea617847136)

#### 로그인
  ![Image](https://github.com/user-attachments/assets/3b8c4d72-d12f-44a7-878c-bc98db040830)

#### 좋아요
  ![Image](https://github.com/user-attachments/assets/38369106-cbd7-4557-b405-071140d4af8b)

#### 마이페이지 좋아요 목록
  <img alt="Image" src="https://github.com/user-attachments/assets/e66bf9b0-9cc0-4844-9e42-09f29cd0e2d3"/>

#### 공유하기
  ![Image](https://github.com/user-attachments/assets/d0f65b48-6a26-403c-af7f-d52784cdffc5)

#### 랭킹 시스템 개선
  <img alt="Image" src="https://github.com/user-attachments/assets/0cebd306-6c24-4af5-9429-a91f4b29ad07" />

</details>

<details>
<summary>구현 내용 정리</summary>

<br> <br/>

- **RESTful API 설계 및 구현**
  - User, Style, Curation, Ranking, StyleLike 모델에 대한 CRUD API 엔드포인트 설계 및 개발
  - Express.js의 라우터를 사용하여 API 엔드포인트를 모듈화하고 관리
  - Zod를 활용하여 Curation API 요청에 대한 유효성 검사 미들웨어 구현 및 데이터 무결성 확보
- **큐레이션 CRUD API**
  - **개요**: 사용자 스타일 컬렉션(큐레이션)의 생성, 조회, 수정, 삭제 기능 구현.
  - **구현**:
    - **생성**: `POST /api/curations` 엔드포인트에 유효성 검증된 데이터 요청. `auth` 미들웨어로 사용자 인증 후, Prisma를 통해 큐레이션 및 스타일 관계 생성.
    - **조회**: `GET` 엔드포인트들로 모든/특정 큐레이션 목록 및 상세 정보 조회. Prisma를 이용해 데이터베이스 데이터 조회 후 관련 정보 포함 반환.
    - **수정**: `PUT`/`PATCH` 엔드포인트로 소유자 권한 확인 및 유효성 검사 후 데이터 업데이트.
    - **삭제**: `DELETE` 엔드포인트로 소유자 권한 확인 후 데이터베이스 레코드 삭제.
- **회원가입/로그인 로직**
  - **개요**: 안전한 사용자 인증 시스템 구축.
  - **구현**:
    - **회원가입**: `POST /api/users/register` 요청. `Zod`로 유효성 검사 후, **Bcrypt**로 비밀번호 해싱 및 Prisma로 사용자 레코드 생성.
    - **로그인**: `POST /api/users/login` 요청. 해싱된 비밀번호 비교 후, **JWT(JSON Web Token)** 생성 및 반환.
- **이메일 인증 로직**
  - **개요**: 회원가입 시 이메일 유효성 확인. **Redis TTL(Time To Live)** 기능 활용.
  - **구현**:
    - **인증 코드 발송**: 회원가입 성공 직후, 6자리 인증 코드 생성. **Redis**에 짧은 유효시간과 함께 저장 후 이메일 발송.
    - **인증 코드 확인**: 사용자 제출 코드와 Redis에 저장된 코드 일치 여부 확인. 일치 시 사용자 `isVerified` 필드 업데이트 후 Redis 데이터 삭제.
- **랭킹 산정 시스템**
  - **개요**: 스타일 및 태그 인기도 산정 및 제공 시스템 개선. **node-cron**을 통한 자동화.
  - **구현**:
    - **랭킹 산정**: **node-cron**을 사용해 주기적으로 랭킹 산정 로직 실행. 좋아요, 조회수 등 복합 지표에 가중치를 적용해 점수 계산.
    - **API 제공**: 미리 계산된 랭킹 데이터를 `GET` 엔드포인트들로 제공하여 효율적인 데이터 전송.
- **좋아요 기능**
  - **개요**: 스타일 좋아요 기능 구현 (모델 정의 및 관련 api 구현).
  - **구현**:
    - **좋아요**: `POST /api/styles/:id/like` 요청. 중복 좋아요 방지 로직 적용. Prisma로 `StyleLike` 레코드 생성 및 `likesCount` 증가.
    - **취소**: `DELETE /api/styles/:id/like` 요청. `StyleLike` 레코드 삭제 및 `likesCount` 감소.

</details>

## 🚀 시작하기

### 1. 프로젝트 클론

```bash
git clone <https://github.com/your-repository/nb04-howdoilook-team7.git>
cd nb04-howdoilook-team7
```

### 2. 백엔드 설정

```bash
cd backend
npm install

# .env 파일 설정
# .env.example 파일을 참고하여 .env 파일을 생성하고 환경 변수를 설정해주세요.
# DATABASE_URL, JWT_SECRET_KEY, CLOUDINARY_URL 등
cp .env.sample .env

# Prisma 데이터베이스 마이그레이션
npx prisma migrate deploy

# 백엔드 서버 실행
node app.js

```

### 3. 프론트엔드 설정

```bash
cd frontend
npm install

# .env.local 파일 설정
# .env.example 파일을 참고하여 .env.local 파일을 생성하고 환경 변수를 설정해주세요.
# NEXT_PUBLIC_API_URL 등
cp .env.sample .env

# 프론트 서버 실행
npm run dev

```

이제 브라우저에서 `http://localhost:3000`으로 접속하여 애플리케이션을 확인할 수 있습니다.

## 📁 폴더 구조

```
📁 root/backend/
├── 📁 prisma/
│
├── 📁 node_modules/
│
├── 📁 Seeds/
│   └── Seed.js
│
├── 📁 Controllers/
│ 	├── CommentController.js
│ 	├── CurationController.js
│ 	├── StyleController.js
│ 	├── TagController.js
│   └── UserController.js
│
├── 📁 Jobs/
│   └── calculatePopular.js
│
├── 📁 Validators/
│   ├── StyleValidator.js
│   ├── CurationValidator.js
│   ├── UserValidator.js
│   └── CommentValidator.js
│
├── 📁 Middlewares/
│   ├── errorHandler.js
│   ├── auth.js
│   ├── asyncHandler.js
│   ├── hashing.js
│   └── ImagePreprocessor.js
│
├── 📁 Utils/
│   ├── CalculateRanking.js
│   ├── CloudinaryUtils.js
│   ├── ImageToImageUrls.js
│   ├── imageUpload.js
│   ├── redisClient.js
│   ├── SendEmail.js
│   └── VerifyPassword.js
│
├── 📁 Services/
│   ├── StyleService.js
│   ├── CurationService.js
│   ├── TagService.js
│   ├── UserService.js
│   └── CommentService.js
│
├── 📁 Routers/
│   ├── Style.js
│   ├── Curation.js
│   ├── Ranking.js
│   ├── Tag.js
│   ├── User.js
│   └── Comment.js
├── .env
├── app.js
├── .git
├── .gitignore
├── package.json
├── package-lock.json
├── .prettierrc
└── README.md
```

## 구현 홈페이지

https://www.ehdehd0175.store/

## 프로젝트 회고록

[How Do I Look.pdf](https://github.com/user-attachments/files/22025858/How.Do.I.Look.1.pdf)
