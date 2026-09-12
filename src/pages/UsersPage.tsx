import { useState } from 'react'
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
import { cn } from '@/lib/utils'

type UserStatus = 'active' | 'dormant'

interface Member {
  id: string
  nickname: string
  email: string
  countryLang: string
  fandom: string
  joinedAt: string
  trips: number
  status: UserStatus
}

const members: Member[] = [
  {
    id: 'U-10482',
    nickname: 'mina_svt',
    email: 'mina***@gmail.com',
    countryLang: '일본 · JA',
    fandom: 'SEVENTEEN',
    joinedAt: '08.24',
    trips: 3,
    status: 'active',
  },
  {
    id: 'U-10476',
    nickname: 'aira.p',
    email: 'aira***@hotmail.com',
    countryLang: '태국 · TH',
    fandom: 'BLACKPINK',
    joinedAt: '08.22',
    trips: 2,
    status: 'active',
  },
  {
    id: 'U-10455',
    nickname: 'joanne_k',
    email: 'joan***@gmail.com',
    countryLang: '싱가포르 · EN',
    fandom: 'BTS',
    joinedAt: '08.19',
    trips: 5,
    status: 'active',
  },
  {
    id: 'U-10431',
    nickname: 'dwi_ptr',
    email: 'dwip***@yahoo.co.id',
    countryLang: '인도네시아 · ID',
    fandom: 'BTS',
    joinedAt: '08.16',
    trips: 1,
    status: 'active',
  },
  {
    id: 'U-10388',
    nickname: 'lucia_ae',
    email: 'luci***@gmail.com',
    countryLang: '미국 · EN',
    fandom: 'aespa',
    joinedAt: '08.09',
    trips: 0,
    status: 'dormant',
  },
  {
    id: 'U-10352',
    nickname: 'hyeri_admin_test',
    email: 'test***@ktp.kr',
    countryLang: '한국 · KR',
    fandom: '—',
    joinedAt: '07.30',
    trips: 0,
    status: 'dormant',
  },
  {
    id: 'U-10311',
    nickname: 'yuki_1013',
    email: 'yuki***@icloud.com',
    countryLang: '일본 · JA',
    fandom: 'SEVENTEEN',
    joinedAt: '07.21',
    trips: 4,
    status: 'active',
  },
  {
    id: 'U-10290',
    nickname: 'camille_bp',
    email: 'cami***@orange.fr',
    countryLang: '프랑스 · EN',
    fandom: 'BLACKPINK',
    joinedAt: '07.18',
    trips: 2,
    status: 'active',
  },
]

const statusFilters: { key: UserStatus | 'all'; label: string }[] = [
  { key: 'all', label: '전체' },
  { key: 'active', label: '활성' },
  { key: 'dormant', label: '휴면' },
]

const kpis = [
  { label: '총 회원', value: '3,482', delta: '해외 가입 91%', tone: 'muted' as const },
  { label: '30일 활성', value: '1,876', delta: '54%', tone: 'muted' as const },
  { label: '동선 1개 이상', value: '2,304', delta: '가입→생성 전환 66%', tone: 'delta' as const },
  { label: '탈퇴 · 삭제 요청', value: '2', delta: '30일 내 처리 의무', tone: 'delta' as const },
  { label: '관리자 계정', value: '6', delta: '4개 역할', tone: 'muted' as const },
]

export function UsersPage() {
  const [search, setSearch] = useState('')
  const [status, setStatus] = useState<UserStatus | 'all'>('all')

  const filtered = members.filter((member) => {
    const matchesStatus = status === 'all' || member.status === status
    const matchesSearch =
      !search ||
      member.nickname.toLowerCase().includes(search.toLowerCase()) ||
      member.email.toLowerCase().includes(search.toLowerCase())
    return matchesStatus && matchesSearch
  })

  const countFor = (key: UserStatus | 'all') =>
    key === 'all' ? members.length : members.filter((m) => m.status === key).length

  return (
    <div className="flex h-full flex-col">
      <div className="flex items-end justify-between gap-4 border-b border-[#e8e4ff] px-[22px] pt-4 pb-3.5">
        <div className="space-y-1">
          <p className="text-[10px] font-semibold tracking-[1.4px] text-[#6d57fc]">
            AD-09 / MEMBERS &amp; ROLES
          </p>
          <h1 className="text-2xl font-bold tracking-[-0.36px] text-[#201e1d]">회원 · 권한 관리</h1>
        </div>
        <div className="flex items-center gap-2">
          <Input
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="닉네임 · 이메일 검색"
            className="h-9 w-[200px] rounded-none border-[rgba(32,30,29,0.4)] bg-[#eae9e9]"
          />
          <Button
            variant="outline"
            className="rounded-full border-[rgba(32,30,29,0.4)] bg-transparent text-[#0c0a1c] hover:bg-muted"
          >
            검색
          </Button>
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
            <p className="pt-1 text-2xl font-bold text-[#201e1d]">{kpi.value}</p>
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
        <span className="text-[11px] text-[rgba(27,22,63,0.5)]">
          표본 {filtered.length}건 · 전체 3,482건 중
        </span>
      </div>

      <div className="flex-1 overflow-auto">
        <Table>
          <TableHeader>
            <TableRow className="border-[#e8e4ff] hover:bg-transparent">
              <TableHead className="pl-[22px] text-[9.5px] font-semibold tracking-[1.14px] text-[rgba(27,22,63,0.5)] uppercase">
                회원 ID
              </TableHead>
              <TableHead className="text-[9.5px] font-semibold tracking-[1.14px] text-[rgba(27,22,63,0.5)] uppercase">
                닉네임 · 이메일
              </TableHead>
              <TableHead className="text-[9.5px] font-semibold tracking-[1.14px] text-[rgba(27,22,63,0.5)] uppercase">
                국적 · 언어
              </TableHead>
              <TableHead className="text-[9.5px] font-semibold tracking-[1.14px] text-[rgba(27,22,63,0.5)] uppercase">
                팬덤
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
            {filtered.map((member) => (
              <TableRow key={member.id} className="border-[#efedfa]">
                <TableCell className="pl-[22px] text-[11px] text-[rgba(27,22,63,0.55)]">{member.id}</TableCell>
                <TableCell>
                  <div className="text-[12.5px] font-semibold text-[#201e1d]">{member.nickname}</div>
                  <div className="text-[10.5px] text-[rgba(27,22,63,0.5)]">{member.email}</div>
                </TableCell>
                <TableCell className="text-[11.5px] text-[#201e1d]">{member.countryLang}</TableCell>
                <TableCell className="text-[11.5px] text-[#201e1d]">{member.fandom}</TableCell>
                <TableCell className="text-[11px] text-[rgba(27,22,63,0.55)]">
                  {member.joinedAt}
                </TableCell>
                <TableCell className="text-[12.5px] font-semibold text-[#201e1d]">
                  {member.trips}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
