import { lazy } from "react";
import { createBrowserRouter } from "react-router-dom";

import { urls } from "./urls";
import { RootLayout, AuthLayout } from "../layouts";

const HomePage = lazy(() => import('../pages/home-page'));
const CategoriesPage = lazy(() => import('../pages/categories-page'));
const HistoryPage = lazy(() => import('../pages/history-page'));
const CategoryPage = lazy(() => import('../pages/category-page'));
const LoginPage = lazy(() => import('../pages/login-page'));
const RegisterPage = lazy(() => import('../pages/register-page'));

const router = createBrowserRouter([
    {
        element: <RootLayout />,
        children: [
            {
                path: urls.home,
                element: <HomePage />,
            },
            {
                path: urls.categories,
                element: <CategoriesPage />,
            },
            {
                path: urls.categories + '/:categoryId',
                element: <CategoryPage />,
            },
            {
                path: urls.history,
                element: <HistoryPage />,
            },
        ],
    },
    {
        element: <AuthLayout />,
        children: [
            {
                path: urls.login,
                element: <LoginPage />,
            },
            {
                path: urls.register,
                element: <RegisterPage />,
            },
        ],
    },
]);

export default router;