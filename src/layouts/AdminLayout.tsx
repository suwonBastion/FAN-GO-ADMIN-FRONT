import { LogOut } from 'lucide-react'
import { useEffect, useState } from 'react'
import { NavLink, Outlet, useNavigate } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { useAuthStore } from '@/store/useAuthStore'

interface NavItem {
  code: string
  label: string
  to: string
  badge?: string
}

interface NavGroup {
  label: string
  items: NavItem[]
}

const navGroups: NavGroup[] = [
  {
    label: '운영',
    items: [
      { code: 'AD-01', label: '대시보드', to: '/' },
      { code: 'AD-02', label: '통합 데이터', to: '/places' },
      { code: 'AD-09', label: '회원 · 권한', to: '/users' },
    ],
  },
  {
    label: '모델 · 품질',
    items: [
      { code: 'AD-05', label: '장소 스코어', to: '/place-score', badge: '보류' },
      { code: 'AD-07', label: '피드백 관리', to: '/feedback' },
    ],
  },
  {
    label: '제휴 · 인프라',
    items: [{ code: 'AD-08', label: '외부 API 상태', to: '/api-status' }],
  },
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

function AdminSidebar({ onLogout }: { onLogout: () => void }) {
  return (
    <aside className="flex w-[200px] shrink-0 flex-col justify-between bg-[#130f26] py-2.5 text-white">
      <nav className="flex flex-col">
        {navGroups.map((group) => (
          <div key={group.label}>
            <div className="px-[17px] pt-[17px] pb-2.5 text-[9px] font-semibold tracking-[1.44px] text-white/40 uppercase">
              {group.label}
            </div>
            <div className="flex flex-col gap-px px-2">
              {group.items.map(({ code, label, to, badge }) => (
                <NavLink
                  key={to}
                  to={to}
                  end={to === '/'}
                  className={({ isActive }) =>
                    cn(
                      'flex items-center gap-2 rounded-xl px-3.5 py-2.5 transition-colors hover:bg-white/10',
                      isActive ? 'bg-[#6d57fc]' : 'text-white/70',
                    )
                  }
                >
                  {({ isActive }) => (
                    <>
                      <span
                        className={cn(
                          'w-[34px] shrink-0 text-[9.5px]',
                          isActive ? 'text-white/75' : 'text-white/55',
                        )}
                      >
                        {code}
                      </span>
                      <span className={cn('text-xs', isActive ? 'text-white' : 'text-white/70')}>
                        {label}
                      </span>
                      {badge && (
                        <span className="text-[9px] text-white/50">{badge}</span>
                      )}
                    </>
                  )}
                </NavLink>
              ))}
            </div>
          </div>
        ))}
      </nav>
      <div className="border-t border-white/10 px-2 pt-3.5">
        <Button
          variant="ghost"
          className="w-full justify-start gap-2 text-white/70 hover:bg-white/10 hover:text-white"
          onClick={onLogout}
        >
          <LogOut className="size-4" />
          로그아웃
        </Button>
      </div>
    </aside>
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
        <AdminSidebar onLogout={handleLogout} />
        <main className="flex-1 overflow-auto bg-background">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
