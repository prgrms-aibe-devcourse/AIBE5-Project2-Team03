'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useEffect, useState, type ReactNode } from 'react'
import { cn } from '@/lib/utils'

interface NavItem {
  label: string
  href: string
  icon: ReactNode
}

const NAV_ITEMS: NavItem[] = [
  {
    label: '개요',
    href: '/manager',
    icon: (
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
        <rect
          x="1.5"
          y="1.5"
          width="5"
          height="5"
          rx="1"
          stroke="currentColor"
          strokeWidth="1.5"
        />
        <rect
          x="9.5"
          y="1.5"
          width="5"
          height="5"
          rx="1"
          stroke="currentColor"
          strokeWidth="1.5"
        />
        <rect
          x="1.5"
          y="9.5"
          width="5"
          height="5"
          rx="1"
          stroke="currentColor"
          strokeWidth="1.5"
        />
        <rect
          x="9.5"
          y="9.5"
          width="5"
          height="5"
          rx="1"
          stroke="currentColor"
          strokeWidth="1.5"
        />
      </svg>
    ),
  },
  {
    label: '등록한 퀘스트',
    href: '/manager/posted-quests',
    icon: (
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
        <path
          d="M3 2.5h10a1 1 0 0 1 1 1V13a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1V3.5a1 1 0 0 1 1-1z"
          stroke="currentColor"
          strokeWidth="1.5"
        />
        <path
          d="M4.75 5.5h6.5M4.75 8h6.5M4.75 10.5h3.5"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
        />
      </svg>
    ),
  },
  {
    label: '제출 검토',
    href: '/manager/submission-review',
    icon: (
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
        <path
          d="M3 2.5h7l3 3V13a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1V3.5a1 1 0 0 1 1-1z"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinejoin="round"
        />
        <path
          d="M10 2.5V5a1 1 0 0 0 1 1h2M4.75 8.5h6.5M4.75 11h4"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
        />
      </svg>
    ),
  },
  {
    label: '보상 관리',
    href: '/manager/reward-management',
    icon: (
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
        <circle cx="8" cy="8" r="6.5" stroke="currentColor" strokeWidth="1.5" />
        <path
          d="M8 4.5v7M6 6.5c0-.83.67-1.5 2-1.5s2 .67 2 1.5-1 1.5-2 1.5-2 .67-2 1.5.67 1.5 2 1.5 2-.67 2-1.5"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
        />
      </svg>
    ),
  },
  {
    label: '프로필 설정',
    href: '/manager/profile-settings',
    icon: (
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
        <circle cx="8" cy="8" r="2.5" stroke="currentColor" strokeWidth="1.5" />
        <path
          d="M8 1v2M8 13v2M1 8h2M13 8h2M2.93 2.93l1.41 1.41M11.66 11.66l1.41 1.41M2.93 13.07l1.41-1.41M11.66 4.34l1.41-1.41"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
        />
      </svg>
    ),
  },
]

export function ManagerSidebar() {
  const pathname = usePathname()
  const [userInfo, setUserInfo] = useState({
    nickname: 'Manager',
    initial: 'M',
    roleLabel: '매니저 워크스페이스',
  })

  useEffect(() => {
    const savedNickname = localStorage.getItem('nickname') || 'Manager'
    const savedRole = localStorage.getItem('role') || 'MANAGER'

    setUserInfo({
      nickname: savedNickname,
      initial: savedNickname.charAt(0).toUpperCase() || 'M',
      roleLabel:
        savedRole === 'ADMIN'
          ? '관리자 워크스페이스'
          : '매니저 워크스페이스',
    })
  }, [])

  return (
    <aside className="sticky top-[73px] hidden h-[calc(100vh-73px)] w-56 flex-shrink-0 self-start overflow-y-auto border-r border-border bg-surface lg:flex lg:flex-col">
      <div className="border-b border-border px-5 py-4">
        <p className="text-xs font-semibold uppercase tracking-[0.12em] text-foreground-subtle">
          Manager
        </p>
        <div className="mt-3 flex items-center gap-3">
          <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full bg-primary text-sm font-bold text-primary-foreground">
            {userInfo.initial}
          </div>
          <div className="min-w-0">
            <p className="truncate text-sm font-semibold text-foreground">
              {userInfo.nickname}
            </p>
            <p className="mt-0.5 truncate text-xs text-foreground-muted">
              {userInfo.roleLabel}
            </p>
          </div>
        </div>
      </div>

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
                      : 'text-foreground-muted hover:bg-surface-raised hover:text-foreground',
                  )}
                  aria-current={isActive ? 'page' : undefined}
                >
                  <span
                    className={cn(
                      'flex-shrink-0',
                      isActive ? 'text-primary' : 'text-foreground-muted',
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

      <div className="border-t border-border p-3">
        <Link
          href="/manager/create-quest"
          className="flex w-full items-center gap-2.5 rounded-md px-3 py-2 text-sm font-medium text-foreground-muted transition-colors hover:bg-surface-raised hover:text-foreground"
        >
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <path
              d="M3 8h10M8 3v10"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
            />
          </svg>
          퀘스트 생성
        </Link>
      </div>
    </aside>
  )
}
