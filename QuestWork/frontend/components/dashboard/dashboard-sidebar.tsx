'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import type { ReactNode } from 'react'
import { cn } from '@/lib/utils'

interface NavItem {
  label: string
  href: string
  icon: ReactNode
}

const NAV_ITEMS: NavItem[] = [
  {
    label: 'Overview',
    href: '/dashboard',
    icon: (
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
        <rect x="1.5" y="1.5" width="5" height="5" rx="1" stroke="currentColor" strokeWidth="1.5" />
        <rect x="9.5" y="1.5" width="5" height="5" rx="1" stroke="currentColor" strokeWidth="1.5" />
        <rect x="1.5" y="9.5" width="5" height="5" rx="1" stroke="currentColor" strokeWidth="1.5" />
        <rect x="9.5" y="9.5" width="5" height="5" rx="1" stroke="currentColor" strokeWidth="1.5" />
      </svg>
    ),
  },
  {
    label: 'My Quests',
    href: '/dashboard/my-quests',
    icon: (
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
        <path d="M8 1.75L2.5 4.5v3.75c0 3.04 2.46 5.5 5.5 5.5s5.5-2.46 5.5-5.5V4.5L8 1.75z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
        <path d="M5.75 8.25L7.25 9.75L10.5 6.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
  },
  {
    label: 'My Submissions',
    href: '/dashboard/my-submissions',
    icon: (
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
        <path d="M3 2.5h7l3 3V13a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1V3.5a1 1 0 0 1 1-1z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
        <path d="M10 2.5V5a1 1 0 0 0 1 1h2M4.75 8.5h6.5M4.75 11h4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    label: 'Earnings',
    href: '/dashboard/earnings',
    icon: (
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
        <circle cx="8" cy="8" r="6.5" stroke="currentColor" strokeWidth="1.5" />
        <path d="M8 4.5v7M6 6.5c0-.83.67-1.5 2-1.5s2 .67 2 1.5-1 1.5-2 1.5-2 .67-2 1.5.67 1.5 2 1.5 2-.67 2-1.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    label: 'Blog Management',
    href: '/dashboard/blog-management',
    icon: (
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
        <path d="M3 2.5h10a1 1 0 0 1 1 1V13a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1V3.5a1 1 0 0 1 1-1z" stroke="currentColor" strokeWidth="1.5" />
        <path d="M4.75 5.5h6.5M4.75 8h6.5M4.75 10.5h3.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      </svg>
    ),
  },
]

export function DashboardSidebar() {
  const pathname = usePathname()

  return (
    <aside className="hidden w-56 flex-shrink-0 border-r border-border bg-surface lg:flex lg:flex-col">
      <div className="border-b border-border p-5">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full bg-primary text-sm font-bold text-primary-foreground">
            Q
          </div>
          <div className="min-w-0">
            <p className="truncate text-sm font-semibold text-foreground">QuestWork</p>
            <p className="truncate text-xs text-foreground-muted">Dashboard</p>
          </div>
        </div>
      </div>

      <nav className="flex-1 p-3" aria-label="Dashboard navigation">
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
          href="/quests/web-development"
          className="flex w-full items-center gap-2.5 rounded-md px-3 py-2 text-sm font-medium text-foreground-muted transition-colors hover:bg-surface-raised hover:text-foreground"
        >
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <path d="M3 8h10M8 3v10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
          </svg>
          Find Quests
        </Link>
      </div>
    </aside>
  )
}
