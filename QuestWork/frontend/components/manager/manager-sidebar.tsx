'use client'

import { useState, useEffect } from 'react' // 💡 useState, useEffect 추가
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'

interface NavItem {
  label: string
  href: string
  icon: React.ReactNode
}

const NAV_ITEMS: NavItem[] = [
  {
    label: '대시보드',
    href: '/manager',
    icon: (
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
        <rect x="1" y="1" width="6" height="6" rx="1" stroke="currentColor" strokeWidth="1.5" />
        <rect x="9" y="1" width="6" height="6" rx="1" stroke="currentColor" strokeWidth="1.5" />
        <rect x="1" y="9" width="6" height="6" rx="1" stroke="currentColor" strokeWidth="1.5" />
        <rect x="9" y="9" width="6" height="6" rx="1" stroke="currentColor" strokeWidth="1.5" />
      </svg>
    ),
  },
  {
    label: '등록된 퀘스트',
    href: '/manager/quests',
    icon: (
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
        <path d="M2 2h12v12H2z" stroke="currentColor" strokeWidth="1.5" />
        <path d="M2 5h12M5 2v12" stroke="currentColor" strokeWidth="1.5" />
      </svg>
    ),
  },
  {
    label: '제출 현황',
    href: '/manager/submissions',
    icon: (
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
        <path d="M2 3h12M2 8h8M2 13h10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    label: '보상 관리',
    href: '/manager/rewards',
    icon: (
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
        <circle cx="8" cy="8" r="6.5" stroke="currentColor" strokeWidth="1.5" />
        <path d="M8 4.5v7M6 6.5c0-.83.67-1.5 2-1.5s2 .67 2 1.5-1 1.5-2 1.5-2 .67-2 1.5.67 1.5 2 1.5 2-.67 2-1.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    label: '설정',
    href: '/manager/settings',
    icon: (
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
        <circle cx="8" cy="8" r="2.5" stroke="currentColor" strokeWidth="1.5" />
        <path d="M8 1v2M8 13v2M1 8h2M13 8h2M2.93 2.93l1.41 1.41M11.66 11.66l1.41 1.41M2.93 13.07l1.41-1.41M11.66 4.34l1.41-1.41" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      </svg>
    ),
  },
]

export function ManagerSidebar() {
    const pathname = usePathname()

    // 💡 상태 추가: 기본값은 빈 문자열 또는 로딩용 텍스트
    const [userInfo, setUserInfo] = useState({
        nickname: '',
        initial: 'M' // 이름의 첫 글자 대용
    })

    useEffect(() => {
        const savedNickname = localStorage.getItem('nickname') || '매니저'
        const savedRole = localStorage.getItem('role') || 'MANAGER'

        setUserInfo({
            nickname: savedNickname,
            initial: savedNickname.charAt(0).toUpperCase(),
            role: savedRole // 유저 권한 정보도 추가로 저장
        })
    }, [])

  return (
      <aside className="hidden w-56 flex-shrink-0 border-r border-border bg-surface lg:flex lg:flex-col">
          {/* Company Info */}
          <div className="border-b border-border p-5">
              <div className="flex items-center gap-3">
                  {/* 💡 T 대신 이름의 첫 글자(initial)가 나오도록 수정 */}
                  <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full bg-primary text-sm font-bold text-primary-foreground">
                      {userInfo.initial}
                  </div>
                  <div className="min-w-0">
                      <p className="truncate text-sm font-semibold text-foreground">
                          {userInfo.nickname}
                      </p>
                      <p className="truncate text-xs text-foreground-muted">
                          {userInfo.role === 'ADMIN' ? '관리자' : '매니저'}
                      </p>
                  </div>
              </div>
          </div>

      {/* Navigation */}
      <nav className="flex-1 p-3" aria-label="매니저 내비게이션">
        <ul className="space-y-0.5">
          {NAV_ITEMS.map((item) => {
            const isActive = pathname === item.href
            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className={cn(
                    'flex items-center gap-2.5 rounded-md px-3 py-2 text-sm font-medium transition-colors',
                    isActive
                      ? 'bg-primary-light text-primary'
                      : 'text-foreground-muted hover:bg-surface-raised hover:text-foreground'
                  )}
                  aria-current={isActive ? 'page' : undefined}
                >
                  <span
                    className={cn(
                      'flex-shrink-0',
                      isActive ? 'text-primary' : 'text-foreground-muted'
                    )}
                  >
                    {item.icon}
                  </span>
                  {item.label}
                </Link>
              </li>
            )
          })}
        </ul>
      </nav>
    </aside>
  )
}
