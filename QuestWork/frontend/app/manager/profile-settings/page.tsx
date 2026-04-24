'use client'

import { ManagerProfileForm } from '@/components/manager/manager-profile-form'
import { ManagerWorkspaceShell } from '@/components/manager/manager-workspace-shell'
import { useManagerDashboardData } from '@/components/manager/use-manager-dashboard-data'
import { Card } from '@/components/ui/card'

export default function ManagerProfileSettingsPage() {
  const { isAuthorized, userId } = useManagerDashboardData()

  return (
    <ManagerWorkspaceShell
      title="프로필 설정"
      description="매니저 계정의 기본 정보와 회사 정보를 업데이트해보세요."
      isAuthorized={isAuthorized}
    >
      {userId ? (
        <ManagerProfileForm userId={userId} />
      ) : (
        <Card className="border border-dashed border-border p-10 text-center text-muted-foreground shadow-none">
          매니저 프로필 정보를 불러오는 중입니다...
        </Card>
      )}
    </ManagerWorkspaceShell>
  )
}
