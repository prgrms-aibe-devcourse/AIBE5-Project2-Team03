'use client'

import { ManagerWorkspaceShell } from '@/components/manager/manager-workspace-shell'
import { RewardSection, type QuestRewardItem } from '@/components/manager/reward-section'
import { useManagerDashboardData } from '@/components/manager/use-manager-dashboard-data'

export default function ManagerRewardManagementPage() {
  const { isAuthorized, userId, dbQuests, allSubmissions } = useManagerDashboardData()

  // 퀘스트별로 winner 제출물 찾아서 RewardItem 구성
  const rewardItems: QuestRewardItem[] = dbQuests
    .map((quest) => {
      const winner = allSubmissions.find(
        (s) => s.questId === String(quest.id) && s.status === 'winner',
      )
      if (!winner) return null
      return {
        questId: quest.id,
        questTitle: quest.title,
        rewardAmount: quest.rewardAmount,
        winnerNickname: winner.freelancerName,
        winnerMemberId: winner.memberId,
        submissionId: winner.submissionId,
        submissionTitle: winner.freelancerName, // submissionTitle은 훅에서 추가 필요 시 확장
        githubUrl: winner.githubUrl,
      } satisfies QuestRewardItem
    })
    .filter((item): item is QuestRewardItem => item !== null)

  return (
    <ManagerWorkspaceShell
      title="보상 관리"
      description="우승자 선정 이후 퀘스트별 지급 예정 보상과 결제 상태를 관리해보세요."
      isAuthorized={isAuthorized}
    >
      <RewardSection items={rewardItems} userId={userId} />
    </ManagerWorkspaceShell>
  )
}

