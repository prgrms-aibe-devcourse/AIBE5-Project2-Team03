'use client'

import { ManagerWorkspaceShell } from '@/components/manager/manager-workspace-shell'
import { PostedQuestsSection } from '@/components/manager/posted-quests-section'
import { useManagerDashboardData } from '@/components/manager/use-manager-dashboard-data'

export default function ManagerPostedQuestsPage() {
  const { dbQuests, isAuthorized } = useManagerDashboardData()

  return (
    <ManagerWorkspaceShell
      title="등록한 퀘스트"
      description="현재 등록한 퀘스트의 상태와 보상 금액, 제출 수를 확인해보세요."
      isAuthorized={isAuthorized}
    >
      <PostedQuestsSection quests={dbQuests} />
    </ManagerWorkspaceShell>
  )
}
