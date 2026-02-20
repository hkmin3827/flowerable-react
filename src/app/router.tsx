import { createBrowserRouter, Navigate } from "react-router-dom";
import { useAuthStore } from "@/features/auth/store";

// Layouts
import { MainLayout } from "./layouts/MainLayout";
import { ShopLayout } from "./layouts/ShopLayout";
import AdminLayout from "./layouts/AdminLayout";

// Pages - Auth
import { LoginPage } from "@/pages/auth/LoginPage";
import { SignupPage } from "@/pages/auth/SignupPage";
import { OAuthCompleteProfile } from "@/pages/auth/OAuthCompleteProfile";

// common

// Pages - User
import { HomePage } from "@/pages/user/HomePage";
import { FlowerListPage } from "@/pages/user/FlowerListPage";
import { ShopListPage } from "@/pages/user/ShopListPage";
import ShopDetailPage from "@/pages/user/ShopDetailPage";
import { OrderPage } from "@/pages/user/OrderPage";
import { CartPage } from "@/pages/user/CartPage";
import UserOrderDetailPage from "@/pages/user/UserOrderDetailPage";
import UserOrderListPage from "@/pages/user/UserOrderListPage";
import { UserProfilePage } from "@/pages/user/UserProfilePage";
import CheckoutPage from "@/pages/user/CheckoutPage";
import CartCheckoutPage from "@/pages/user/CartCheckoutPage";
import PaymentSuccessPage from "@/pages/user/PaymentSuccessPage";
import PaymentFailPage from "@/pages/user/PaymentFailPage";

// Pages - Shop
import { ShopManagePage } from "@/pages/shop/ShopManagePage";
import ShopOrderListPage from "@/pages/shop/ShopOrderListPage";
import { ShopFlowerManagePage } from "@/pages/shop/ShopFlowerManagePage";
import { ShopProfilePage } from "@/pages/shop/ShopProfilePage";
import { ShopFlowersViewPage } from "@/pages/shop/ShopFlowersViewPage";
import { ShopFlowerAddPage } from "@/pages/shop/ShopFlowerAddPage";
import { ShopWrappingPage } from "@/pages/shop/ShopWrappingPage";
import ShopDashboardPage from "@/pages/shop/ShopDashboardPage";

// Pages - Admin
import OAuthCallback from "@/pages/auth/OAuthCallback";
import { ShopManageLayout } from "./layouts/ShopManageLayout";
import ShopOrderDetailPage from "@/pages/shop/ShopOrderDetailPage";
import { ShopPendingHome } from "@/pages/shop/ShopPendingHome";
import AdminAccountManagePage from "@/pages/admin/AdminAccountManagePage";
import AdminShopManagePage from "@/pages/admin/AdminShopManagePage";
import AdminOrderMonitorPage from "@/pages/admin/AdminOrderMonitorPage";
import AdminFlowerManagePage from "@/pages/admin/AdminFlowerManagePage";
import ChatListPage from "@/pages/common/ChatListPage";
import { ShopImagesPage } from "@/pages/shop/ShopImagesPage";
import { ShopImagesViewPage } from "@/pages/user/ShopImagesViewPage";
import { ForgotPasswordPage } from "@/pages/auth/ForgotPasswordPage";
import { ResetPasswordPage } from "@/pages/auth/ResetPasswordPage";

