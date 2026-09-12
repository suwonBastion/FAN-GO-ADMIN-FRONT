import { useState } from 'react'
import { cn } from '@/lib/utils'

const periods = ['7일', '30일', '전체'] as const
type Period = (typeof periods)[number]

interface DailyTrip {
  day: string
  value: number
  variant: 'default' | 'concert' | 'upcoming'
}

const dailyTrips: DailyTrip[] = [
  { day: '13', value: 38, variant: 'default' },
  { day: '14', value: 44, variant: 'default' },
  { day: '15', value: 35, variant: 'default' },
  { day: '16', value: 52, variant: 'default' },
  { day: '17', value: 61, variant: 'default' },
  { day: '18', value: 87, variant: 'concert' },
  { day: '19', value: 95, variant: 'concert' },
  { day: '20', value: 57, variant: 'default' },
  { day: '21', value: 49, variant: 'default' },
  { day: '22', value: 46, variant: 'default' },
  { day: '23', value: 58, variant: 'default' },
  { day: '24', value: 66, variant: 'default' },
  { day: '25', value: 72, variant: 'default' },
  { day: '26', value: 41, variant: 'upcoming' },
]

const kpis = [
  { label: '누적 가입자', value: '3,482', delta: '+218 / 7일', tone: 'delta' as const },
  { label: '생성 동선', value: '5,107', delta: '+412 / 7일', tone: 'delta' as const },
  { label: '피드백 만족도', value: '4.31', delta: '응답 1,204건', tone: 'muted' as const },
  { label: '알고리즘 평균 응답', value: '15.8', suffix: 's', delta: '상한 20s', tone: 'muted' as const },
]

const fandomShares = [
  { label: 'BTS', percent: 38, highlight: true },
  { label: 'SEVENTEEN', percent: 24, highlight: false },
  { label: 'BLACKPINK', percent: 22, highlight: false },
]

export function DashboardPage() {
  const [period, setPeriod] = useState<Period>('7일')

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

      <div className="grid grid-cols-2 border-b border-[#e8e4ff] sm:grid-cols-4">
        {kpis.map((kpi, index) => (
          <div
            key={kpi.label}
            className={cn(
              'space-y-0.5 px-4 py-3.5',
              index < kpis.length - 1 && 'border-r border-[#e8e4ff]',
            )}
          >
            <p className="text-[9.5px] font-semibold tracking-[1.14px] text-[rgba(27,22,63,0.5)]">
              {kpi.label}
            </p>
            <p className="pt-1 text-3xl font-bold text-[#201e1d]">
              {kpi.value}
              {kpi.suffix && <span className="text-[15px]">{kpi.suffix}</span>}
            </p>
            <p
              className={cn(
                'text-[11px]',
                kpi.tone === 'delta' ? 'text-[#ae1800]' : 'text-[rgba(27,22,63,0.5)]',
              )}
            >
              {kpi.delta}
            </p>
          </div>
        ))}
      </div>

      <div className="flex flex-1 flex-col lg:flex-row">
        <div className="flex-1 border-r-2 border-[rgba(32,30,29,0.4)] px-[22px] py-[18px]">
          <div className="flex items-baseline gap-2.5">
            <h2 className="text-sm font-semibold tracking-[-0.21px] text-[#201e1d]">
              일별 동선 생성
            </h2>
            <span className="text-[11px] text-[rgba(27,22,63,0.5)]">최근 14일 · 콘서트일 표시</span>
          </div>
          <div className="flex h-[300px] items-end justify-center gap-2 pt-4">
            {dailyTrips.map(({ day, value, variant }) => (
              <div key={day} className="flex h-full w-9 flex-col items-center justify-end gap-1.5">
                <div
                  className={cn(
                    'w-full rounded-t-sm',
                    variant === 'concert' && 'bg-[#6d57fc]',
                    variant === 'default' && 'bg-[#0c0a1c]',
                    variant === 'upcoming' && 'bg-[rgba(27,22,63,0.3)]',
                  )}
                  style={{ height: `${value}%` }}
                />
                <span
                  className={cn(
                    'text-[9px]',
                    variant === 'concert' ? 'font-semibold text-[#ae1800]' : 'text-[rgba(27,22,63,0.45)]',
                  )}
                >
                  {day}
                </span>
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
