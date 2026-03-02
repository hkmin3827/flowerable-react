import { createBrowserRouter } from "react-router-dom";

// Layouts
import { MainLayout } from "./layouts/MainLayout/MainLayout";
import { ShopLayout } from "./layouts/ShopLayout/ShopLayout";
import AdminLayout from "./layouts/AdminLayout/AdminLayout";

import { LoginPage } from "@/pages/auth/Login/LoginPage";
import { SignupPage } from "@/pages/auth/Signup/SignupPage";
import { OAuthCompleteProfile } from "@/pages/auth/OAuthCompleteProfile/OAuthCompleteProfile";

// Pages - User
import { HomePage } from "@/pages/user/Home/HomePage";
import { FlowerListPage } from "@/pages/user/FlowerList/FlowerListPage";
import { ShopListPage } from "@/pages/user/ShopList/ShopListPage";
import ShopDetailPage from "@/pages/user/ShopDetail/ShopDetailPage";
import { OrderPage } from "@/pages/user/Order/OrderPage";
import { CartPage } from "@/pages/user/Cart/CartPage";
import UserOrderDetailPage from "@/pages/user/UserOrderDetail/UserOrderDetailPage";
import UserOrderListPage from "@/pages/user/UserOrderList/UserOrderListPage";
import { UserProfilePage } from "@/pages/user/UserProfile/UserProfilePage";
import CheckoutPage from "@/pages/user/Checkout/CheckoutPage";
import CartCheckoutPage from "@/pages/user/CartCheckout/CartCheckoutPage";
import PaymentSuccessPage from "@/pages/user/PaymentSuccess/PaymentSuccessPage";
import PaymentFailPage from "@/pages/user/PaymentFail/PaymentFailPage";

// Pages - Shop
import { ShopManagePage } from "@/pages/shop/ShopManage/ShopManagePage";
import ShopOrderListPage from "@/pages/shop/ShopOrderList/ShopOrderListPage";
import { ShopFlowerManagePage } from "@/pages/shop/ShopFlowerManage/ShopFlowerManagePage";
import { ShopProfilePage } from "@/pages/shop/ShopProfile/ShopProfilePage";
import { ShopFlowersViewPage } from "@/pages/shop/ShopFlowersView/ShopFlowersViewPage";
import { ShopFlowerAddPage } from "@/pages/shop/ShopFlowerAdd/ShopFlowerAddPage";
import { ShopWrappingPage } from "@/pages/shop/ShopWrapping/ShopWrappingPage";
import ShopDashboardPage from "@/pages/shop/ShopDashboard/ShopDashboardPage";

// Pages - Admin
import OAuthCallback from "@/pages/auth/OAuthCallback/OAuthCallback";
import { ShopManageLayout } from "./layouts/ShopManageLayout/ShopManageLayout";
import ShopOrderDetailPage from "@/pages/shop/ShopOrderDetail/ShopOrderDetailPage";
import { ShopPendingHome } from "@/pages/shop/ShopPendingHome/ShopPendingHome";
import AdminAccountManagePage from "@/pages/admin/AdminAccountManage/AdminAccountManagePage";
import AdminShopManagePage from "@/pages/admin/AdminShopManage/AdminShopManagePage";
import AdminOrderMonitorPage from "@/pages/admin/AdminOrderMonitor/AdminOrderMonitorPage";
import AdminFlowerManagePage from "@/pages/admin/AdminFlowerManage/AdminFlowerManagePage";
import ChatListPage from "@/pages/common/ChatListPage";
import { ShopImagesPage } from "@/pages/shop/ShopImages/ShopImagesPage";
import { ShopImagesViewPage } from "@/pages/user/ShopImagesView/ShopImagesViewPage";
import { ForgotPasswordPage } from "@/pages/auth/ForgotPassword/ForgotPasswordPage";
import { ResetPasswordPage } from "@/pages/auth/ResetPassword/ResetPasswordPage";
import { ProtectedRoute } from "./routes/ProtectedRoute";

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
