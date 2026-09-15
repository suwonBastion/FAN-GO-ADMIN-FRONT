import { useMutation, useQueryClient } from '@tanstack/react-query'
import { ChevronDown } from 'lucide-react'
import { useEffect, useMemo, useState } from 'react'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { api } from '@/lib/api'
import { cn } from '@/lib/utils'

interface CategoryItem {
  ctg_no: number
  ctg_nm: string
  ctg_type_no: number
  ctg_type_nm: string
}

interface ArtistItem {
  artist_no: number
  artist_nm: string
  artist_group_no: number
  group_nm: string
}

interface OpStatusItem {
  op_status_no: number
  op_status_nm: string
}

interface NewEventDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  categories: CategoryItem[]
  artists: ArtistItem[]
  opStatuses: OpStatusItem[]
}

interface NewEventPayload {
  event_nm: string
  start_dt?: string
  end_dt?: string
  add: string
  event_desc?: string
  event_dtl?: string
  event_lat: string
  event_lon: string
  op_status_no: number
  ctg_no: number
  artist_no?: number
  artist_group_no?: number
}

interface NewEventResult {
  msg?: string
}

const fieldLabelCls = 'text-[11px] text-[rgba(27,22,63,0.6)]'
const inputCls =
  'w-full border border-[rgba(32,30,29,0.4)] bg-[#eae9e9] px-2.5 py-2 text-[12px] text-[#201e1d] outline-none focus:border-[#6d57fc]'
const selectCls =
  'w-full appearance-none border border-[rgba(32,30,29,0.4)] bg-[#eae9e9] px-2.5 py-2 text-[12px] text-[#201e1d] outline-none focus:border-[#6d57fc]'

function emptyState() {
  return {
    event_nm: '',
    start_dt: '',
    end_dt: '',
    add: '',
    event_desc: '',
    event_dtl: '',
    event_lat: '',
    event_lon: '',
    typeNo: null as number | null,
    ctgNo: null as number | null,
    groupNo: null as number | null,
    artistNo: null as number | null,
    statusNo: null as number | null,
  }
}

