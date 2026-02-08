import { createBrowserRouter, Navigate } from 'react-router-dom';
import { useAuthStore } from '@/features/auth/store';

// Layouts
import { MainLayout } from './layouts/MainLayout';
import { ShopLayout } from './layouts/ShopLayout';
import { AdminLayout } from './layouts/AdminLayout';

// Pages - Auth
import { LoginPage } from '@/pages/auth/LoginPage';
import { SignupPage } from '@/pages/auth/SignupPage';

// Pages - User
import { HomePage } from '@/pages/user/HomePage';
import { FlowerListPage } from '@/pages/user/FlowerListPage';
import { ShopListPage } from '@/pages/user/ShopListPage';
import { ShopDetailPage } from '@/pages/user/ShopDetailPage';
import { CartPage } from '@/pages/user/CartPage';
import { OrderListPage } from '@/pages/user/OrderListPage';
import { OrderDetailPage } from '@/pages/user/OrderDetailPage';
import { UserProfilePage } from '@/pages/user/UserProfilePage';

// Pages - Shop
import { ShopDashboardPage } from '@/pages/shop/ShopDashboardPage';
import { ShopOrderListPage } from '@/pages/shop/ShopOrderListPage';
import { ShopFlowerManagePage } from '@/pages/shop/ShopFlowerManagePage';
import { ShopProfilePage } from '@/pages/shop/ShopProfilePage';

// Pages - Admin
import { AdminDashboardPage } from '@/pages/admin/AdminDashboardPage';

// Protected Route Component
const ProtectedRoute = ({ children, allowedRoles }: { 
  children: React.ReactNode; 
  allowedRoles?: string[] 
}) => {
  const { isAuthenticated, user } = useAuthStore();
  
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  
  if (allowedRoles && user && !allowedRoles.includes(user.role)) {
    return <Navigate to="/" replace />;
  }
  
  return <>{children}</>;
};

export const router = createBrowserRouter([
  // Public routes
  {
    path: '/login',
    element: <LoginPage />,
  },
  {
    path: '/signup',
    element: <SignupPage />,
  },

  // User routes
  {
    element: <MainLayout />,
    children: [
      {
        path: '/',
        element: <HomePage />,
      },
      {
        path: '/flowers',
        element: <FlowerListPage />,
      },
      {
        path: '/shops',
        element: <ShopListPage />,
      },
      {
        path: '/shops/:shopId',
        element: <ShopDetailPage />,
      },
      {
        path: '/cart',
        element: (
          <ProtectedRoute allowedRoles={['USER']}>
            <CartPage />
          </ProtectedRoute>
        ),
      },
      {
        path: '/orders',
        element: (
          <ProtectedRoute allowedRoles={['USER']}>
            <OrderListPage />
          </ProtectedRoute>
        ),
      },
      {
        path: '/orders/:orderId',
        element: (
          <ProtectedRoute allowedRoles={['USER']}>
            <OrderDetailPage />
          </ProtectedRoute>
        ),
      },
      {
        path: '/profile',
        element: (
          <ProtectedRoute allowedRoles={['USER']}>
            <UserProfilePage />
          </ProtectedRoute>
        ),
      },
    ],
  },

  // Shop routes
  {
    path: '/shop',
    element: (
      <ProtectedRoute allowedRoles={['SHOP']}>
        <ShopLayout />
      </ProtectedRoute>
    ),
    children: [
      {
        path: 'dashboard',
        element: <ShopDashboardPage />,
      },
      {
        path: 'orders',
        element: <ShopOrderListPage />,
      },
      {
        path: 'flowers',
        element: <ShopFlowerManagePage />,
      },
      {
        path: 'profile',
        element: <ShopProfilePage />,
      },
    ],
  },

  // Admin routes
  {
    path: '/admin',
    element: (
      <ProtectedRoute allowedRoles={['ADMIN']}>
        <AdminLayout />
      </ProtectedRoute>
    ),
    children: [
      {
        index: true,
        element: <AdminDashboardPage />,
      },
    ],
  },
]);