// Protected Route Component
const ProtectedRoute = ({
  children,
  allowedRoles,
}: {
  children: React.ReactNode;
  allowedRoles?: string[];
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
    path: "/login",
    element: <LoginPage />,
  },
  {
    path: "/signup",
    element: <SignupPage />,
  },
  {
    path: "/oauth/callback",
    element: <OAuthCallback />,
  },
  {
    path: "/oauth/complete",
    element: <OAuthCompleteProfile />,
  },
  {
    path: "/find-password",
    element: <ForgotPasswordPage />,
  },
  {
    path: "/reset-password",
    element: <ResetPasswordPage />,
  },

  {
    element: <MainLayout />,
    children: [
      {
        path: "/",
        element: <HomePage />,
      },
      {
        path: "/flowers",
        element: <FlowerListPage />,
      },
      {
        path: "/shops",
        element: <ShopListPage />,
      },
      {
        path: "/shops/:shopId",
        element: <ShopDetailPage />,
      },
      {
        path: "/chats",
        element: <ChatListPage />,
      },
      {
        path: "/shop-images/:shopId",
        element: <ShopImagesViewPage />,
      },
      // User routes
      {
        path: "/order/:shopId",
        element: (
          <ProtectedRoute allowedRoles={["ROLE_USER"]}>
            <OrderPage />
          </ProtectedRoute>
        ),
      },
      {
        path: "/cart",
        element: (
          <ProtectedRoute allowedRoles={["ROLE_USER"]}>
            <CartPage />
          </ProtectedRoute>
        ),
      },
      {
        path: "/checkout/shop/:shopId",
        element: (
          <ProtectedRoute allowedRoles={["ROLE_USER"]}>
            <CheckoutPage />
          </ProtectedRoute>
        ),
      },
      {
        path: "/checkout/cart/:cartItemId",
        element: (
          <ProtectedRoute allowedRoles={["ROLE_USER"]}>
            <CartCheckoutPage />
          </ProtectedRoute>
        ),
      },
      {
        path: "/payment/success",
        element: (
          <ProtectedRoute allowedRoles={["ROLE_USER"]}>
            <PaymentSuccessPage />
          </ProtectedRoute>
        ),
      },
      {
        path: "/payment/fail",
        element: (
          <ProtectedRoute allowedRoles={["ROLE_USER"]}>
            <PaymentFailPage />
          </ProtectedRoute>
        ),
      },
      {
        path: "/orders",
        element: (
          <ProtectedRoute allowedRoles={["ROLE_USER"]}>
            <UserOrderListPage />
          </ProtectedRoute>
        ),
      },
      {
        path: "/orders/:orderId",
        element: (
          <ProtectedRoute allowedRoles={["ROLE_USER"]}>
            <UserOrderDetailPage />
          </ProtectedRoute>
        ),
      },
      {
        path: "/profile",
        element: (
          <ProtectedRoute allowedRoles={["ROLE_USER"]}>
            <UserProfilePage />
          </ProtectedRoute>
        ),
      },
    ],
  },

  // Shop routes
  {
    path: "/shop",
    element: (
      <ProtectedRoute allowedRoles={["ROLE_SHOP"]}>
        <ShopLayout />
      </ProtectedRoute>
    ),
    children: [
      {
        element: <ShopManageLayout />,
        children: [
          {
            path: "manage",
            element: <ShopManagePage />,
          },
          {
            path: "wrapping",
            element: <ShopWrappingPage />,
          },
          {
            path: "flowers/manage",
            element: <ShopFlowerManagePage />,
          },
          {
            path: "images",
            element: <ShopImagesPage />,
          },
        ],
      },
      {
        path: "pending-home",
        element: <ShopPendingHome />,
      },
      {
        path: "dashboard",
        element: <ShopDashboardPage />,
      },
      {
        path: "flowers-view",
        element: <ShopFlowersViewPage />,
      },
      {
        path: "orders",
        element: <ShopOrderListPage />,
      },
      {
        path: "orders/:orderId",
        element: <ShopOrderDetailPage />,
      },
      {
        path: "flowers/add",
        element: <ShopFlowerAddPage />,
      },
      {
        path: "profile",
        element: <ShopProfilePage />,
      },
    ],
  },
  // Admin routes
  {
    path: "/admin",
    element: <AdminLayout />,
    children: [
      {
        index: true,
        element: <AdminAccountManagePage />,
      },
      {
        path: "accounts",
        element: <AdminAccountManagePage />,
      },
      {
        path: "shops",
        element: <AdminShopManagePage />,
      },
      {
        path: "orders",
        element: <AdminOrderMonitorPage />,
      },
      {
        path: "flowers",
        element: <AdminFlowerManagePage />,
      },
    ],
  },
]);
