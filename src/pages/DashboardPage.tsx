import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export function DashboardPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold">대시보드</h1>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle>전체 사용자</CardTitle>
          </CardHeader>
          <CardContent className="text-2xl font-bold">-</CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>오늘 가입</CardTitle>
          </CardHeader>
          <CardContent className="text-2xl font-bold">-</CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>활성 세션</CardTitle>
          </CardHeader>
          <CardContent className="text-2xl font-bold">-</CardContent>
        </Card>
      </div>
    </div>
  )
}
