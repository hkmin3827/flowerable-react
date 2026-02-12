import { createBrowserRouter, Navigate } from "react-router-dom";
import { useAuthStore } from "@/features/auth/store";

// Layouts
import { MainLayout } from "./layouts/MainLayout";
import { ShopLayout } from "./layouts/ShopLayout";
import { AdminLayout } from "./layouts/AdminLayout";

// Pages - Auth
import { LoginPage } from "@/pages/auth/LoginPage";
import { SignupPage } from "@/pages/auth/SignupPage";
import { OAuthCompleteProfile } from "@/pages/auth/OAuthCompleteProfile";

// common
import ChatListPage from "@/pages/common/ChatListPage";

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
import { AdminDashboardPage } from "@/pages/admin/AdminDashboardPage";
import OAuthCallback from "@/pages/auth/OAuthCallback";
import { ShopManageLayout } from "./layouts/ShopManageLayout";
import ShopOrderDetailPage from "@/pages/shop/ShopOrderDetailPage";
import { ShopPendingHome } from "@/pages/shop/ShopPendingHome";

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
    element: (
      <ProtectedRoute allowedRoles={["ROLE_ADMIN"]}>
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
