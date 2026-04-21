'use client'

import { useState, type FormEvent } from 'react'
import Link from 'next/link'
import { Eye, EyeOff } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { SignupModal } from '@/components/signup-modal'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

export function LoginForm() {
  const [showPassword, setShowPassword] = useState(false)
  const [isSignupOpen, setIsSignupOpen] = useState(false)
  const [userId, setUserId] = useState('')
  const [password, setPassword] = useState('')
  const [rememberMe, setRememberMe] = useState(false)

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    try {
      const response = await fetch('http://localhost:8000/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: userId, password }),
      })

      if (response.ok) {
        const nickname = await response.text()
        localStorage.setItem('nickname', nickname)
        window.location.href = '/'
      } else {
        const errorData = await response.json()
        alert(`로그인 실패: ${errorData.message || '아이디 또는 비밀번호를 확인해주세요'}`)
      }
    } catch (error) {
      console.error('로그인 중 오류:', error)
      alert('서버 연결에 실패했습니다.')
    }
  }


  return (
    <div className="w-full max-w-md mx-auto">
      <div className="rounded-2xl border border-border bg-background p-8 shadow-lg shadow-primary/5">
        <div className="mb-8 text-center">
          <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-primary text-lg font-bold text-primary-foreground">
            Q
          </div>
          <h1 className="text-2xl font-bold text-foreground">로그인</h1>
          <p className="mt-2 text-sm text-foreground-muted">
            서비스를 이용하려면 로그인해주세요
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="space-y-2">
            <Label htmlFor="userId" className="text-sm font-medium text-foreground">
              아이디
            </Label>
            <Input
              id="userId"
              type="text"
              placeholder="아이디를 입력하세요"
              value={userId}
              onChange={(e) => setUserId(e.target.value)}
              className="h-12 border-border bg-surface focus:border-primary focus:ring-2 focus:ring-primary/20"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="password" className="text-sm font-medium text-foreground">
              비밀번호
            </Label>
            <div className="relative">
              <Input
                id="password"
                type={showPassword ? 'text' : 'password'}
                placeholder="비밀번호를 입력하세요"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="h-12 border-border bg-surface pr-12 focus:border-primary focus:ring-2 focus:ring-primary/20"
              />
              <button
                type="button"
                aria-label="비밀번호 보기 전환"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-foreground-muted transition-colors hover:text-foreground"
              >
                {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
              </button>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Checkbox
                id="remember"
                checked={rememberMe}
                onCheckedChange={(checked) => setRememberMe(checked === true)}
              />
              <Label htmlFor="remember" className="cursor-pointer text-sm text-foreground-muted">
                로그인 상태 유지
              </Label>
            </div>
          </div>

          <Button
            type="submit"
            className="h-12 w-full bg-primary text-base font-semibold text-primary-foreground transition-all duration-200 hover:bg-primary-hover hover:shadow-md"
          >
            로그인
          </Button>
        </form>

        <div className="mt-6 flex items-center justify-center gap-4 text-sm">
          <Link href="#" className="text-foreground-muted transition-colors hover:text-foreground">
            아이디 찾기
          </Link>
          <span className="text-border-strong">|</span>
          <Link href="#" className="text-foreground-muted transition-colors hover:text-foreground">
            비밀번호 찾기
          </Link>
          <span className="text-border-strong">|</span>
          <button
            type="button"
            onClick={() => setIsSignupOpen(true)}
            className="text-foreground-muted transition-colors hover:text-foreground"
          >
            회원가입
          </button>
        </div>

        <div className="relative my-8">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-border"></div>
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="bg-background px-4 text-foreground-muted">간편 로그인</span>
          </div>
        </div>

        <div className="space-y-3">
          <button
            type="button"
            className="flex h-12 w-full items-center justify-center gap-3 rounded-lg font-medium transition-all hover:opacity-90"
            style={{ backgroundColor: '#FEE500', color: '#191600' }}
          >
            <KakaoIcon />
            <span>카카오로 로그인</span>
          </button>

          <button
            type="button"
            className="flex h-12 w-full items-center justify-center gap-3 rounded-lg font-medium text-white transition-all hover:opacity-90"
            style={{ backgroundColor: '#03C75A' }}
          >
            <NaverIcon />
            <span>네이버로 로그인</span>
          </button>

          <button
            type="button"
            className="flex h-12 w-full items-center justify-center gap-3 rounded-lg border border-border bg-white font-medium text-gray-700 transition-all hover:bg-surface"
          >
            <GoogleIcon />
            <span>Google로 로그인</span>
          </button>
        </div>
      </div>

      <p className="mt-6 text-center text-sm text-foreground-muted">
        계정이 없으신가요?{' '}
        <button
          type="button"
          onClick={() => setIsSignupOpen(true)}
          className="font-medium text-primary hover:underline"
        >
          회원가입
        </button>
      </p>

      <SignupModal open={isSignupOpen} onOpenChange={setIsSignupOpen} />
    </div>
  )
}

function KakaoIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M12 3C6.477 3 2 6.463 2 10.714c0 2.674 1.736 5.023 4.355 6.356-.13.47-.84 3.03-.867 3.223 0 0-.017.141.075.196.092.055.2.025.2.025.265-.037 3.067-2.01 3.553-2.35.888.126 1.805.192 2.684.192 5.523 0 10-3.463 10-7.643C22 6.463 17.523 3 12 3z" />
    </svg>
  )
}

function NaverIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M16.273 12.845L7.376 0H0v24h7.727V11.155L16.624 24H24V0h-7.727v12.845z" />
    </svg>
  )
}

function GoogleIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" aria-hidden="true">
      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
      <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
    </svg>
  )
}
