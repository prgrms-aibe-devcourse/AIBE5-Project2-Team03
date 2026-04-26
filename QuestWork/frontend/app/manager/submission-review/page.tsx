'use client'

import { ManagerWorkspaceShell } from '@/components/manager/manager-workspace-shell'
import { SubmissionsReviewSection } from '@/components/manager/submissions-review-section'
import { useManagerDashboardData } from '@/components/manager/use-manager-dashboard-data'

export default function ManagerSubmissionReviewPage() {
  const { dbQuests, isAuthorized } = useManagerDashboardData()

  return (
    <ManagerWorkspaceShell
      title="제출 검토"
      description="퀘스트별 제출물을 확인하고 우승자를 선정해보세요."
      isAuthorized={isAuthorized}
    >
      <SubmissionsReviewSection quests={dbQuests} />
    </ManagerWorkspaceShell>
  )
}
