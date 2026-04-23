'use client'

import { ManagerWorkspaceShell } from '@/components/manager/manager-workspace-shell'
import { RewardSection } from '@/components/manager/reward-section'
import { useManagerDashboardData } from '@/components/manager/use-manager-dashboard-data'

export default function ManagerRewardManagementPage() {
  const { isAuthorized } = useManagerDashboardData()

  return (
    <ManagerWorkspaceShell
      title="보상 관리"
      description="우승자 선정 이후 지급 예정 보상과 결제 상태를 한곳에서 관리해보세요."
      isAuthorized={isAuthorized}
    >
      <RewardSection />
    </ManagerWorkspaceShell>
  )
}
