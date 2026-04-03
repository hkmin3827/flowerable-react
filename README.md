# Flowerable Frontend

> 꽃 주문 플랫폼 프론트엔드 - Production-Grade React Architecture

---
## 🏗️ 아키텍처 철학

이 프로젝트는 **실무 프론트엔드 아키텍처**를 목표로 설계되었습니다.
백엔드의 Controller → Service → Repository 레이어 분리를 프론트엔드에 맞게 적용했습니다.

```
Presentation Layer (Pages/Components)
    ↓
Business Logic Layer (Hooks)
    ↓
Data Access Layer (API Functions)
```

## 📁 프로젝트 구조

```
src/
├── app/                    # 앱 초기 설정
│   ├── App.tsx            # 메인 App 컴포넌트
│   ├── router.tsx         # 라우팅 설정
│   └── layouts/           # 레이아웃 (Main, Shop, Admin)
│
├── pages/                 # 페이지 컴포넌트 (로직 최소화)
│   ├── auth/
│   ├── user/
│   ├── shop/
│   └── admin/
│
├── features/              # 도메인 단위 기능
│   ├── auth/
│   │   ├── api.ts         # API 호출 함수
│   │   ├── hooks.ts       # React Query hooks
│   │   ├── store.ts       # Zustand store (필요시)
│   │   ├── types.ts       # 도메인 타입
│   │   └── components.tsx # 도메인 UI 컴포넌트
│   │
│   ├── order/
│   ├── shop/
│   └── flower/
│
└── shared/                # 공통 모듈
    ├── api/               # Axios instance
    ├── ui/                # 공통 UI 컴포넌트
    ├── hooks/             # 공통 커스텀 훅
    ├── utils/             # 유틸 함수
    ├── types/             # 공통 타입
    └── constants/         # 상수
```

## 🎯 핵심 설계 원칙

### 1. **레이어 분리 엄수**

```typescript
// ❌ Bad - 페이지에서 API 직접 호출
const UserPage = () => {
  const [data, setData] = useState(null);

  useEffect(() => {
    axios.get("/api/users/me").then((res) => setData(res.data));
  }, []);
};

// ✅ Good - 레이어 분리
// features/user/api.ts
export const userApi = {
  getMe: () => apiClient.get("/users/me"),
};

// features/user/hooks.ts
export const useMe = () => {
  return useQuery({
    queryKey: ["user", "me"],
    queryFn: userApi.getMe,
  });
};

// pages/UserPage.tsx
const UserPage = () => {
  const { data } = useMe();
  // ...
};
```

### 2. **타입 명확히 분리**

```typescript
// types.ts
// API 응답 타입 (서버 스펙 그대로)
export interface UserResponse {
  id: number;
  email: string;
  createdAt: string; // ISO string
}

// UI에서 사용하는 도메인 타입
export interface User {
  id: number;
  email: string;
  createdAt: Date; // Date 객체로 변환
}
```

### 3. **Zustand는 필요할 때만**

전역 상태가 진짜 필요한 경우에만 사용:

- 인증 상태 (여러 곳에서 접근)
- 장바구니 (LocalStorage 동기화 필요)

**서버 상태는 React Query로 관리**하므로 Zustand에 중복 저장하지 않습니다.

### 4. **API 함수는 순수하게**

```typescript
// ✅ API 함수는 response.data만 반환
export const orderApi = {
  create: (data: OrderRequest) =>
    apiClient.post<OrderResponse>("/orders", data),
};

// ❌ API 함수에서 부가 작업 금지
export const orderApi = {
  create: (data: OrderRequest) => {
    const res = apiClient.post("/orders", data);
    toast.success("주문 완료"); // ❌
    return res;
  },
};
```

## 🔧 기술 스택

- **React 18** + **TypeScript**
- **Vite** (빌드 도구)
- **React Router v6** (라우팅)
- **TanStack Query** (서버 상태 관리)
- **Zustand** (클라이언트 상태 관리)
- **styled-components** (CSS-in-JS)
- **React Hook Form** (폼 관리)
- **Axios** (HTTP 클라이언트)

