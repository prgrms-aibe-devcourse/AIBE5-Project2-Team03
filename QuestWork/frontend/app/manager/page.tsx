'use client'

import { StatCard } from '@/components/dashboard/stat-card'
import { ManagerWorkspaceShell } from '@/components/manager/manager-workspace-shell'
import { PostedQuestsSection } from '@/components/manager/posted-quests-section'
import { RewardSection } from '@/components/manager/reward-section'
import { useManagerDashboardData } from '@/components/manager/use-manager-dashboard-data'
import { Calendar } from '@/components/ui/calendar'
import { Card } from '@/components/ui/card'

export default function ManagerDashboardPage() {
  const {
    dbQuests,
    isLoading,
    isAuthorized,
    activeQuestCount,
    closedQuestCount,
    allSubmissions,
    reviewingCount,
    totalRewardBudget,
  } = useManagerDashboardData()

  return (
    <ManagerWorkspaceShell
      eyebrow="Manager Dashboard"
      title="매니저 대시보드"
      description="등록한 퀘스트 현황과 제출 검토 진행 상황, 보상 예산까지 한눈에 확인해보세요."
      isAuthorized={isAuthorized}
    >
      <section
        className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4"
        aria-label="매니저 대시보드 요약"
      >
        <StatCard
          label="진행 중인 퀘스트"
          value={String(activeQuestCount)}
          subtext="현재 지원 및 제출을 받고 있는 퀘스트"
        />
        <StatCard
          label="종료된 퀘스트"
          value={String(closedQuestCount)}
          subtext="마감되었거나 정리된 퀘스트"
        />
        <StatCard
          label="총 제출 수"
          value={String(allSubmissions.length)}
          subtext={`현재 ${reviewingCount}건 검토 중`}
        />
        <StatCard
          label="총 보상 금액"
          value={`${totalRewardBudget.toLocaleString()} KRW`}
          subtext={
            isLoading
              ? '최신 데이터를 불러오는 중입니다.'
              : '등록한 퀘스트의 보상 금액 합계'
          }
          accent
        />
      </section>

      <section className="grid gap-6 xl:grid-cols-3">
        <div className="xl:col-span-2">
          <PostedQuestsSection quests={dbQuests.slice(0, 5)} />
        </div>

        <div className="space-y-6">
          <Card className="border border-border shadow-none">
            <div className="p-6">
              <div className="mb-4">
                <h2 className="text-lg font-semibold text-foreground">
                  퀘스트 일정
                </h2>
                <p className="mt-1 text-sm text-foreground-muted">
                  등록 일정과 마감 시점을 빠르게 확인해보세요.
                </p>
              </div>
              <Calendar quests={dbQuests} className="w-full" />
            </div>
          </Card>

          <RewardSection />
        </div>
      </section>
    </ManagerWorkspaceShell>
  )
}
