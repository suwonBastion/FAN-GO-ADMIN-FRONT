import { useQuery } from '@tanstack/react-query'
import {
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
} from 'lucide-react'
import { useState } from 'react'
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

interface UserListItem {
  user_no: number
  nickname: string
  login_id: string
  lang_nm: string
  nationality_nm: string
  favorite_group_nos: string | null
  created_at: string | null
  trip_route_cnt: number
}

interface UserTotalStats {
  total_users: number
  nationality_pct: number
  trip_users: number
  real_trip_pct: number
  admin: number
}

type GroupFilter = 'all' | 'has_group' | 'no_group'

function formatUserId(no: number) {
  return `U-${String(no).padStart(5, '0')}`
}

function formatJoinedAt(value: string | null) {
  if (!value) return '—'
  return value.slice(0, 10)
}

function parseGroupNos(value: string | null) {
  if (!value) return []
  return value
    .split(',')
    .map((no) => no.trim())
    .filter(Boolean)
}

const groupFilters: { key: GroupFilter; label: string }[] = [
  { key: 'all', label: '전체' },
  { key: 'has_group', label: '관심 그룹 등록' },
  { key: 'no_group', label: '관심 그룹 없음' },
]

const PAGE_SIZE = 10
const PAGE_WINDOW = 10