## 🚀 시작하기

### 설치

```bash
npm install
```

### 개발 서버 실행

```bash
npm run dev
```

### 빌드

```bash
npm run build
```

### 타입 체크

```bash
npm run type-check
```

## 📝 컨벤션

### 파일 명명

- 컴포넌트: PascalCase (예: `LoginForm.tsx`)
- 훅/유틸: camelCase (예: `useAuth.ts`, `formatDate.ts`)
- 타입 파일: `types.ts`

### Import 순서

```typescript
// 1. React 관련
import { useState } from "react";
// 2. 외부 라이브러리
import { useQuery } from "@tanstack/react-query";
// 3. 내부 모듈
import { userApi } from "./api";
// 4. 타입
import { User } from "./types";
```

### 컴포넌트 구조

```typescript
// 1. Import
import { ... } from '...';

// 2. Types
interface Props { ... }

// 3. Component
export const MyComponent = ({ ... }: Props) => {
  // 3-1. Hooks
  const navigate = useNavigate();
  const { data } = useQuery(...);

  // 3-2. State
  const [state, setState] = useState();

  // 3-3. Handlers
  const handleClick = () => { ... };

  // 3-4. Render
  return <div>...</div>;
};

// 4. Styled Components
const Container = styled.div`...`;
```

## 🗂️ Feature 구조 예시

```
features/order/
├── api.ts              # API 호출 함수
├── hooks.ts            # React Query hooks
├── store.ts            # 장바구니 상태 (Zustand)
├── types.ts            # 주문 관련 타입
└── components.tsx      # 주문 관련 UI 컴포넌트
```

## ⚠️ 주의사항

### ❌ 금지 사항

1. **페이지에서 API 직접 호출 금지**
2. **컴포넌트에서 비즈니스 로직 작성 금지**
3. **API 응답을 그대로 UI에 노출 금지** (타입 변환 필요)
4. **전역 상태 남발 금지** (서버 상태는 React Query)
5. **파일을 과도하게 분리하지 말 것** (도메인 단위로 응집)

### ✅ 권장 사항

1. **API 함수는 feature/{domain}/api.ts에만 작성**
2. **React Query 훅은 feature/{domain}/hooks.ts에만 작성**
3. **비즈니스 로직은 커스텀 훅으로 추출**
4. **타입은 명확히 분리** (API Response vs Domain Model)
5. **에러 처리는 React Query의 onError 활용**

## 🎨 스타일링 가이드

styled-components 사용 시:

```typescript
// ✅ Props는 $prefix 사용
const Button = styled.button<{ $primary?: boolean }>`
  background: ${({ $primary }) => $primary ? 'blue' : 'gray'};
`;

// ✅ 테마 색상은 변수로 분리
const colors = {
  primary: '#3b82f6',
  gray: '#6b7280',
};

// ❌ 인라인 스타일 지양
<div style={{ color: 'red' }}>Text</div>
```

## 🔐 인증 플로우

1. 로그인 → `accessToken`, `refreshToken` 저장
2. Axios interceptor에서 자동으로 토큰 첨부
3. 401 응답 시 자동 리프레시 시도
4. 리프레시 실패 시 로그인 페이지로 리다이렉트

## 📦 배포

```bash
# 프로덕션 빌드
npm run build

# 빌드 결과는 dist/ 폴더에 생성됨
```

## 🤝 기여 가이드

1. feature 브랜치 생성
2. 레이어 분리 원칙 준수
3. ESLint 규칙 통과
4. 타입 체크 통과
5. PR 생성

## 📚 참고 자료

- [React Query 공식 문서](https://tanstack.com/query/latest)
- [Zustand 공식 문서](https://github.com/pmndrs/zustand)
- [React Router 공식 문서](https://reactrouter.com/)
- [styled-components 공식 문서](https://styled-components.com/)

---

**이 구조는 실무에서 바로 사용 가능한 프로덕션 레벨의 아키텍처입니다.**
