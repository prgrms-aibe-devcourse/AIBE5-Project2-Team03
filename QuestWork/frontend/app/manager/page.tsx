'use client'

import { useMemo, useState } from 'react'
import { StatCard } from '@/components/dashboard/stat-card'
import { ManagerWorkspaceShell } from '@/components/manager/manager-workspace-shell'
import { PostedQuestsSection } from '@/components/manager/posted-quests-section'
import { RewardSection, type QuestRewardItem } from '@/components/manager/reward-section'
import { useManagerDashboardData } from '@/components/manager/use-manager-dashboard-data'
import { Calendar } from '@/components/ui/calendar'
import { Card } from '@/components/ui/card'

type ManagerDeadlineQuest = {
  id: string
  title: string
  deadlineDate: Date
}

function getQuestDeadline(quest: any) {
  const rawDeadline = quest.deadline ?? quest.endDate ?? quest.dueDate
  if (!rawDeadline) return null

  const date = new Date(rawDeadline)
  if (Number.isNaN(date.getTime())) return null

  date.setHours(0, 0, 0, 0)
  return date
}

function getDaysUntil(date: Date) {
  const today = new Date()
  today.setHours(0, 0, 0, 0)

  return Math.ceil((date.getTime() - today.getTime()) / (1000 * 60 * 60 * 24))
}

function getDeadlineLabel(daysUntil: number) {
  if (daysUntil === 0) return 'D-Day'
  if (daysUntil > 0) return `D-${daysUntil}`
  return `D+${Math.abs(daysUntil)}`
}

function isQuestRewardPaid(quest: any, rewardConfirmed: boolean) {
  if (rewardConfirmed) return true

  return ['FINISHED', 'COMPLETED', 'PAID', 'RELEASED'].includes(
    String(quest.status ?? '').toUpperCase(),
  )
}

export default function ManagerDashboardPage() {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined)
  const {
    dbQuests,
    isLoading,
    isAuthorized,
    userId,
    activeQuestCount,
    closedQuestCount,
    allSubmissions,
    reviewingCount,
    totalRewardBudget,
  } = useManagerDashboardData()

  // 대시보드용: 우승자 있는 퀘스트만 최대 3개 표시
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
        submissionTitle: winner.freelancerName,
        githubUrl: winner.githubUrl,
        rewardConfirmed: isQuestRewardPaid(quest, winner.rewardConfirmed),
      } satisfies QuestRewardItem
    })
    .filter((item): item is QuestRewardItem => item !== null)
    .slice(0, 3)

  const deadlineQuests = useMemo<ManagerDeadlineQuest[]>(
    () =>
      dbQuests
        .map((quest) => {
          const deadlineDate = getQuestDeadline(quest)
          if (!deadlineDate) return null

          return {
            id: String(quest.id ?? quest.questId),
            title: quest.title ?? 'Untitled Quest',
            deadlineDate,
          }
        })
        .filter((quest): quest is ManagerDeadlineQuest => quest !== null),
    [dbQuests],
  )

  const nextDeadlineQuest = useMemo(() => {
    const today = new Date()
    today.setHours(0, 0, 0, 0)

    return [...deadlineQuests]
      .filter((quest) => quest.deadlineDate >= today)
      .sort(
        (a, b) => a.deadlineDate.getTime() - b.deadlineDate.getTime(),
      )[0]
  }, [deadlineQuests])

  const nextDeadlineDays =
    nextDeadlineQuest ? getDaysUntil(nextDeadlineQuest.deadlineDate) : null

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
              <div className="mb-4 rounded-2xl border border-purple-100 bg-purple-50/70 px-4 py-3">
                <p className="text-sm font-semibold text-purple-900">
                  {nextDeadlineQuest && nextDeadlineDays !== null
                    ? `다음 마감일: ${nextDeadlineQuest.title} (${getDeadlineLabel(
                        nextDeadlineDays,
                      )})`
                    : '예정된 마감 일정이 없습니다.'}
                </p>
              </div>
              <Calendar
                mode="single"
                selected={selectedDate}
                onSelect={setSelectedDate}
                modifiers={{
                  deadline: deadlineQuests.map((quest) => quest.deadlineDate),
                }}
                modifiersClassNames={{
                  deadline:
                    'rounded-full bg-purple-50/70 text-purple-800 font-semibold shadow-[inset_0_0_0_1px_rgba(168,85,247,0.12)]',
                }}
                className="w-full rounded-md border-0 text-sm"
              />
            </div>
          </Card>

          <RewardSection items={rewardItems} userId={userId} />
        </div>
      </section>
    </ManagerWorkspaceShell>
  )
}
