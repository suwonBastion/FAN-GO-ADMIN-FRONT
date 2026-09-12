interface PlaceholderPageProps {
  title: string
}

export function PlaceholderPage({ title }: PlaceholderPageProps) {
  return (
    <div className="flex h-full min-h-[400px] flex-col items-center justify-center gap-2 text-center">
      <h1 className="text-xl font-semibold">{title}</h1>
      <p className="text-sm text-muted-foreground">준비 중인 화면입니다.</p>
    </div>
  )
}
