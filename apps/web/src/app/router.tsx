import { lazy, Suspense } from 'react';
import { createBrowserRouter, Navigate } from 'react-router';
import { RedirectIfAuthenticated, RequireAdmin, RequireAuth } from '../features/auth/guards';
import { LoginPage } from '../features/auth/LoginPage';
import { AnalysisPage } from '../features/analysis/AnalysisPage';
import { AppLayout } from '../shared/layout/AppLayout';

// Painel admin é carregado sob demanda: alunos nunca baixam esse código.
const AdminPage = lazy(() => import('../features/admin/AdminPage'));

export const router = createBrowserRouter([
  {
    element: <RedirectIfAuthenticated />,
    children: [{ path: '/login', element: <LoginPage /> }],
  },
  {
    element: <RequireAuth />,
    children: [
      {
        element: <AppLayout />,
        children: [
          { index: true, element: <AnalysisPage /> },
          {
            element: <RequireAdmin />,
            children: [
              {
                path: '/admin',
                element: (
                  <Suspense fallback={null}>
                    <AdminPage />
                  </Suspense>
                ),
              },
            ],
          },
        ],
      },
    ],
  },
  { path: '*', element: <Navigate to="/" replace /> },
]);
