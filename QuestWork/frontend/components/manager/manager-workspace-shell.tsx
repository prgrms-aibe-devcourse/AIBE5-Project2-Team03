'use client'

import type { ReactNode } from 'react'
import { AlertCircle } from 'lucide-react'
import { GlobalNav } from '@/components/global-nav'
import { DashboardShell } from '@/components/dashboard/dashboard-shell'
import { ManagerSidebar } from '@/components/manager/manager-sidebar'

interface ManagerWorkspaceShellProps {
  title: string
  description: string
  eyebrow?: string
  isAuthorized: boolean | null
  children: ReactNode
}

export function ManagerWorkspaceShell({
  title,
  description,
  eyebrow = 'Manager Workspace',
  isAuthorized,
  children,
}: ManagerWorkspaceShellProps) {
  return (
    <div className="min-h-screen bg-background">
      <GlobalNav />

      <DashboardShell sidebar={<ManagerSidebar />}>
        <div className="space-y-8">
          {isAuthorized === false && (
            <div className="flex gap-3 rounded-lg border border-red-200 bg-red-50 p-4">
              <AlertCircle className="h-5 w-5 flex-shrink-0 text-red-600" />
              <div>
                <p className="font-semibold text-red-900">
                  매니저 권한이 필요합니다.
                </p>
                <p className="mt-1 text-sm text-red-700">
                  이 화면은 매니저 계정으로 로그인한 뒤 사용할 수 있습니다.
                </p>
              </div>
            </div>
          )}

          <div>
            <p className="text-sm font-semibold text-primary">{eyebrow}</p>
            <h1 className="mt-1 text-3xl font-bold text-foreground">{title}</h1>
            <p className="mt-2 max-w-3xl text-foreground-muted">
              {description}
            </p>
          </div>

          {children}
        </div>
      </DashboardShell>
    </div>
  )
}
