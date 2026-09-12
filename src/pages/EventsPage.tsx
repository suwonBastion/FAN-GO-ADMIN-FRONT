import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { cn } from '@/lib/utils'

type EventType = '공연' | '생일카페' | '팝업' | '기타'
type EventStatus = '운영' | '검토 대기' | '종료'

interface EventItem {
  id: string
  name: string
  meta: string
  type: EventType
  schedule: string
  status: EventStatus
}

const events: EventItem[] = [
  {
    id: 'E-0451',
    name: 'FOLLOW AGAIN IN SEOUL',
    meta: 'SEVENTEEN · KSPO DOME · P-0041',
    type: '공연',
    schedule: '09.12 19:00',
    status: '운영',
  },
  {
    id: 'E-0448',
    name: 'BTS 콘서트 · YET TO COME',
    meta: 'BTS · 잠실주경기장 · P-0009',
    type: '공연',
    schedule: '09.30 18:00',
    status: '운영',
  },
  {
    id: 'E-0442',
    name: 'aespa 팬미팅 SYNK',
    meta: 'aespa · 올림픽홀 · P-0118',
    type: '공연',
    schedule: '09.19 17:00',
    status: '운영',
  },
  {
    id: 'E-0437',
    name: '진 생일카페',
    meta: 'BTS · 진 · 카페 온화 · P-0112',
    type: '생일카페',
    schedule: '09.02 – 09.06',
    status: '운영',
  },
  {
    id: 'E-0431',
    name: '윈터 생일카페',
    meta: 'aespa · 윈터 · 서촌 팝업스토어 · P-0261',
    type: '생일카페',
    schedule: '09.18 – 09.21',
    status: '운영',
  },
  {
    id: 'E-0428',
    name: '굿즈 팝업 · 위드드라마',
    meta: '위드드라마 굿즈 · P-0203',
    type: '팝업',
    schedule: '09.24 – 10.02',
    status: '운영',
  },
  {
    id: 'E-0424',
    name: '앨범 발매 팝업 오픈',
    meta: 'SEVENTEEN · 망원 캔들샵 · P-0230',
    type: '팝업',
    schedule: '09.05 – 09.14',
    status: '운영',
  },
  {
    id: 'E-0419',
    name: '성수 포토부스 이벤트',
    meta: '구 성수 굿즈팝업 · P-0166',
    type: '기타',
    schedule: '09.08 – 09.12',
    status: '검토 대기',
  },
  {
    id: 'E-0415',
    name: '낙산공원 성지투어',
    meta: 'BTS · 낙산공원 성곽길 · P-0155',
    type: '기타',
    schedule: '09.26 – 09.28',
    status: '검토 대기',
  },
  {
    id: 'E-0402',
    name: '이태원 팬 밋업',
    meta: '최고심야식당 · P-0087',
    type: '기타',
    schedule: '08.20 – 08.28',
    status: '종료',
  },
]

const typeFilters: { key: EventType | 'all'; label: string }[] = [
  { key: 'all', label: '전체' },
  { key: '공연', label: '공연' },
  { key: '생일카페', label: '생일카페' },
  { key: '팝업', label: '팝업' },
  { key: '기타', label: '기타' },
]

const statusStyles: Record<EventStatus, string> = {
  운영: 'bg-[rgba(109,87,252,0.1)] text-[#4c3acd]',
  '검토 대기': 'bg-[rgba(27,22,63,0.07)] text-[rgba(27,22,63,0.65)]',
  종료: 'bg-[rgba(27,22,63,0.04)] text-[rgba(27,22,63,0.4)]',
}

