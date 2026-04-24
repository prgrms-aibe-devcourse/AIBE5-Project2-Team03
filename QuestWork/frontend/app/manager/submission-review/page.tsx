'use client'

import { ManagerWorkspaceShell } from '@/components/manager/manager-workspace-shell'
import { SubmissionsReviewSection } from '@/components/manager/submissions-review-section'
import { useManagerDashboardData } from '@/components/manager/use-manager-dashboard-data'

export default function ManagerSubmissionReviewPage() {
  const { allSubmissions, isAuthorized } = useManagerDashboardData()

  return (
    <ManagerWorkspaceShell
      title="제출 검토"
      description="제출된 결과물을 비교하고, 우승자 선정 전 필요한 검토를 진행해보세요."
      isAuthorized={isAuthorized}
    >
      <SubmissionsReviewSection submissions={allSubmissions} />
    </ManagerWorkspaceShell>
  )
}
