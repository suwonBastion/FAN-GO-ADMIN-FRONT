import { useQuery } from '@tanstack/react-query'
import { useState } from 'react'
import { api } from '@/lib/api'
import { cn } from '@/lib/utils'

const periods = ['7일', '30일', '전체'] as const
type Period = (typeof periods)[number]

const periodToDays: Record<Period, number | undefined> = {
  '7일': 7,
  '30일': 30,
  전체: undefined,
}

interface DashboardResponse {
  total_users?: number
  new_users_period?: number
  total_routes?: number
  new_routes_period?: number
  avg_satisfaction?: number | null
  response_count?: number
  daily_routes?: { date: string; count: number }[]
}

const fandomShares = [
  { label: 'BTS', percent: 38, highlight: true },
  { label: 'SEVENTEEN', percent: 24, highlight: false },
  { label: 'BLACKPINK', percent: 22, highlight: false },
]

function formatDay(date: string) {
  const day = date.split('-')[2]
  return day ? String(Number(day)) : date
}

export function DashboardPage() {
  const [period, setPeriod] = useState<Period>('7일')

  const { data, isLoading, isError } = useQuery({
    queryKey: ['dashboard', period],
    queryFn: async () => {
      const { data } = await api.get<DashboardResponse>('/adminlogin/dashboard', {
        params: { route_one_day: periodToDays[period] },
      })
      return data
    },
  })

  const kpis = data
    ? [
        {
          label: '누적 가입자',
          value: (data.total_users ?? 0).toLocaleString(),
          delta: `+${data.new_users_period ?? 0} / 7일`,
          tone: 'delta' as const,
        },
        {
          label: '생성 동선',
          value: (data.total_routes ?? 0).toLocaleString(),
          delta: `+${data.new_routes_period ?? 0} / 7일`,
          tone: 'delta' as const,
        },
        {
          label: '피드백 만족도',
          value: data.avg_satisfaction != null ? data.avg_satisfaction.toFixed(2) : '-',
          delta: `응답 ${(data.response_count ?? 0).toLocaleString()}건`,
          tone: 'muted' as const,
        },
      ]
    : []

  const dailyRoutes = data?.daily_routes ?? []
  const maxCount = Math.max(1, ...dailyRoutes.map((d) => d.count))

  return (
    <div className="flex h-full flex-col">
      <div className="flex items-end justify-between border-b border-[#e8e4ff] px-[22px] pt-4 pb-3.5">
        <div className="space-y-1">
          <p className="text-[10px] font-semibold tracking-[1.4px] text-[#6d57fc]">
            AD-01 / DASHBOARD
          </p>
          <h1 className="text-2xl font-bold tracking-[-0.36px] text-[#201e1d]">대시보드</h1>
        </div>
        <div className="flex overflow-hidden rounded-none border border-[rgba(32,30,29,0.4)]">
          {periods.map((p) => (
            <button
              key={p}
              type="button"
              onClick={() => setPeriod(p)}
              className={cn(
                'border-l border-[rgba(32,30,29,0.4)] px-3 py-1.5 text-[13px] first:border-l-0',
                period === p ? 'bg-[#6d57fc] text-white' : 'text-[#201e1d] hover:bg-muted',
              )}
            >
              {p}
            </button>
          ))}
        </div>
      </div>

      <div className="flex h-[99px] border-b border-[#e8e4ff] pl-1.5">
        {isError && (
          <p className="px-4 py-3.5 text-[13px] text-[#ae1800]">
            대시보드 통계를 불러오지 못했습니다.
          </p>
        )}
        {!isError &&
          (isLoading
            ? Array.from({ length: 3 }).map((_, index) => (
                <div
                  key={index}
                  className="w-[196px] shrink-0 space-y-0.5 border-r border-[#e8e4ff] px-4 py-3.5"
                >
                  <p className="text-[9.5px] font-semibold tracking-[1.14px] text-[rgba(27,22,63,0.5)]">
                    불러오는 중...
                  </p>
                </div>
              ))
            : kpis.map((kpi) => (
                <div
                  key={kpi.label}
                  className="w-[196px] shrink-0 space-y-0.5 border-r border-[#e8e4ff] px-4 py-3.5"
                >
                  <p className="text-[9.5px] font-semibold tracking-[1.14px] text-[rgba(27,22,63,0.5)]">
                    {kpi.label}
                  </p>
                  <p className="pt-1 text-3xl font-bold text-[#201e1d]">{kpi.value}</p>
                  <p
                    className={cn(
                      'text-[11px]',
                      kpi.tone === 'delta' ? 'text-[#ae1800]' : 'text-[rgba(27,22,63,0.5)]',
                    )}
                  >
                    {kpi.delta}
                  </p>
                </div>
              )))}
      </div>

      <div className="flex flex-1 flex-col lg:flex-row">
        <div className="flex-1 border-r-2 border-[rgba(32,30,29,0.4)] px-[22px] py-[18px]">
          <div className="flex items-baseline gap-2.5">
            <h2 className="text-sm font-semibold tracking-[-0.21px] text-[#201e1d]">
              일별 동선 생성
            </h2>
            <span className="text-[11px] text-[rgba(27,22,63,0.5)]">최근 7일</span>
          </div>
          <div className="flex h-[300px] items-end justify-center gap-2 pt-4">
            {dailyRoutes.map(({ date, count }) => (
              <div key={date} className="flex h-full w-9 flex-col items-center justify-end gap-1.5">
                <div
                  className="w-full rounded-t-sm bg-[#0c0a1c]"
                  style={{ height: `${Math.max(2, (count / maxCount) * 100)}%` }}
                />
                <span className="text-[9px] text-[rgba(27,22,63,0.45)]">{formatDay(date)}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="w-full space-y-2.5 px-5 py-[18px] lg:w-80">
          <h2 className="text-sm font-semibold tracking-[-0.21px] text-[#201e1d]">
            팬덤별 동선 비중
          </h2>
          <div className="space-y-2">
            {fandomShares.map(({ label, percent, highlight }) => (
              <div key={label} className="space-y-1">
                <div className="flex items-baseline justify-between text-[11.5px]">
                  <span className="text-[#201e1d]">{label}</span>
                  <span className="font-semibold text-[#201e1d]">{percent}%</span>
                </div>
                <div className="h-2 w-full bg-[rgba(27,22,63,0.14)]">
                  <div
                    className={cn('h-full', highlight ? 'bg-[#6d57fc]' : 'bg-[#0c0a1c]')}
                    style={{ width: `${percent}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
