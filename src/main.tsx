import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import Layout from '@/layout'
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";
import BookPage from 'pages/client/book.tsx';
import AboutPage from 'pages/client/about.tsx';
import LoginPage from 'pages/client/auth/login.tsx';
import RegisterPage from 'pages/client/auth/register.tsx';
import 'styles/global.scss'
import HomePage from 'pages/client/home';
import { App, ConfigProvider } from 'antd';
import { AppProvider } from 'components/context/app.context';
import ProtectedRoute from '@/components/auth';
import DashBoardPage from './pages/admin/dashboard';
import ManageBookPage from './pages/admin/manage.book';
import ManageOrderPage from './pages/admin/manage.order';
import ManageUserPage from './pages/admin/manage.user';
import LayoutAdmin from './components/layout/layout.admin';
import enUS from 'antd/locale/en_US';
import OrderPage from './pages/client/order';

const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    children: [
      {
        index: true, element: <HomePage />,
      },
      {
        path: "/book/:id",
        element: <BookPage />,
      },
      {
        path: "/order",
        element: <OrderPage />
      },
      {
        path: "/about",
        element: <AboutPage />,
      },
      {
        path: "/checkout",
        element: (
          <ProtectedRoute>
            <div>Checkout page</div>
          </ProtectedRoute>
        ),
      },
    ]
  },
  {
    path: "/admin",
    element: <LayoutAdmin />,
    children: [
      {
        index: true,
        element: (
          <ProtectedRoute>
            <DashBoardPage />
          </ProtectedRoute>
        )
      },
      {
        path: "book",
        element: (
          <ProtectedRoute>
            <ManageBookPage />
          </ProtectedRoute>
        )
      },
      {
        path: "order",
        element: (
          <ProtectedRoute>
            <ManageOrderPage />
          </ProtectedRoute>
        )
      },
      {
        path: "user",
        element: (
          <ProtectedRoute>
            <ManageUserPage />
          </ProtectedRoute>
        )
      }
    ]
  },
  {
    path: "/login",
    element: <LoginPage />,
  },
  {
    path: "/register",
    element: <RegisterPage />,
  },
]);

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    {/* <Layout /> */}
    <App>
      <AppProvider>
        <ConfigProvider locale={enUS}>
          <RouterProvider router={router}></RouterProvider>
        </ConfigProvider>
      </AppProvider>
    </App>
  </StrictMode>,
)
