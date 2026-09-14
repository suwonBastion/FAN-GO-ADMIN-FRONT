import { useQuery } from '@tanstack/react-query'
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from 'lucide-react'
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
  start_dt: string | null
  end_dt: string | null
  ctg_nm: string
  ctg_type_nm: string
  total_score: number
  op_status_nm: string
  artist_nm: string | null
  group_nm: string | null
  review_avg?: number | null
  rating?: number | null
}

function formatEventId(no: number) {
  return `E-${String(no).padStart(4, '0')}`
}

function formatDate(date: string | null) {
  return date ?? '—'
}

function formatArtist(event: Pick<EventListItem, 'artist_nm' | 'group_nm'>) {
  return event.group_nm ?? event.artist_nm ?? '—'
}

const statusStyles: Record<string, string> = {
  운영: 'bg-[rgba(109,87,252,0.1)] text-[#4c3acd]',
  운영중: 'bg-[rgba(109,87,252,0.1)] text-[#4c3acd]',
  '검토 대기': 'bg-[rgba(27,22,63,0.07)] text-[rgba(27,22,63,0.65)]',
  종료: 'bg-[rgba(27,22,63,0.04)] text-[rgba(27,22,63,0.4)]',
}
const defaultStatusStyle = 'bg-[rgba(27,22,63,0.07)] text-[rgba(27,22,63,0.65)]'

const PAGE_SIZE = 10
const PAGE_WINDOW = 10