export function NewEventDialog({
  open,
  onOpenChange,
  categories,
  artists,
  opStatuses,
}: NewEventDialogProps) {
  const [form, setForm] = useState(emptyState())
  const queryClient = useQueryClient()

  useEffect(() => {
    if (open) setForm(emptyState())
  }, [open])

  const typeOptions = useMemo(() => {
    const seen = new Map<number, string>()
    for (const c of categories) {
      if (!seen.has(c.ctg_type_no)) seen.set(c.ctg_type_no, c.ctg_type_nm)
    }
    return Array.from(seen, ([ctg_type_no, ctg_type_nm]) => ({ ctg_type_no, ctg_type_nm }))
  }, [categories])

  const detailOptions = useMemo(
    () => categories.filter((c) => c.ctg_type_no === form.typeNo),
    [categories, form.typeNo],
  )

  const groupOptions = useMemo(() => {
    const seen = new Map<number, string>()
    for (const a of artists) {
      if (!seen.has(a.artist_group_no)) seen.set(a.artist_group_no, a.group_nm)
    }
    return Array.from(seen, ([artist_group_no, group_nm]) => ({ artist_group_no, group_nm }))
  }, [artists])

  const artistOptions = useMemo(
    () => artists.filter((a) => a.artist_group_no === form.groupNo),
    [artists, form.groupNo],
  )

  const createMutation = useMutation({
    mutationFn: async (payload: NewEventPayload) => {
      const { data } = await api.post<NewEventResult>('/eventList/newevent', null, {
        params: payload,
      })
      return data
    },
    onSuccess: (result) => {
      queryClient.invalidateQueries({ queryKey: ['eventlist'] })
      alert(result.msg ?? '등록되었습니다.')
      onOpenChange(false)
    },
    onError: () => {
      alert('등록에 실패했습니다.')
    },
  })

  const handleSubmit = () => {
    if (!form.event_nm.trim()) return alert('이벤트명/장소명을 입력해주세요.')
    if (!form.add.trim()) return alert('주소를 입력해주세요.')
    if (!form.event_lat.trim() || !form.event_lon.trim()) return alert('위도/경도를 입력해주세요.')
    if (form.statusNo === null) return alert('상태를 선택해주세요.')
    if (form.ctgNo === null) return alert('유형 상세를 선택해주세요.')

    const payload: NewEventPayload = {
      event_nm: form.event_nm,
      add: form.add,
      event_lat: form.event_lat,
      event_lon: form.event_lon,
      op_status_no: form.statusNo,
      ctg_no: form.ctgNo,
    }
    if (form.start_dt) payload.start_dt = form.start_dt
    if (form.end_dt) payload.end_dt = form.end_dt
    if (form.event_desc) payload.event_desc = form.event_desc
    if (form.event_dtl) payload.event_dtl = form.event_dtl
    if (form.artistNo !== null) payload.artist_no = form.artistNo
    if (form.groupNo !== null) payload.artist_group_no = form.groupNo

    createMutation.mutate(payload)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-[560px] gap-0 rounded-none border-none bg-white p-0 shadow-[0px_20px_60px_0px_rgba(27,22,63,0.25)] sm:max-w-[560px]">
        <DialogHeader className="gap-1 border-b border-[#e8e4ff] px-6 py-5">
          <p className="text-[10px] font-semibold tracking-[1.4px] text-[#6d57fc]">
            AD-02 / EVENTS & PLACES
          </p>
          <DialogTitle className="text-xl font-bold tracking-[-0.32px] text-[#201e1d]">
            신규 이벤트 등록
          </DialogTitle>
        </DialogHeader>

        <div className="flex max-h-[70vh] flex-col gap-4 overflow-auto px-6 py-5">
          <div className="space-y-1">
            <p className={fieldLabelCls}>이벤트명/장소명 *</p>
            <input
              autoFocus
              value={form.event_nm}
              onChange={(e) => setForm((f) => ({ ...f, event_nm: e.target.value }))}
              placeholder="예) 성수 팝업 스토어"
              className={cn(inputCls, 'font-semibold')}
            />
          </div>

          <div className="space-y-1">
            <p className={fieldLabelCls}>유형</p>
            <div className="flex divide-x divide-[rgba(32,30,29,0.2)] border border-[rgba(32,30,29,0.4)]">
              {typeOptions.length === 0 && (
                <span className="flex-1 py-2 text-center text-[11.5px] text-[rgba(32,30,29,0.4)]">
                  불러오는 중...
                </span>
              )}
              {typeOptions.map((option) => (
                <button
                  key={option.ctg_type_no}
                  type="button"
                  onClick={() =>
                    setForm((f) => ({ ...f, typeNo: option.ctg_type_no, ctgNo: null }))
                  }
                  className={cn(
                    'flex-1 py-2 text-center text-[11.5px] font-semibold',
                    option.ctg_type_no === form.typeNo
                      ? 'bg-[#6d57fc] text-white'
                      : 'text-[rgba(32,30,29,0.7)]',
                  )}
                >
                  {option.ctg_type_nm}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-1">
            <p className={fieldLabelCls}>유형 상세 *</p>
            <div className="relative">
              <select
                value={form.ctgNo ?? ''}
                onChange={(e) => setForm((f) => ({ ...f, ctgNo: Number(e.target.value) }))}
                disabled={detailOptions.length === 0}
                className={selectCls}
              >
                <option value="" disabled>
                  선택
                </option>
                {detailOptions.map((option) => (
                  <option key={option.ctg_no} value={option.ctg_no}>
                    {option.ctg_nm}
                  </option>
                ))}
              </select>
              <ChevronDown className="pointer-events-none absolute top-1/2 right-2.5 size-3.5 -translate-y-1/2 text-[rgba(32,30,29,0.5)]" />
            </div>
          </div>

          <div className="flex gap-2">
            <div className="flex-1 space-y-1">
              <p className={fieldLabelCls}>시작일</p>
              <input
                type="date"
                value={form.start_dt}
                onChange={(e) => setForm((f) => ({ ...f, start_dt: e.target.value }))}
                className={inputCls}
              />
            </div>
            <div className="flex-1 space-y-1">
              <p className={fieldLabelCls}>종료일</p>
              <input
                type="date"
                value={form.end_dt}
                onChange={(e) => setForm((f) => ({ ...f, end_dt: e.target.value }))}
                className={inputCls}
              />
            </div>
          </div>

          <div className="space-y-1">
            <p className={fieldLabelCls}>주소 (FULL ADDRESS) *</p>
            <input
              value={form.add}
              onChange={(e) => setForm((f) => ({ ...f, add: e.target.value }))}
              placeholder="예) 서울특별시 성동구 ..."
              className={inputCls}
            />
          </div>

          <div className="flex gap-2">
            <div className="flex-1 space-y-1">
              <p className={fieldLabelCls}>위도 (LAT) *</p>
              <input
                value={form.event_lat}
                onChange={(e) => setForm((f) => ({ ...f, event_lat: e.target.value }))}
                placeholder="예) 37.5445"
                inputMode="decimal"
                className={inputCls}
              />
            </div>
            <div className="flex-1 space-y-1">
              <p className={fieldLabelCls}>경도 (LON) *</p>
              <input
                value={form.event_lon}
                onChange={(e) => setForm((f) => ({ ...f, event_lon: e.target.value }))}
                placeholder="예) 127.0559"
                inputMode="decimal"
                className={inputCls}
              />
            </div>
          </div>

          <div className="flex gap-2">
            <div className="flex-1 space-y-1">
              <p className={fieldLabelCls}>그룹</p>
              <div className="relative">
                <select
                  value={form.groupNo ?? ''}
                  onChange={(e) =>
                    setForm((f) => ({
                      ...f,
                      groupNo: e.target.value ? Number(e.target.value) : null,
                      artistNo: null,
                    }))
                  }
                  className={selectCls}
                >
                  <option value="">선택 안 함</option>
                  {groupOptions.map((option) => (
                    <option key={option.artist_group_no} value={option.artist_group_no}>
                      {option.group_nm}
                    </option>
                  ))}
                </select>
                <ChevronDown className="pointer-events-none absolute top-1/2 right-2.5 size-3.5 -translate-y-1/2 text-[rgba(32,30,29,0.5)]" />
              </div>
            </div>
            <div className="flex-1 space-y-1">
              <p className={fieldLabelCls}>아티스트</p>
              <div className="relative">
                <select
                  value={form.artistNo ?? ''}
                  onChange={(e) =>
                    setForm((f) => ({
                      ...f,
                      artistNo: e.target.value ? Number(e.target.value) : null,
                    }))
                  }
                  disabled={artistOptions.length === 0}
                  className={selectCls}
                >
                  <option value="">선택 안 함</option>
                  {artistOptions.map((option) => (
                    <option key={option.artist_no} value={option.artist_no}>
                      {option.artist_nm}
                    </option>
                  ))}
                </select>
                <ChevronDown className="pointer-events-none absolute top-1/2 right-2.5 size-3.5 -translate-y-1/2 text-[rgba(32,30,29,0.5)]" />
              </div>
            </div>
          </div>

          <div className="space-y-1">
            <p className={fieldLabelCls}>상태 *</p>
            <div className="flex divide-x divide-[rgba(32,30,29,0.2)] border border-[rgba(32,30,29,0.4)]">
              {opStatuses.length === 0 && (
                <span className="flex-1 py-2 text-center text-[11.5px] text-[rgba(32,30,29,0.4)]">
                  불러오는 중...
                </span>
              )}
              {opStatuses.map((option) => (
                <button
                  key={option.op_status_no}
                  type="button"
                  onClick={() => setForm((f) => ({ ...f, statusNo: option.op_status_no }))}
                  className={cn(
                    'flex-1 py-2 text-center text-[11.5px] font-semibold',
                    option.op_status_no === form.statusNo
                      ? 'bg-[#6d57fc] text-white'
                      : 'text-[rgba(32,30,29,0.7)]',
                  )}
                >
                  {option.op_status_nm}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-1">
            <p className={fieldLabelCls}>이벤트 설명</p>
            <textarea
              value={form.event_desc}
              onChange={(e) => setForm((f) => ({ ...f, event_desc: e.target.value }))}
              rows={2}
              className={cn(inputCls, 'min-h-9 resize-none')}
            />
          </div>

          <div className="space-y-1">
            <p className={fieldLabelCls}>이벤트 상세</p>
            <textarea
              value={form.event_dtl}
              onChange={(e) => setForm((f) => ({ ...f, event_dtl: e.target.value }))}
              rows={3}
              className={cn(inputCls, 'min-h-16 resize-none')}
            />
          </div>
        </div>

        <div className="flex gap-2 border-t border-[#e8e4ff] px-6 py-4">
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            className="flex-1 rounded-full border-[rgba(27,22,63,0.2)] text-[#201e1d] hover:bg-[#f8f7ff]/70"
          >
            취소
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={createMutation.isPending}
            className="flex-1 rounded-full bg-[#6d57fc] hover:bg-[#6d57fc]/90"
          >
            {createMutation.isPending ? '등록 중...' : '등록'}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
