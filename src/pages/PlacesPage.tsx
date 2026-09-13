import { useQuery } from '@tanstack/react-query'
import { useMemo, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { api } from '@/lib/api'
import { cn } from '@/lib/utils'

interface EventListItem {
  event_no: number
  event_nm: string
  add: string
  start_dt: string
  end_dt: string
  ctg_nm: string
  ctg_type_nm: string
  total_score: number
  op_status_nm: string
}

function formatEventId(no: number) {
  return `E-${String(no).padStart(4, '0')}`
}

export function PlacesPage() {
  const [search, setSearch] = useState('')
  const [status, setStatus] = useState('all')
  const [selectedNo, setSelectedNo] = useState<number | null>(null)

  const { data, isLoading, isError } = useQuery({
    queryKey: ['eventlist'],
    queryFn: async () => {
      const { data } = await api.get<EventListItem[]>('/adminlogin/eventlist')
      return data
    },
  })

  const events = data ?? []

  const statusFilters = useMemo(() => {
    const uniqueStatuses = Array.from(new Set((data ?? []).map((event) => event.op_status_nm)))
    return [{ key: 'all', label: '전체' }, ...uniqueStatuses.map((s) => ({ key: s, label: s }))]
  }, [data])

  const filtered = events.filter((event) => {
    const matchesStatus = status === 'all' || event.op_status_nm === status
    const matchesSearch =
      !search || event.event_nm.includes(search) || event.add.includes(search)
    return matchesStatus && matchesSearch
  })

  const selected =
    events.find((event) => event.event_no === selectedNo) ?? filtered[0] ?? events[0]

  const countFor = (key: string) =>
    key === 'all' ? events.length : events.filter((event) => event.op_status_nm === key).length

  return (
    <div className="flex h-full flex-col">
      <div className="flex items-end justify-between gap-4 border-b border-[#e8e4ff] px-[22px] pt-4 pb-3.5">
        <div className="space-y-1">
          <p className="text-[10px] font-semibold tracking-[1.4px] text-[#6d57fc]">AD-02 / POI</p>
          <h1 className="text-2xl font-bold tracking-[-0.36px] text-[#201e1d]">장소 데이터 관리</h1>
        </div>
        <div className="flex items-center gap-2">
          <Input
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="장소명 · 주소 검색"
            className="h-9 w-[210px] rounded-none border-[rgba(32,30,29,0.4)] bg-[#eae9e9]"
          />
          <Button className="rounded-full bg-[#6d57fc] hover:bg-[#6d57fc]/90">＋ 장소 등록</Button>
        </div>
      </div>

      <div className="flex items-center justify-between border-b border-[#e8e4ff] px-[22px]">
        <div className="flex">
          {statusFilters.map(({ key, label }) => (
            <button
              key={key}
              type="button"
              onClick={() => setStatus(key)}
              className={cn(
                'border-b-[3px] px-3.5 py-2.5 text-[11.5px] font-semibold',
                status === key
                  ? 'border-[#6d57fc] text-[#0c0a1c]'
                  : 'border-transparent text-[rgba(27,22,63,0.5)]',
              )}
            >
              {label} {countFor(key)}
            </button>
          ))}
        </div>
        <span className="text-[11px] text-[rgba(27,22,63,0.5)]">총 {filtered.length}건 표시</span>
      </div>

      <div className="flex flex-1 overflow-hidden">
        <div className="flex-1 overflow-auto">
          {isError ? (
            <p className="px-[22px] py-6 text-[13px] text-[#ae1800]">
              장소 데이터를 불러오지 못했습니다.
            </p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow className="border-[#e8e4ff] hover:bg-transparent">
                  <TableHead className="pl-[22px] text-[9.5px] font-semibold tracking-[1.14px] text-[rgba(27,22,63,0.5)] uppercase">
                    POI ID
                  </TableHead>
                  <TableHead className="text-[9.5px] font-semibold tracking-[1.14px] text-[rgba(27,22,63,0.5)] uppercase">
                    장소명
                  </TableHead>
                  <TableHead className="text-[9.5px] font-semibold tracking-[1.14px] text-[rgba(27,22,63,0.5)] uppercase">
                    카테고리
                  </TableHead>
                  <TableHead className="text-[9.5px] font-semibold tracking-[1.14px] text-[rgba(27,22,63,0.5)] uppercase">
                    총점
                  </TableHead>
                  <TableHead className="text-[9.5px] font-semibold tracking-[1.14px] text-[rgba(27,22,63,0.5)] uppercase">
                    운영 기간
                  </TableHead>
                  <TableHead className="text-[9.5px] font-semibold tracking-[1.14px] text-[rgba(27,22,63,0.5)] uppercase">
                    상태
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  <TableRow>
                    <TableCell
                      colSpan={6}
                      className="py-6 text-center text-[12px] text-[rgba(27,22,63,0.5)]"
                    >
                      불러오는 중...
                    </TableCell>
                  </TableRow>
                ) : (
                  filtered.map((event) => (
                    <TableRow
                      key={event.event_no}
                      onClick={() => setSelectedNo(event.event_no)}
                      className={cn(
                        'cursor-pointer border-[#efedfa]',
                        selected?.event_no === event.event_no && 'bg-[#f8f7ff]',
                      )}
                    >
                      <TableCell className="pl-[22px] text-[11px] text-[rgba(27,22,63,0.55)]">
                        {formatEventId(event.event_no)}
                      </TableCell>
                      <TableCell>
                        <div className="text-[12.5px] font-semibold text-[#201e1d]">
                          {event.event_nm}
                        </div>
                        <div className="text-[10.5px] text-[rgba(27,22,63,0.5)]">{event.add}</div>
                      </TableCell>
                      <TableCell className="text-[11.5px] text-[#201e1d]">
                        {event.ctg_nm} · {event.ctg_type_nm}
                      </TableCell>
                      <TableCell className="text-[12.5px] font-semibold text-[#201e1d]">
                        {event.total_score}
                      </TableCell>
                      <TableCell className="text-[11px] text-[rgba(27,22,63,0.55)]">
                        {event.start_dt} ~ {event.end_dt}
                      </TableCell>
                      <TableCell>
                        <span className="rounded-full border border-[#e8e4ff] bg-[#f8f7ff] px-2 py-1 text-xs font-semibold text-[#0c0a1c]">
                          {event.op_status_nm}
                        </span>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          )}
        </div>

        <div className="w-[306px] shrink-0 space-y-4 overflow-auto border-l-2 border-[rgba(32,30,29,0.4)] px-[18px] py-4">
          <p className="text-[10px] font-semibold tracking-[1.4px] text-[#6d57fc]">선택 항목</p>
          {selected ? (
            <>
              <div>
                <p className="text-base font-semibold text-[#201e1d]">{selected.event_nm}</p>
                <p className="text-[11.5px] text-[rgba(27,22,63,0.55)]">{selected.add}</p>
              </div>

              <div className="space-y-1.5 border border-[#e8e4ff] px-3 py-2.5">
                <div className="flex items-baseline justify-between text-[11.5px]">
                  <span className="text-[rgba(27,22,63,0.55)]">카테고리</span>
                  <span className="font-semibold text-[#201e1d]">
                    {selected.ctg_nm} · {selected.ctg_type_nm}
                  </span>
                </div>
                <div className="flex items-baseline justify-between text-[11.5px]">
                  <span className="text-[rgba(27,22,63,0.55)]">운영 기간</span>
                  <span className="font-semibold text-[#201e1d]">
                    {selected.start_dt} ~ {selected.end_dt}
                  </span>
                </div>
                <div className="flex items-baseline justify-between border-t border-[rgba(27,22,63,0.2)] pt-1.5 text-[11.3px]">
                  <span className="font-semibold text-[#201e1d]">외부 리뷰 총점</span>
                  <span className="font-bold text-[#6d57fc]">{selected.total_score}</span>
                </div>
              </div>

              <div className="flex gap-2 pt-2">
                <Button className="flex-1 rounded-full bg-[#6d57fc] hover:bg-[#6d57fc]/90">
                  변경 저장
                </Button>
                <Button
                  variant="outline"
                  className="rounded-full border-[#e8e4ff] bg-[#f8f7ff] text-[#0c0a1c] hover:bg-[#f8f7ff]/70"
                >
                  되돌리기
                </Button>
              </div>
            </>
          ) : (
            <p className="text-[11.5px] text-[rgba(27,22,63,0.5)]">표시할 항목이 없습니다.</p>
          )}
        </div>
      </div>
    </div>
  )
}
