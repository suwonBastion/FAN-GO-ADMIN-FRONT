import { LayoutDashboard, LogOut, Users } from 'lucide-react'
import { useEffect, useState } from 'react'
import { NavLink, Outlet, useNavigate } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { useAuthStore } from '@/store/useAuthStore'

const navItems = [
  { to: '/', label: '대시보드', icon: LayoutDashboard },
  { to: '/users', label: '사용자 관리', icon: Users },
]

function useClock() {
  const [now, setNow] = useState(() => new Date())

  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 30_000)
    return () => clearInterval(id)
  }, [])

  return now
}

function formatKst(date: Date) {
  const parts = new Intl.DateTimeFormat('en-CA', {
    timeZone: 'Asia/Seoul',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  }).formatToParts(date)
  const get = (type: string) => parts.find((part) => part.type === type)?.value ?? ''
  return `${get('year')}.${get('month')}.${get('day')} ${get('hour')}:${get('minute')} KST`
}

function AdminTopBar() {
  const user = useAuthStore((state) => state.user)
  const now = useClock()

  return (
    <header className="flex h-10 shrink-0 items-center gap-3.5 bg-[#130f26] px-5 text-white">
      <span className="text-xs font-bold tracking-[1.92px]">KTP ADMIN</span>
      <div className="flex flex-1 justify-end gap-4">
        <span className="text-[11px] opacity-80">운영 · {user?.email ?? '-'}</span>
        <span className="text-[11px] opacity-55">{formatKst(now)}</span>
      </div>
    </header>
  )
}

export function AdminLayout() {
  const logout = useAuthStore((state) => state.logout)
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/login', { replace: true })
  }

  return (
    <div className="flex min-h-screen flex-col">
      <AdminTopBar />
      <div className="flex flex-1 overflow-hidden">
        <aside className="flex w-60 flex-col border-r bg-card">
          <div className="flex h-14 items-center border-b px-4 font-semibold">
            FAN:GO Admin
          </div>
          <nav className="flex-1 space-y-1 p-2">
            {navItems.map(({ to, label, icon: Icon }) => (
              <NavLink
                key={to}
                to={to}
                end={to === '/'}
                className={({ isActive }) =>
                  cn(
                    'flex items-center gap-2 rounded-md px-3 py-2 text-sm transition-colors hover:bg-accent',
                    isActive && 'bg-accent font-medium',
                  )
                }
              >
                <Icon className="size-4" />
                {label}
              </NavLink>
            ))}
          </nav>
          <div className="border-t p-2">
            <Button variant="ghost" className="w-full justify-start gap-2" onClick={handleLogout}>
              <LogOut className="size-4" />
              로그아웃
            </Button>
          </div>
        </aside>
        <main className="flex-1 overflow-auto p-6">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
