import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import orderApi
import { OrderCreateRequest, OrderStatusChangeRequest } from './types';
import { OrderStatus } from '@/shared/types';

// Query Keys
export const orderKeys = {
  all: ['orders'] as const,
  userOrders: (page: number) => [...orderKeys.all, 'user', page] as const,
  shopOrders: (page: number, status?: OrderStatus) => 
    [...orderKeys.all, 'shop', page, status] as const,
  detail: (orderId: number) => [...orderKeys.all, 'detail', orderId] as const,
};

// 주문 생성
export const useCreateOrder = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: OrderCreateRequest) => orderApi.createOrder(data),
    onSuccess: (order) => {
      queryClient.invalidateQueries({ queryKey: orderKeys.userOrders(0) });
      navigate(`/orders/${order.id}`);
    },
  });
};

// 사용자 주문 목록 조회
export const useUserOrders = (page: number = 0, size: number = 10) => {
  return useQuery({
    queryKey: orderKeys.userOrders(page),
    queryFn: () => orderApi.getUserOrders(page, size),
    staleTime: 1000 * 60, // 1분
  });
};

// 샵 주문 목록 조회
export const useShopOrders = (page: number = 0, size: number = 10, status?: OrderStatus) => {
  return useQuery({
    queryKey: orderKeys.shopOrders(page, status),
    queryFn: () => orderApi.getShopOrders(page, size, status),
    staleTime: 1000 * 30, // 30초
  });
};

// 주문 상세 조회
export const useOrderDetail = (orderId: number) => {
  return useQuery({
    queryKey: orderKeys.detail(orderId),
    queryFn: () => orderApi.getOrderDetail(orderId),
    enabled: !!orderId,
  });
};

// 주문 상태 변경
export const useUpdateOrderStatus = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ orderId, data }: { orderId: number; data: OrderStatusChangeRequest }) =>
      orderApi.updateOrderStatus(orderId, data),
    onSuccess: (_, { orderId }) => {
      queryClient.invalidateQueries({ queryKey: orderKeys.detail(orderId) });
      queryClient.invalidateQueries({ queryKey: orderKeys.all });
    },
  });
};

// 주문 취소
export const useCancelOrder = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ orderId, reason }: { orderId: number; reason: string }) =>
      orderApi.cancelOrder(orderId, reason),
    onSuccess: (_, { orderId }) => {
      queryClient.invalidateQueries({ queryKey: orderKeys.detail(orderId) });
      queryClient.invalidateQueries({ queryKey: orderKeys.all });
    },
  });
};
