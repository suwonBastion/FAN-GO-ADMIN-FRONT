import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useAuthStore } from '@/store/useAuthStore'

export function LoginPage() {
  const navigate = useNavigate()
  const login = useAuthStore((state) => state.login)
  const [userName, setUserName] = useState('')
  const [password, setPassword] = useState('')

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault()
    login({ id: userName, email: userName, name: userName }, 'dev-access-token')
    navigate('/', { replace: true })
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="w-full max-w-[392px] rounded-3xl border border-[rgba(32,30,29,0.18)] bg-white p-6 shadow-[0px_3px_10px_0px_rgba(32,30,29,0.1)]">
        <p className="mb-6 text-xs text-[rgba(20,18,31,0.6)]">관리자 계정으로 로그인하세요.</p>
        <form className="space-y-5" onSubmit={handleSubmit}>
          <div className="space-y-2">
            <Label
              htmlFor="userName"
              className="font-mono text-[10px] tracking-[1px] text-[rgba(20,18,31,0.55)] uppercase"
            >
              User Name
            </Label>
            <Input
              id="userName"
              value={userName}
              onChange={(event) => setUserName(event.target.value)}
              className="h-[42px] rounded-none border-[rgba(20,18,31,0.28)]"
              autoComplete="username"
              required
            />
          </div>
          <div className="space-y-2">
            <Label
              htmlFor="password"
              className="font-mono text-[10px] tracking-[1px] text-[rgba(20,18,31,0.55)] uppercase"
            >
              Password
            </Label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              className="h-[42px] rounded-none border-[rgba(20,18,31,0.28)]"
              autoComplete="current-password"
              required
            />
          </div>
          <Button
            type="submit"
            className="h-[43px] w-full rounded-none bg-[#6d5cff] font-bold tracking-[0.28px] text-white hover:bg-[#6d5cff]/90"
          >
            로그인
          </Button>
        </form>
      </div>
    </div>
  )
}
