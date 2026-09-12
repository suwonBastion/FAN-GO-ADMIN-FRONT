import type { ReactNode } from 'react'
import { createBrowserRouter, Navigate } from 'react-router-dom'
import { AdminLayout } from '@/layouts/AdminLayout'
import { DashboardPage } from '@/pages/DashboardPage'
import { EventsPage } from '@/pages/EventsPage'
import { LoginPage } from '@/pages/LoginPage'
import { PlaceholderPage } from '@/pages/PlaceholderPage'
import { PlacesPage } from '@/pages/PlacesPage'
import { UsersPage } from '@/pages/UsersPage'
import { useAuthStore } from '@/store/useAuthStore'

function RequireAuth({ children }: { children: ReactNode }) {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated)
  if (!isAuthenticated) return <Navigate to="/login" replace />
  return children
}

function RedirectIfAuthenticated({ children }: { children: ReactNode }) {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated)
  if (isAuthenticated) return <Navigate to="/" replace />
  return children
}

export const router = createBrowserRouter([
  {
    path: '/login',
    element: (
      <RedirectIfAuthenticated>
        <LoginPage />
      </RedirectIfAuthenticated>
    ),
  },
  {
    path: '/',
    element: (
      <RequireAuth>
        <AdminLayout />
      </RequireAuth>
    ),
    children: [
      { index: true, element: <DashboardPage /> },
      { path: 'users', element: <UsersPage /> },
      { path: 'places', element: <PlacesPage /> },
      { path: 'events', element: <EventsPage /> },
      { path: 'place-score', element: <PlaceholderPage title="장소 스코어" /> },
      { path: 'feedback', element: <PlaceholderPage title="피드백 관리" /> },
      { path: 'partners', element: <PlaceholderPage title="제휴처 관리" /> },
      { path: 'api-status', element: <PlaceholderPage title="외부 API 상태" /> },
    ],
  },
])
