'use client'

import { ManagerWorkspaceShell } from '@/components/manager/manager-workspace-shell'
import { RewardSection, type RewardWinner } from '@/components/manager/reward-section'
import { useManagerDashboardData } from '@/components/manager/use-manager-dashboard-data'

export default function ManagerRewardManagementPage() {
  const { isAuthorized, userId, allSubmissions } = useManagerDashboardData()

  const latestWinner: RewardWinner | null = (() => {
    const w = allSubmissions.find((s) => s.status === 'winner')
    if (!w) return null
    return { nickname: w.freelancerName, questTitle: w.questTitle, questId: Number(w.questId), memberId: w.memberId, rewardAmount: w.rewardAmount }
  })()

  return (
    <ManagerWorkspaceShell
      title="보상 관리"
      description="우승자 선정 이후 지급 예정 보상과 결제 상태를 한곳에서 관리해보세요."
      isAuthorized={isAuthorized}
    >
      <RewardSection winner={latestWinner} userId={userId} />
    </ManagerWorkspaceShell>
  )
}
