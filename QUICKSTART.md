# 🚀 프로젝트 빠른 시작 가이드

## 프로젝트 개요

**Flowerable Frontend**는 꽃 주문 플랫폼의 프론트엔드입니다.
실무에서 바로 사용 가능한 프로덕션 레벨의 아키텍처로 설계되었습니다.

## 주요 기능

### 👤 사용자 (USER)
- 꽃 검색 및 조회
- 꽃을 보유한 샵 검색
- 장바구니 및 주문
- 주문 내역 관리
- 샵과 실시간 채팅

### 🏪 샵 (SHOP)
- 보유 꽃 관리
- 주문 접수 및 관리
- 포장 옵션 설정
- 사용자와 실시간 채팅

### 👨‍💼 관리자 (ADMIN)
- 전체 사용자/샵 관리
- 꽃 마스터 데이터 관리
- 주문 모니터링

## 설치 및 실행

### 1. 의존성 설치
```bash
npm install
```

### 2. 환경 변수 설정
```bash
cp .env.example .env
```

`.env` 파일을 열어 백엔드 API URL을 설정하세요:
```
VITE_API_BASE_URL=http://localhost:8080/api
```

### 3. 개발 서버 실행
```bash
npm run dev
```

브라우저에서 `http://localhost:3000` 접속

## 프로젝트 구조

```
src/
├── app/                # 앱 초기화, 라우팅, 레이아웃
├── pages/              # 페이지 컴포넌트 (로직 최소)
├── features/           # 도메인별 기능 (auth, order, shop 등)
│   └── {domain}/
│       ├── api.ts      # API 호출
│       ├── hooks.ts    # React Query 훅
│       ├── store.ts    # Zustand 스토어 (필요시)
│       ├── types.ts    # 타입 정의
│       └── components.tsx
└── shared/             # 공통 모듈
    ├── api/            # Axios 설정
    ├── ui/             # 공통 컴포넌트
    └── types/          # 공통 타입
```

## 주요 라우트

### 공통
- `/` - 홈
- `/login` - 로그인
- `/signup` - 회원가입

### 사용자
- `/flowers` - 꽃 목록
- `/shops` - 샵 검색
- `/shops/:id` - 샵 상세
- `/cart` - 장바구니
- `/orders` - 주문 내역
- `/profile` - 마이페이지

### 샵
- `/shop/dashboard` - 대시보드
- `/shop/orders` - 주문 관리
- `/shop/flowers` - 보유 꽃 관리
- `/shop/profile` - 샵 정보

### 관리자
- `/admin` - 관리자 페이지

## 개발 가이드

### 새 Feature 추가

1. **구조 생성**
```bash
mkdir src/features/review
touch src/features/review/{api,hooks,types,components}.ts
```

2. **API 함수 작성** (`api.ts`)
```typescript
export const reviewApi = {
  getList: () => apiClient.get('/reviews'),
  create: (data: ReviewRequest) => apiClient.post('/reviews', data),
};
```

3. **React Query 훅 작성** (`hooks.ts`)
```typescript
export const useReviews = () => {
  return useQuery({
    queryKey: ['reviews'],
    queryFn: reviewApi.getList,
  });
};
```

4. **페이지에서 사용**
```typescript
const ReviewPage = () => {
  const { data: reviews } = useReviews();
  return <div>{/* ... */}</div>;
};
```

### 스타일링

styled-components 사용:
```typescript
const Button = styled.button<{ $primary?: boolean }>`
  background: ${({ $primary }) => $primary ? '#3b82f6' : '#6b7280'};
  color: white;
  padding: 0.75rem 1.5rem;
  border-radius: 0.5rem;
`;

<Button $primary>클릭</Button>
```

### 인증 체크

```typescript
// Protected Route는 자동으로 체크됨
<Route path="/orders" element={
  <ProtectedRoute allowedRoles={['USER']}>
    <OrderPage />
  </ProtectedRoute>
} />

// 컴포넌트 내에서 확인
const { user, isAuthenticated } = useAuthStore();
```

## 빌드 및 배포

### 프로덕션 빌드
```bash
npm run build
```

빌드 결과물은 `dist/` 폴더에 생성됩니다.

### 정적 파일 서버에 배포
```bash
# Nginx 예시
server {
  listen 80;
  server_name your-domain.com;
  root /var/www/flowerable/dist;
  
  location / {
    try_files $uri $uri/ /index.html;
  }
}
```

## 트러블슈팅

### 1. API 연결 안 됨
- `.env` 파일의 `VITE_API_BASE_URL` 확인
- 백엔드 서버가 실행 중인지 확인
- CORS 설정 확인

### 2. 로그인 후 리다이렉트 안 됨
- `localStorage`에 토큰이 저장되는지 확인
- Zustand store가 정상 동작하는지 확인

### 3. 타입 에러
```bash
npm run type-check
```
로 타입 체크 후 수정

## 추가 문서

- [README.md](./README.md) - 전체 개요
- [ARCHITECTURE.md](./ARCHITECTURE.md) - 아키텍처 설명

## 문의

프로젝트 관련 문의는 이슈를 등록해주세요.