export function EventsPage() {
  const [search, setSearch] = useState('')
  const [type, setType] = useState<EventType | 'all'>('all')
  const [artist, setArtist] = useState('SEVENTEEN')
  const [title, setTitle] = useState('FOLLOW AGAIN IN SEOUL')
  const [date, setDate] = useState('2026-09-12')
  const [time, setTime] = useState('19:00')
  const [venue, setVenue] = useState('KSPO DOME · P-0041')

  const filtered = events.filter((event) => {
    const matchesType = type === 'all' || event.type === type
    const matchesSearch =
      !search || event.name.includes(search) || event.meta.includes(search)
    return matchesType && matchesSearch
  })

  const countFor = (key: EventType | 'all') =>
    key === 'all' ? events.length : events.filter((e) => e.type === key).length

  const handleSubmit = (submitEvent: React.FormEvent) => {
    submitEvent.preventDefault()
  }

  return (
    <div className="flex h-full flex-col">
      <div className="flex items-end justify-between gap-4 border-b border-[#e8e4ff] px-[22px] pt-4 pb-3.5">
        <div className="space-y-1">
          <p className="text-[10px] font-semibold tracking-[1.4px] text-[#6d57fc]">AD-03 / EVENTS</p>
          <h1 className="text-2xl font-bold tracking-[-0.36px] text-[#201e1d]">이벤트 관리</h1>
        </div>
        <div className="flex items-center gap-2">
          <Input
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="이벤트명 · 아티스트 검색"
            className="h-9 w-[210px] rounded-none border-[rgba(32,30,29,0.4)] bg-[#eae9e9]"
          />
          <Button className="rounded-full bg-[#6d57fc] hover:bg-[#6d57fc]/90">＋ 이벤트 등록</Button>
        </div>
      </div>

      <div className="flex items-center justify-between border-b border-[#e8e4ff] px-[22px]">
        <div className="flex">
          {typeFilters.map(({ key, label }) => (
            <button
              key={key}
              type="button"
              onClick={() => setType(key)}
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
        <div className="flex-1 overflow-auto">
          <Table>
            <TableHeader>
              <TableRow className="border-[#e8e4ff] hover:bg-transparent">
                <TableHead className="text-[9.5px] font-semibold tracking-[1.14px] text-[rgba(27,22,63,0.5)] uppercase">
                  Event ID
                </TableHead>
                <TableHead className="text-[9.5px] font-semibold tracking-[1.14px] text-[rgba(27,22,63,0.5)] uppercase">
                  이벤트명
                </TableHead>
                <TableHead className="text-[9.5px] font-semibold tracking-[1.14px] text-[rgba(27,22,63,0.5)] uppercase">
                  유형
                </TableHead>
                <TableHead className="text-[9.5px] font-semibold tracking-[1.14px] text-[rgba(27,22,63,0.5)] uppercase">
                  일정
                </TableHead>
                <TableHead className="text-[9.5px] font-semibold tracking-[1.14px] text-[rgba(27,22,63,0.5)] uppercase">
                  상태
                </TableHead>
                <TableHead />
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((event) => (
                <TableRow key={event.id} className="border-[#efedfa]">
                  <TableCell className="text-[11px] text-[rgba(27,22,63,0.55)]">{event.id}</TableCell>
                  <TableCell>
                    <div className="text-[12.5px] font-semibold text-[#201e1d]">{event.name}</div>
                    <div className="text-[10.5px] text-[rgba(27,22,63,0.5)]">{event.meta}</div>
                  </TableCell>
                  <TableCell className="text-[11.5px] text-[#201e1d]">{event.type}</TableCell>
                  <TableCell className="text-[11px] text-[rgba(27,22,63,0.55)]">
                    {event.schedule}
                  </TableCell>
                  <TableCell>
                    <span
                      className={cn(
                        'px-2 py-[3px] text-[10.5px]',
                        statusStyles[event.status],
                      )}
                    >
                      {event.status}
                    </span>
                  </TableCell>
                  <TableCell>
                    <span className="rounded-full border border-[#e8e4ff] bg-[#f8f7ff] px-2 py-1 text-xs font-semibold text-[#0c0a1c]">
                      편집
                    </span>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        <form
          onSubmit={handleSubmit}
          className="w-[282px] shrink-0 overflow-auto border-l-2 border-[rgba(32,30,29,0.4)]"
        >
          <div className="border-b border-[#e8e4ff] px-[18px] py-3.5">
            <p className="text-[10px] font-semibold tracking-[1.4px] text-[#6d57fc]">등록 폼 — 공연</p>
          </div>
          <div className="space-y-4 px-[18px] py-3.5">
            <div className="space-y-1.5">
              <Label className="text-xs text-[rgba(27,22,63,0.65)]">아티스트</Label>
              <Input
                value={artist}
                onChange={(event) => setArtist(event.target.value)}
                className="h-9 rounded-none border-[rgba(32,30,29,0.4)]"
              />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs text-[rgba(27,22,63,0.65)]">이벤트명</Label>
              <Input
                value={title}
                onChange={(event) => setTitle(event.target.value)}
                className="h-9 rounded-none border-[rgba(32,30,29,0.4)]"
              />
            </div>
            <div className="flex gap-2">
              <div className="flex-1 space-y-1.5">
                <Label className="text-xs text-[rgba(27,22,63,0.65)]">일자</Label>
                <Input
                  type="date"
                  value={date}
                  onChange={(event) => setDate(event.target.value)}
                  className="h-9 rounded-none border-[rgba(32,30,29,0.4)]"
                />
              </div>
              <div className="w-24 space-y-1.5">
                <Label className="text-xs text-[rgba(27,22,63,0.65)]">시작</Label>
                <Input
                  type="time"
                  value={time}
                  onChange={(event) => setTime(event.target.value)}
                  className="h-9 rounded-none border-[rgba(32,30,29,0.4)]"
                />
              </div>
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs text-[rgba(27,22,63,0.65)]">장소 (POI 연결)</Label>
              <Input
                value={venue}
                onChange={(event) => setVenue(event.target.value)}
                className="h-9 rounded-none border-[rgba(32,30,29,0.4)]"
              />
            </div>
          </div>
          <div className="border-t border-[#e8e4ff] px-[18px] py-3.5">
            <Button type="submit" className="w-full rounded-full bg-[#6d57fc] hover:bg-[#6d57fc]/90">
              등록
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}
