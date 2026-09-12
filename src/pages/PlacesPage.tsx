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

type PlaceStatus = 'operating' | 'relocated' | 'closed'

interface Place {
  id: string
  name: string
  address: string
  category: string
  score: number
  verifiedAt: string
  status: PlaceStatus
  review?: number
  rating?: number
  relevance?: number
  artists?: { name: string; solid: boolean }[]
}

const places: Place[] = [
  {
    id: 'P-0087',
    name: '최고심야식당',
    address: '용산구 이태원로 235',
    category: '맛집',
    score: 87,
    verifiedAt: '08.24',
    status: 'operating',
    review: 4.6,
    rating: 93,
    relevance: 87,
    artists: [
      { name: 'BTS', solid: true },
      { name: '진', solid: false },
    ],
  },
  {
    id: 'P-0112',
    name: '카페 온화',
    address: '성동구 성수이로 88',
    category: '카페',
    score: 81,
    verifiedAt: '08.25',
    status: 'operating',
  },
  {
    id: 'P-0041',
    name: 'KSPO DOME',
    address: '송파구 올림픽로 424',
    category: '공연장',
    score: 94,
    verifiedAt: '08.26',
    status: 'operating',
  },
  {
    id: 'P-0203',
    name: '위드드라마 굿즈',
    address: '마포구 양화로 162',
    category: '굿즈샵',
    score: 76,
    verifiedAt: '08.20',
    status: 'operating',
  },
  {
    id: 'P-0155',
    name: '낙산공원 성곽길',
    address: '종로구 낙산길 41',
    category: '성지',
    score: 71,
    verifiedAt: '08.19',
    status: 'operating',
  },
  {
    id: 'P-0261',
    name: '서촌 팝업스토어',
    address: '종로구 자하문로 17',
    category: '팝업',
    score: 44,
    verifiedAt: '08.12',
    status: 'relocated',
  },
  {
    id: 'P-0198',
    name: '하이브 인사이트',
    address: '용산구 한강대로 42',
    category: '성지',
    score: 83,
    verifiedAt: '08.23',
    status: 'operating',
  },
  {
    id: 'P-0074',
    name: '이태원 갈비',
    address: '용산구 녹사평대로 176',
    category: '맛집',
    score: 29,
    verifiedAt: '08.18',
    status: 'closed',
  },
  {
    id: 'P-0230',
    name: '망원 캔들샵',
    address: '마포구 포은로 89',
    category: '카페',
    score: 91,
    verifiedAt: '08.26',
    status: 'operating',
  },
  {
    id: 'P-0166',
    name: '구 성수 굿즈팝업',
    address: '성동구 연무장길 33',
    category: '굿즈샵',
    score: 31,
    verifiedAt: '07.30',
    status: 'closed',
  },
]

const statusFilters: { key: PlaceStatus | 'all'; label: string }[] = [
  { key: 'all', label: '전체' },
  { key: 'operating', label: '운영' },
  { key: 'relocated', label: '이전' },
  { key: 'closed', label: '폐업' },
]

export function PlacesPage() {
  const [search, setSearch] = useState('')
  const [status, setStatus] = useState<PlaceStatus | 'all'>('all')
  const [selectedId, setSelectedId] = useState(places[0].id)

  const filtered = places.filter((place) => {
    const matchesStatus = status === 'all' || place.status === status
    const matchesSearch =
      !search ||
      place.name.includes(search) ||
      place.address.includes(search)
    return matchesStatus && matchesSearch
  })

  const selected = places.find((place) => place.id === selectedId) ?? places[0]

  const countFor = (key: PlaceStatus | 'all') =>
    key === 'all' ? places.length : places.filter((p) => p.status === key).length

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
        <span className="text-[11px] text-[rgba(27,22,63,0.5)]">
          총 {filtered.length}건 표시
        </span>
      </div>

      <div className="flex flex-1 overflow-hidden">
        <div className="flex-1 overflow-auto">
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
                  최종점수
                </TableHead>
                <TableHead className="text-[9.5px] font-semibold tracking-[1.14px] text-[rgba(27,22,63,0.5)] uppercase">
                  최종 검증
                </TableHead>
                <TableHead />
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((place) => (
                <TableRow
                  key={place.id}
                  onClick={() => setSelectedId(place.id)}
                  className={cn(
                    'cursor-pointer border-[#efedfa]',
                    selectedId === place.id && 'bg-[#f8f7ff]',
                  )}
                >
                  <TableCell className="pl-[22px] text-[11px] text-[rgba(27,22,63,0.55)]">
                    {place.id}
                  </TableCell>
                  <TableCell>
                    <div className="text-[12.5px] font-semibold text-[#201e1d]">{place.name}</div>
                    <div className="text-[10.5px] text-[rgba(27,22,63,0.5)]">{place.address}</div>
                  </TableCell>
                  <TableCell className="text-[11.5px] text-[#201e1d]">{place.category}</TableCell>
                  <TableCell className="text-[12.5px] font-semibold text-[#201e1d]">
                    {place.score}
                  </TableCell>
                  <TableCell className="text-[11px] text-[rgba(27,22,63,0.55)]">
                    {place.verifiedAt}
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

        <div className="w-[306px] shrink-0 space-y-4 overflow-auto border-l-2 border-[rgba(32,30,29,0.4)] px-[18px] py-4">
          <p className="text-[10px] font-semibold tracking-[1.4px] text-[#6d57fc]">선택 항목</p>
          <div>
            <p className="text-base font-semibold text-[#201e1d]">{selected.name}</p>
            <p className="text-[11.5px] text-[rgba(27,22,63,0.55)]">서울 {selected.address}</p>
          </div>

          {selected.review !== undefined && (
            <div className="space-y-1.5 border border-[#e8e4ff] px-3 py-2.5">
              <div className="flex items-baseline justify-between text-[11.5px]">
                <span className="text-[rgba(27,22,63,0.55)]">FAN:GO 평균 후기</span>
                <span className="font-semibold text-[#201e1d]">{selected.review}</span>
              </div>
              <div className="flex items-baseline justify-between text-[11.5px]">
                <span className="text-[rgba(27,22,63,0.55)]">FAN:GO 평점</span>
                <span className="font-semibold text-[#201e1d]">{selected.rating}</span>
              </div>
              <div className="flex items-baseline justify-between border-t border-[rgba(27,22,63,0.2)] pt-1.5 text-[11.3px]">
                <span className="font-semibold text-[#201e1d]">relevance(p)</span>
                <span className="font-bold text-[#6d57fc]">{selected.relevance}</span>
              </div>
            </div>
          )}

          {selected.artists && selected.artists.length > 0 && (
            <div className="space-y-1.5">
              <p className="text-[9.5px] font-semibold tracking-[1.14px] text-[rgba(27,22,63,0.5)]">
                연관 아티스트
              </p>
              <div className="flex flex-wrap gap-1">
                {selected.artists.map((artist) => (
                  <span
                    key={artist.name}
                    className={cn(
                      'px-2.5 py-1 text-[11px] tracking-[0.22px]',
                      artist.solid
                        ? 'bg-[#fff2ef] text-[#7c1405]'
                        : 'border border-[#ec3013] text-[#ec3013]',
                    )}
                  >
                    {artist.name}
                  </span>
                ))}
              </div>
            </div>
          )}

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
        </div>
      </div>
    </div>
  )
}