export function PlacesPage() {
  const [search, setSearch] = useState('')
  const [type, setType] = useState('all')
  const [selectedNo, setSelectedNo] = useState<number | null>(null)
  const [page, setPage] = useState(1)

  const { data, isLoading, isError } = useQuery({
    queryKey: ['eventlist'],
    queryFn: async () => {
      const { data } = await api.get<EventListItem[]>('/adminlogin/eventlist')
      return data
    },
  })

  const events = data ?? []

  const typeFilters = useMemo(() => {
    const uniqueTypes = Array.from(new Set((data ?? []).map((event) => event.ctg_type_nm)))
    return [{ key: 'all', label: '전체' }, ...uniqueTypes.map((t) => ({ key: t, label: t }))]
  }, [data])

  const filtered = events.filter((event) => {
    const matchesType = type === 'all' || event.ctg_type_nm === type
    const matchesSearch =
      !search ||
      event.event_nm.includes(search) ||
      event.add.includes(search) ||
      formatArtist(event).includes(search)
    return matchesType && matchesSearch
  })

  const selected =
    events.find((event) => event.event_no === selectedNo) ?? filtered[0] ?? events[0]

  const countFor = (key: string) =>
    key === 'all' ? events.length : events.filter((event) => event.ctg_type_nm === key).length

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE))
  const currentPage = Math.min(page, totalPages)
  const paginated = filtered.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE)

  const windowStart = Math.floor((currentPage - 1) / PAGE_WINDOW) * PAGE_WINDOW + 1
  const windowEnd = Math.min(windowStart + PAGE_WINDOW - 1, totalPages)
  const windowPages = Array.from(
    { length: windowEnd - windowStart + 1 },
    (_, i) => windowStart + i,
  )

  return (
    <div className="flex h-full flex-col">
      <div className="flex items-end justify-between gap-4 border-b border-[#e8e4ff] px-[22px] pt-4 pb-3.5">
        <div className="space-y-1">
          <p className="text-[10px] font-semibold tracking-[1.4px] text-[#6d57fc]">
            AD-02 / EVENTS & PLACES
          </p>
          <h1 className="text-2xl font-bold tracking-[-0.36px] text-[#201e1d]">통합 데이터 관리</h1>
        </div>
        <div className="flex items-center gap-2">
          <Input
            value={search}
            onChange={(event) => {
              setSearch(event.target.value)
              setPage(1)
            }}
            placeholder="이벤트명 · 장소명 · 주소 검색"
            className="h-9 w-[220px] rounded-none border-[rgba(32,30,29,0.4)] bg-[#eae9e9]"
          />
          <Button className="rounded-full bg-[#6d57fc] hover:bg-[#6d57fc]/90">＋ 신규 등록</Button>
        </div>
      </div>

      <div className="flex items-center justify-between border-b border-[#e8e4ff] px-[22px]">
        <div className="flex">
          {typeFilters.map(({ key, label }) => (
            <button
              key={key}
              type="button"
              onClick={() => {
                setType(key)
                setPage(1)
              }}
              className={cn(
                'border-b-[3px] px-3.5 py-2.5 text-[11.5px] font-semibold',
                type === key
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
        <div className="flex flex-1 flex-col overflow-hidden">
          <div className="flex-1 overflow-auto">
            {isError ? (
              <p className="px-[22px] py-6 text-[13px] text-[#ae1800]">
                데이터를 불러오지 못했습니다.
              </p>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow className="border-[#e8e4ff] hover:bg-transparent">
                    <TableHead className="pl-[22px] text-[9.5px] font-semibold tracking-[1.14px] text-[rgba(27,22,63,0.5)] uppercase">
                      Event ID
                    </TableHead>
                    <TableHead className="text-[9.5px] font-semibold tracking-[1.14px] text-[rgba(27,22,63,0.5)] uppercase">
                      이벤트명/장소명
                    </TableHead>
                    <TableHead className="text-[9.5px] font-semibold tracking-[1.14px] text-[rgba(27,22,63,0.5)] uppercase">
                      유형
                    </TableHead>
                    <TableHead className="text-[9.5px] font-semibold tracking-[1.14px] text-[rgba(27,22,63,0.5)] uppercase">
                      연관 아티스트
                    </TableHead>
                    <TableHead className="text-[9.5px] font-semibold tracking-[1.14px] text-[rgba(27,22,63,0.5)] uppercase">
                      시작일
                    </TableHead>
                    <TableHead className="text-[9.5px] font-semibold tracking-[1.14px] text-[rgba(27,22,63,0.5)] uppercase">
                      종료일
                    </TableHead>
                    <TableHead className="text-[9.5px] font-semibold tracking-[1.14px] text-[rgba(27,22,63,0.5)] uppercase">
                      상태
                    </TableHead>
                    <TableHead />
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {isLoading ? (
                    <TableRow>
                      <TableCell
                        colSpan={8}
                        className="py-6 text-center text-[12px] text-[rgba(27,22,63,0.5)]"
                      >
                        불러오는 중...
                      </TableCell>
                    </TableRow>
                  ) : (
                    paginated.map((event) => (
                      <TableRow
                        key={event.event_no}
                        onClick={() => setSelectedNo(event.event_no)}
                        className={cn(
                          'cursor-pointer border-[#f0eefc]',
                          selected?.event_no === event.event_no &&
                            'bg-[rgba(109,87,252,0.07)] shadow-[inset_2px_0px_0px_0px_#6d57fc]',
                        )}
                      >
                        <TableCell className="pl-[22px] text-[10px] text-[rgba(27,22,63,0.5)]">
                          {formatEventId(event.event_no)}
                        </TableCell>
                        <TableCell>
                          <div className="text-[12px] font-semibold text-[#201e1d]">
                            {event.event_nm}
                          </div>
                          <div className="text-[10px] text-[rgba(27,22,63,0.5)]">{event.add}</div>
                        </TableCell>
                        <TableCell className="text-[11px] font-semibold text-[#4c3acd]">
                          {event.ctg_type_nm}
                        </TableCell>
                        <TableCell
                          className={cn(
                            'text-[11px]',
                            event.group_nm || event.artist_nm
                              ? 'text-[#4c3acd]'
                              : 'text-[rgba(27,22,63,0.28)]',
                          )}
                        >
                          {formatArtist(event)}
                        </TableCell>
                        <TableCell className="text-[11px] text-[rgba(32,30,29,0.75)]">
                          {formatDate(event.start_dt)}
                        </TableCell>
                        <TableCell className="text-[11px] text-[rgba(32,30,29,0.75)]">
                          {formatDate(event.end_dt)}
                        </TableCell>
                        <TableCell>
                          <span
                            className={cn(
                              'px-2 py-[3px] text-[10.5px]',
                              statusStyles[event.op_status_nm] ?? defaultStatusStyle,
                            )}
                          >
                            {event.op_status_nm}
                          </span>
                        </TableCell>
                        <TableCell>
                          <span className="rounded-full border border-[rgba(27,22,63,0.16)] px-3 py-1.5 text-[10.5px] font-semibold text-[#201e1d]">
                            편집
                          </span>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            )}
          </div>

          {!isError && totalPages > 1 && (
            <div className="flex shrink-0 items-center justify-center gap-4 border-t border-[#e8e4ff] py-3">
              <span className="text-[11px] text-[rgba(27,22,63,0.45)]">
                {currentPage} / {totalPages} 페이지
              </span>
              <div className="flex items-center gap-0.5">
                <button
                  type="button"
                  onClick={() => setPage(1)}
                  disabled={currentPage === 1}
                  aria-label="첫 페이지"
                  className="flex size-7 items-center justify-center rounded-full text-[rgba(27,22,63,0.55)] transition-colors hover:bg-[#f2f0ff] disabled:pointer-events-none disabled:opacity-25"
                >
                  <ChevronsLeft className="size-3.5" />
                </button>
                <button
                  type="button"
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                  aria-label="이전 페이지"
                  className="flex size-7 items-center justify-center rounded-full text-[rgba(27,22,63,0.55)] transition-colors hover:bg-[#f2f0ff] disabled:pointer-events-none disabled:opacity-25"
                >
                  <ChevronLeft className="size-3.5" />
                </button>

                {windowStart > 1 && (
                  <span className="flex size-7 items-center justify-center text-[12px] text-[rgba(27,22,63,0.35)]">
                    ···
                  </span>
                )}

                {windowPages.map((p) => (
                  <button
                    key={p}
                    type="button"
                    onClick={() => setPage(p)}
                    aria-current={p === currentPage ? 'page' : undefined}
                    className={cn(
                      'flex size-7 items-center justify-center rounded-full text-[12px] font-semibold transition-colors',
                      p === currentPage
                        ? 'bg-[#6d57fc] text-white shadow-[0px_2px_6px_0px_rgba(109,87,252,0.4)]'
                        : 'text-[rgba(27,22,63,0.55)] hover:bg-[#f2f0ff]',
                    )}
                  >
                    {p}
                  </button>
                ))}

                {windowEnd < totalPages && (
                  <span className="flex size-7 items-center justify-center text-[12px] text-[rgba(27,22,63,0.35)]">
                    ···
                  </span>
                )}

                <button
                  type="button"
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                  disabled={currentPage === totalPages}
                  aria-label="다음 페이지"
                  className="flex size-7 items-center justify-center rounded-full text-[rgba(27,22,63,0.55)] transition-colors hover:bg-[#f2f0ff] disabled:pointer-events-none disabled:opacity-25"
                >
                  <ChevronRight className="size-3.5" />
                </button>
                <button
                  type="button"
                  onClick={() => setPage(totalPages)}
                  disabled={currentPage === totalPages}
                  aria-label="마지막 페이지"
                  className="flex size-7 items-center justify-center rounded-full text-[rgba(27,22,63,0.55)] transition-colors hover:bg-[#f2f0ff] disabled:pointer-events-none disabled:opacity-25"
                >
                  <ChevronsRight className="size-3.5" />
                </button>
              </div>
            </div>
          )}
        </div>

        <div className="flex w-[306px] shrink-0 flex-col overflow-hidden border-l-2 border-[rgba(32,30,29,0.4)]">
          <div className="px-[18px] pt-4">
            <p className="text-[10px] font-semibold tracking-[1.4px] text-[#6d57fc]">선택 항목</p>
          </div>
          {selected ? (
            <div className="flex flex-1 flex-col overflow-auto px-[18px] pt-[9px] pb-4">
              <p className="text-[16px] leading-[20.8px] font-semibold text-[#201e1d]">
                {selected.event_nm}
              </p>
              <p className="mt-[3px] text-[11.5px] leading-[17.83px] text-[rgba(27,22,63,0.55)]">
                {selected.add}
              </p>

              <div className="mt-4 space-y-[7px] border border-[#e8e4ff] px-3 py-2.5">
                <div className="flex items-center justify-between">
                  <span className="text-[11.5px] text-[rgba(27,22,63,0.55)]">FAN:GO 평균 후기</span>
                  <span className="text-[11.5px] font-semibold text-[#201e1d]">
                    {selected.review_avg ?? '-'}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-[11.5px] text-[rgba(27,22,63,0.55)]">FAN:GO 평점</span>
                  <span className="text-[11.5px] font-semibold text-[#201e1d]">
                    {selected.rating ?? '-'}
                  </span>
                </div>
                <div className="flex items-center justify-between border-t border-[rgba(27,22,63,0.2)] pt-[7px]">
                  <span className="text-[11.3px] font-semibold text-[#201e1d]">relevance(p)</span>
                  <span className="text-[11.5px] font-bold text-[#6d57fc]">
                    {selected.total_score}
                  </span>
                </div>
              </div>

              <div className="mt-4 space-y-1.5">
                <p className="text-[9.5px] font-semibold tracking-[1.14px] text-[rgba(27,22,63,0.5)]">
                  연관 아티스트
                </p>
                <div className="flex flex-wrap gap-[5px]">
                  {selected.group_nm && (
                    <span className="bg-[#fff2ef] px-2.5 py-[3px] text-[11px] tracking-[0.22px] text-[#7c1405]">
                      {selected.group_nm}
                    </span>
                  )}
                  {selected.artist_nm && (
                    <span className="border border-[#ec3013] px-2.5 py-[2px] text-[11px] tracking-[0.22px] text-[#ec3013]">
                      {selected.artist_nm}
                    </span>
                  )}
                  {!selected.group_nm && !selected.artist_nm && (
                    <span className="text-[11px] text-[rgba(27,22,63,0.28)]">-</span>
                  )}
                </div>
              </div>

              <div className="flex gap-2 pt-6">
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
            </div>
          ) : (
            <p className="px-[18px] py-3.5 text-[11.5px] text-[rgba(27,22,63,0.5)]">
              표시할 항목이 없습니다.
            </p>
          )}
        </div>
      </div>
    </div>
  )
}
