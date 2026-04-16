# Flowerable Frontend

> 꽃 주문 플랫폼 프론트엔드 - Production-Grade React Architecture

---

[flowerable 구경하러 가기](https://flowerable-react.vercel.app/login)

- 테스트 계정 : test@flowerable.com
- 테스트 비밀번호 : t12341234

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

## 🔧 기술 스택

| 영역 | 사용 기술 |
|---|---|
| 언어 / 빌드 | React 18, TypeScript, Vite |
| 라우팅 | React Router v6 |
| 서버 상태 | TanStack Query (React Query) |
| 클라이언트 상태 | Zustand |
| 스타일 | styled-components |
| 폼 | React Hook Form |
| HTTP | Axios |
| 결제 | TossPayments SDK |
| 실시간 알림 | SSE (Server-Sent Events) |

---

## 🔐 인증 흐름

로그인 성공 시 서버에서 `accessToken` / `refreshToken`을 발급받아 저장합니다.  
이후 모든 API 요청은 Axios 인터셉터가 자동으로 토큰을 헤더에 붙여 전송합니다.

```
로그인
  └─ accessToken + refreshToken 저장
       └─ Axios request interceptor → Authorization 헤더 자동 주입
            └─ 401 응답 감지 → refreshToken으로 토큰 재발급
                 ├─ 성공 → 새 토큰으로 원래 요청 재시도 + SSE 재연결
                 └─ 실패 → 로그아웃 처리 후 로그인 페이지로 리다이렉트
```

토큰 재발급 시 SSE 연결도 새 토큰으로 재연결합니다.  
재발급 중 동시에 여러 요청이 들어오면 큐에 쌓아두고 토큰 갱신 완료 후 일괄 처리합니다.

---

## 🛒 주문 · 결제 흐름

TossPayments SDK를 사용한 결제 위젯 방식으로 구현되어 있습니다.

```
장바구니 담기 (Zustand + LocalStorage 동기화)
  └─ 주문서 작성 (배송지, 요청사항 입력)
       └─ TossPayments 결제 위젯 렌더링
            └─ 결제 요청 → TossPayments 결제창
                 ├─ 성공 → /payment/success?paymentKey=...&orderId=...
                 │          └─ 서버 결제 승인 API 호출 (타임아웃 15초)
                 │               └─ 주문 완료 페이지 이동
                 └─ 실패 → /payment/fail
                            └─ 실패 사유 표시 (TossPayments 응답 + Spring 응답 통합)
```

결제 타임아웃은 TossPayments 서버 타임아웃(10초)을 고려해 클라이언트에서 15초로 명시 설정합니다.

---

## 🔔 실시간 알림 흐름

SSE(Server-Sent Events)를 통해 실시간 알림을 수신합니다.

```
로그인 완료
  └─ SSE 연결 수립 (EventSource + accessToken)
       └─ 서버 이벤트 수신 → 알림 목록 업데이트
            └─ 헤더의 읽지 않은 알림 수 실시간 반영
```

토큰 재발급 시 기존 SSE 연결을 닫고 새 토큰으로 재연결합니다.

---

## 🏪 쇼핑 · 꽃집 탐색 흐름

```
메인 페이지
  └─ 꽃집 목록 (위치 기반 또는 전체)
       └─ 꽃집 상세 → 상품 목록
            └─ 상품 상세 → 장바구니 담기 또는 바로 주문
```

꽃집 목록과 상품 데이터는 React Query로 캐싱 관리하며,  
어드민 페이지에서는 꽃집 등록 / 상품 관리 / 주문 처리가 가능합니다.

---

## 🚀 시작하기

```bash
npm install
npm run dev    # 개발 서버 (포트 3000)
npm run build  # 프로덕션 빌드 → dist/
```
