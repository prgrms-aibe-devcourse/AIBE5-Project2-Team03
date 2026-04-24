'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'
// import { Check } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'

export default function SignupPage() {
  const [formData, setFormData] = useState({
    username: '',
    nickname: '',
    email: '',
    password: '',
    roleType: '',
  })

  // const [emailCodeSent, setEmailCodeSent] = useState(false)
  // const [emailCode, setEmailCode] = useState('')
  // const [emailVerified, setEmailVerified] = useState(false)

  useEffect(() => {
    const requestedRole = new URLSearchParams(window.location.search).get('role')

    if (requestedRole === 'MANAGER' || requestedRole === 'MEMBER') {
      setFormData(prev => ({ ...prev, roleType: requestedRole }))
    }
  }, [])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
    // if (name === 'email') {
    //   setEmailCodeSent(false)
    //   setEmailVerified(false)
    //   setEmailCode('')
    // }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!formData.roleType) {
      alert('역할을 선택해주세요.')
      return
    }

    try {
      //8000 포트의 벡엔드 호출
      const response = await fetch('http://localhost:8000/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })

      if (response.ok) {
        alert('회원가입이 완료되었습니다!')
        window.location.href = '/'
      } else {
        const errorData = await response.json()
        alert(`회원가입 실패: ${errorData.message || '알 수 없는 오류'}`)
      }
    } catch (error) {
      console.error('회원가입 중 오류:', error)
    }
  }

  // const sendVerificationCode = () => {
  //   // TODO: API call to send email verification code
  //   setEmailCodeSent(true)
  // }

  // const verifyCode = () => {
  //   // TODO: API call to verify email code
  //   if (emailCode.trim()) {
  //     setEmailVerified(true)
  //   }
  // }

  return (
    <main className="flex min-h-screen items-center justify-center bg-surface px-4 py-12">
      <div className="w-full max-w-md rounded-2xl border border-border bg-background p-8 shadow-lg shadow-primary/5">
        <div className="mb-8 text-center">
          <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-primary text-lg font-bold text-primary-foreground">
            Q
          </div>
          <h1 className="text-2xl font-bold text-foreground">회원가입</h1>
          <p className="mt-2 text-sm text-foreground-muted">
            QuestWork 계정을 새로 만들어보세요
          </p>
        </div>

        <form className="space-y-4" onSubmit={handleSubmit}>
          <div className="space-y-2">
            <Label htmlFor="name">이름</Label>
            <Input
              id="name"
              name="username"
              value={formData.username}
              onChange={handleChange}
              placeholder="이름을 입력하세요"
              className="h-12 bg-surface"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <label className={`cursor-pointer rounded-2xl border px-4 py-3 text-center transition ${formData.roleType === 'MEMBER' ? 'border-primary bg-primary/10 text-primary' : 'border-border bg-surface text-foreground'}`}>
              <input
                  type="radio"
                  name="roleType" // name도 변경
                  value="MEMBER"  // individual -> MEMBER로 변경
                  checked={formData.roleType === 'MEMBER'}
                  onChange={handleChange}
                  className="sr-only"
              />
              개인
            </label>

            <label className={`cursor-pointer rounded-2xl border px-4 py-3 text-center transition ${formData.roleType === 'MANAGER' ? 'border-primary bg-primary/10 text-primary' : 'border-border bg-surface text-foreground'}`}>
              <input
                  type="radio"
                  name="roleType" // name도 변경
                  value="MANAGER" // manager -> MANAGER로 변경
                  checked={formData.roleType === 'MANAGER'}
                  onChange={handleChange}
                  className="sr-only"
              />
              매니저
            </label>
          </div>

          <div className="space-y-2">
            <Label htmlFor="nickname">닉네임</Label>
            <Input
              id="nickname"
              name="nickname"
              value={formData.nickname}
              onChange={handleChange}
              placeholder="닉네임을 입력하세요"
              className="h-12 bg-surface"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">이메일</Label>
            <Input
              id="email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="example@email.com"
              className="h-12 bg-surface"
            />
            {/* 이메일 인증 UI
            <div className="flex gap-2">
              <Input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="example@email.com"
                className="h-12 bg-surface"
                disabled={emailVerified}
              />
              <Button
                type="button"
                onClick={sendVerificationCode}
                disabled={!formData.email || emailVerified}
                className="h-12 shrink-0 bg-primary text-primary-foreground hover:bg-primary-hover disabled:opacity-50"
              >
                {emailVerified ? '인증완료' : '코드 발송'}
              </Button>
            </div>
            {emailCodeSent && !emailVerified && (
              <div className="flex gap-2">
                <Input
                  value={emailCode}
                  onChange={e => setEmailCode(e.target.value)}
                  placeholder="인증 코드를 입력하세요"
                  className="h-12 bg-surface"
                />
                <Button
                  type="button"
                  onClick={verifyCode}
                  className="h-12 shrink-0 bg-primary text-primary-foreground hover:bg-primary-hover"
                >
                  확인
                </Button>
              </div>
            )}
            {emailVerified && (
              <p className="flex items-center gap-1 text-sm text-success">
                <Check className="h-4 w-4" /> 이메일이 인증되었습니다
              </p>
            )}
            */}
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">비밀번호</Label>
            <Input
              id="password"
              name="password"
              type="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="비밀번호를 입력하세요"
              className="h-12 bg-surface"
            />
          </div>

          <Button type="submit" className="h-12 w-full bg-primary text-primary-foreground hover:bg-primary-hover">
            회원가입
          </Button>
        </form>

        <p className="mt-6 text-center text-sm text-foreground-muted">
          이미 계정이 있으신가요?{' '}
          <Link href="/login" className="font-medium text-primary hover:underline">
            로그인
          </Link>
        </p>
      </div>
    </main>
  )
}
