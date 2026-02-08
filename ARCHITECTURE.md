# 🏛️ 아키텍처 설계 근거

## 왜 이렇게 설계했는가?

### 1. Feature-Sliced Design 변형

```
features/auth/
├── api.ts              # Data Access Layer
├── hooks.ts            # Business Logic Layer  
├── store.ts            # Client State (필요시)
├── types.ts            # Domain Types
└── components.tsx      # Presentation Layer
```

**이유:**
- 백엔드의 Controller → Service → Repository 패턴과 유사
- 도메인별로 응집도를 높여 확장성 확보
- 파일 개수를 적절히 유지 (과도한 분리 방지)

### 2. API 레이어 분리

```typescript
// ❌ 컴포넌트에서 직접 호출
const { data } = useQuery(['user'], () => 
  axios.get('/api/users/me')
);

// ✅ API 레이어 분리
const { data } = useMe();  // hooks에서 정의된 훅 사용
```

**이유:**
- API 변경 시 한 곳만 수정
- 테스트 용이성 증가
- 타입 안전성 확보

### 3. React Query + Zustand 조합

**React Query:** 서버 상태 관리
- 캐싱, 리페칭, 동기화 자동 처리
- 보일러플레이트 최소화

**Zustand:** 클라이언트 상태 관리
- 인증 상태 (전역 접근 필요)
- 장바구니 (LocalStorage 동기화)

**Redux를 쓰지 않는 이유:**
- 보일러플레이트가 과도함
- 서버 상태는 React Query로 충분
- Zustand가 더 가볍고 직관적

### 4. 타입 분리 전략

```typescript
// API Response (백엔드 응답 그대로)
interface OrderResponse {
  id: number;
  createdAt: string;  // ISO string
}

// Domain Model (UI에서 사용)
interface Order {
  id: number;
  createdAt: Date;    // Date 객체
}
```

**이유:**
- 백엔드 스펙 변경에 유연하게 대응
- UI에 최적화된 타입 사용
- 데이터 변환 로직을 명확히 분리

## 실무에서 확장하는 방법

### 1. 새 도메인 추가

```bash
# 1. Feature 폴더 생성
mkdir src/features/review

# 2. 파일 생성
touch src/features/review/{api,hooks,types,components}.ts

# 3. 구조 복제
cp src/features/auth/api.ts src/features/review/api.ts
# (내용 수정)
```

### 2. 공통 컴포넌트 추가

```typescript
// shared/ui/Button.tsx
export const Button = ({ children, ...props }) => {
  return <StyledButton {...props}>{children}</StyledButton>;
};

// 사용
import { Button } from '@/shared/ui/Button';
```

### 3. 공통 훅 추가

```typescript
// shared/hooks/useDebounce.ts
export const useDebounce = (value, delay) => {
  // ...
};

// 사용
import { useDebounce } from '@/shared/hooks/useDebounce';
```

## 흔한 안티패턴

### ❌ 1. 페이지에 비즈니스 로직

```typescript
// pages/OrderPage.tsx
const OrderPage = () => {
  const [orders, setOrders] = useState([]);
  
  useEffect(() => {
    axios.get('/api/orders').then(res => {
      setOrders(res.data.content);  // ❌
    });
  }, []);
};
```

**해결:**
```typescript
// features/order/hooks.ts
export const useOrders = () => {
  return useQuery({
    queryKey: ['orders'],
    queryFn: () => orderApi.getOrders()
  });
};

// pages/OrderPage.tsx
const OrderPage = () => {
  const { data: orders } = useOrders();  // ✅
};
```

### ❌ 2. Zustand에 서버 상태 저장

```typescript
// store.ts
interface State {
  orders: Order[];  // ❌ 서버 데이터
  setOrders: (orders: Order[]) => void;
}
```

**해결:**
```typescript
// React Query로 처리
const { data: orders } = useQuery(['orders'], orderApi.getOrders);
```

### ❌ 3. 컴포넌트에서 데이터 가공

```typescript
const OrderList = () => {
  const { data } = useOrders();
  
  // ❌ 컴포넌트에서 비즈니스 로직
  const totalPrice = data?.reduce((sum, order) => 
    sum + order.totalPrice, 0
  );
};
```

**해결:**
```typescript
// hooks.ts
export const useOrderSummary = () => {
  const { data: orders } = useOrders();
  
  return useMemo(() => ({
    totalPrice: orders?.reduce((sum, order) => 
      sum + order.totalPrice, 0
    ) ?? 0
  }), [orders]);
};

// Component
const OrderList = () => {
  const { totalPrice } = useOrderSummary();  // ✅
};
```

## 성능 최적화 전략

### 1. React Query 캐싱 활용

```typescript
export const orderKeys = {
  all: ['orders'] as const,
  lists: () => [...orderKeys.all, 'list'] as const,
  list: (filters: string) => [...orderKeys.lists(), { filters }] as const,
  details: () => [...orderKeys.all, 'detail'] as const,
  detail: (id: number) => [...orderKeys.details(), id] as const,
};

// 사용
const { data } = useQuery({
  queryKey: orderKeys.detail(orderId),
  queryFn: () => orderApi.getDetail(orderId),
  staleTime: 5000  // 5초간 캐시 유지
});
```

### 2. 코드 스플리팅

```typescript
// router.tsx
const AdminPage = lazy(() => import('@/pages/admin/AdminPage'));

<Route path="/admin" element={
  <Suspense fallback={<Loading />}>
    <AdminPage />
  </Suspense>
} />
```

### 3. 불필요한 리렌더링 방지

```typescript
// ❌ 매번 새 객체 생성
const config = { page: 1, size: 10 };

// ✅ useMemo 사용
const config = useMemo(() => ({ page: 1, size: 10 }), []);
```

## 테스트 전략

### 1. API 함수 테스트
```typescript
// api.test.ts
describe('orderApi', () => {
  it('should create order', async () => {
    const order = await orderApi.create(mockOrderRequest);
    expect(order.id).toBeDefined();
  });
});
```

### 2. 훅 테스트
```typescript
// hooks.test.ts
import { renderHook } from '@testing-library/react-hooks';

describe('useOrders', () => {
  it('should fetch orders', async () => {
    const { result, waitFor } = renderHook(() => useOrders());
    await waitFor(() => result.current.isSuccess);
    expect(result.current.data).toBeDefined();
  });
});
```

## 마이그레이션 가이드

### 기존 프로젝트에서 이 구조로 전환

1. **Step 1: API 레이어 분리**
   - `features/{domain}/api.ts` 생성
   - 기존 axios 호출을 API 함수로 이동

2. **Step 2: React Query 도입**
   - `features/{domain}/hooks.ts` 생성
   - useState → useQuery 전환

3. **Step 3: 타입 정의**
   - `features/{domain}/types.ts` 생성
   - Request/Response 타입 분리

4. **Step 4: 점진적 리팩토링**
   - 페이지별로 하나씩 전환
   - 레거시 코드와 공존 가능

## 결론

이 아키텍처는:
- ✅ **확장 가능**: 도메인 추가가 쉬움
- ✅ **유지보수 용이**: 레이어가 명확히 분리
- ✅ **테스트 가능**: 각 레이어를 독립적으로 테스트
- ✅ **실무 적용 가능**: 즉시 프로덕션에 사용 가능

**토이 프로젝트가 아닌, 실제 서비스에서 욕먹지 않을 구조입니다.**