export function UsersPage() {
  const [search, setSearch] = useState('')
  const [groupFilter, setGroupFilter] = useState<GroupFilter>('all')
  const [page, setPage] = useState(1)

  const { data, isLoading, isError } = useQuery({
    queryKey: ['userlist'],
    queryFn: async () => {
      const { data } = await api.get<UserListItem[]>('/userList/userlist')
      return data
    },
  })

  const { data: totalStats } = useQuery({
    queryKey: ['user-total'],
    queryFn: async () => {
      const { data } = await api.get<UserTotalStats[]>('/userList/usertotal')
      return data[0]
    },
  })

  const members = data ?? []

  const totalMembers = totalStats?.total_users ?? members.length
  const withTrips =
    totalStats?.trip_users ?? members.filter((m) => m.trip_route_cnt > 0).length
  const conversionRate =
    totalStats?.real_trip_pct ??
    (totalMembers ? Math.round((withTrips / totalMembers) * 100) : 0)

  const kpis = [
    {
      label: '총 회원',
      value: totalMembers.toLocaleString(),
      delta: `해외 가입 ${totalStats?.nationality_pct ?? 0}%`,
      tone: 'muted' as const,
    },
    {
      label: '30일 활성',
      value: '1,876',
      delta: '54%',
      tone: 'muted' as const,
    },
    {
      label: '동선 1개 이상',
      value: withTrips.toLocaleString(),
      delta: `가입→생성 전환 ${conversionRate}%`,
      tone: 'delta' as const,
    },
    {
      label: '탈퇴 · 삭제 요청',
      value: '2',
      delta: '30일 내 처리 의무',
      tone: 'delta' as const,
    },
    {
      label: '관리자 계정',
      value: (totalStats?.admin ?? 0).toLocaleString(),
      delta: '운영자 · 관리자 권한',
      tone: 'muted' as const,
    },
  ]

  const filtered = members.filter((member) => {
    const matchesGroup =
      groupFilter === 'all' ||
      (groupFilter === 'has_group'
        ? !!member.favorite_group_nos
        : !member.favorite_group_nos)
    const matchesSearch =
      !search ||
      member.nickname.toLowerCase().includes(search.toLowerCase()) ||
      member.login_id.toLowerCase().includes(search.toLowerCase())
    return matchesGroup && matchesSearch
  })

  const countFor = (key: GroupFilter) =>
    key === 'all'
      ? members.length
      : members.filter((m) =>
          key === 'has_group' ? !!m.favorite_group_nos : !m.favorite_group_nos,
        ).length

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE))
  const currentPage = Math.min(page, totalPages)
  const paginated = filtered.slice(
    (currentPage - 1) * PAGE_SIZE,
    currentPage * PAGE_SIZE,
  )

  const windowStart =
    Math.floor((currentPage - 1) / PAGE_WINDOW) * PAGE_WINDOW + 1
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
            AD-09 / MEMBERS &amp; ROLES
          </p>
          <h1 className="text-2xl font-bold tracking-[-0.36px] text-[#201e1d]">
            회원 · 권한 관리
          </h1>
        </div>
        <div className="flex items-center gap-2">
          <Input
            value={search}
            onChange={(event) => {
              setSearch(event.target.value)
              setPage(1)
            }}
            placeholder="닉네임 · 아이디 검색"
            className="h-9 w-[200px] rounded-none border-[rgba(32,30,29,0.4)] bg-[#eae9e9]"
          />
        </div>
      </div>

      <div className="grid grid-cols-2 border-b border-[#e8e4ff] sm:grid-cols-5">
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
            <p className="pt-1 text-2xl font-bold text-[#201e1d]">
              {kpi.value}
            </p>
            {kpi.delta && (
              <p
                className={cn(
                  'text-[11px]',
                  kpi.tone === 'delta'
                    ? 'text-[#ae1800]'
                    : 'text-[rgba(27,22,63,0.5)]',
                )}
              >
                {kpi.delta}
              </p>
            )}
          </div>
        ))}
      </div>

      <div className="flex items-center justify-between border-b border-[#e8e4ff] px-[22px]">
        <div className="flex">
          {groupFilters.map(({ key, label }) => (
            <button
              key={key}
              type="button"
              onClick={() => {
                setGroupFilter(key)
                setPage(1)
              }}
              className={cn(
                'border-b-[3px] px-3.5 py-2.5 text-[11.5px] font-semibold',
                groupFilter === key
                  ? 'border-[#6d57fc] text-[#0c0a1c]'
                  : 'border-transparent text-[rgba(27,22,63,0.5)]',
              )}
            >
              {label} {countFor(key)}
            </button>
          ))}
        </div>
        <span className="text-[11px] text-[rgba(27,22,63,0.5)]">
          표본 {filtered.length}건 · 전체 {totalMembers}건 중
        </span>
      </div>

      <div className="flex flex-1 flex-col overflow-hidden">
        <div className="flex-1 overflow-auto">
          {isError ? (
            <p className="px-[22px] py-6 text-[13px] text-[#ae1800]">
              회원 목록을 불러오지 못했습니다.
            </p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow className="border-[#e8e4ff] hover:bg-transparent">
                  <TableHead className="pl-[22px] text-[9.5px] font-semibold tracking-[1.14px] text-[rgba(27,22,63,0.5)] uppercase">
                    회원 ID
                  </TableHead>
                  <TableHead className="text-[9.5px] font-semibold tracking-[1.14px] text-[rgba(27,22,63,0.5)] uppercase">
                    닉네임 · 아이디
                  </TableHead>
                  <TableHead className="text-[9.5px] font-semibold tracking-[1.14px] text-[rgba(27,22,63,0.5)] uppercase">
                    국적 · 언어
                  </TableHead>
                  <TableHead className="text-[9.5px] font-semibold tracking-[1.14px] text-[rgba(27,22,63,0.5)] uppercase">
                    관심 그룹
                  </TableHead>
                  <TableHead className="text-[9.5px] font-semibold tracking-[1.14px] text-[rgba(27,22,63,0.5)] uppercase">
                    가입일
                  </TableHead>
                  <TableHead className="text-[9.5px] font-semibold tracking-[1.14px] text-[rgba(27,22,63,0.5)] uppercase">
                    동선
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
                  paginated.map((member) => {
                    const groupNos = parseGroupNos(member.favorite_group_nos)
                    return (
                      <TableRow
                        key={member.user_no}
                        className="border-[#efedfa]"
                      >
                        <TableCell className="pl-[22px] text-[11px] text-[rgba(27,22,63,0.55)]">
                          {formatUserId(member.user_no)}
                        </TableCell>
                        <TableCell>
                          <div className="text-[12.5px] font-semibold text-[#201e1d]">
                            {member.nickname}
                          </div>
                          <div className="text-[10.5px] text-[rgba(27,22,63,0.5)]">
                            {member.login_id}
                          </div>
                        </TableCell>
                        <TableCell className="text-[11.5px] text-[#201e1d]">
                          {member.nationality_nm} · {member.lang_nm}
                        </TableCell>
                        <TableCell>
                          {groupNos.length > 0 ? (
                            <div className="flex flex-wrap gap-1">
                              {groupNos.map((no) => (
                                <span
                                  key={no}
                                  className="rounded-full border border-[#e8e4ff] bg-[#f8f7ff] px-2 py-0.5 text-[10.5px] font-semibold text-[#4c3acd]"
                                >
                                  #{no}
                                </span>
                              ))}
                            </div>
                          ) : (
                            <span className="text-[11.5px] text-[rgba(27,22,63,0.28)]">
                              —
                            </span>
                          )}
                        </TableCell>
                        <TableCell className="text-[11px] text-[rgba(27,22,63,0.55)]">
                          {formatJoinedAt(member.created_at)}
                        </TableCell>
                        <TableCell className="text-[12.5px] font-semibold text-[#201e1d]">
                          {member.trip_route_cnt}
                        </TableCell>
                      </TableRow>
                    )
                  })
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
    </div>
  )
}
