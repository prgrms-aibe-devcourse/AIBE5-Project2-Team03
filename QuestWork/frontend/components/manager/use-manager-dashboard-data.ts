'use client'

import { useEffect, useState } from 'react'

export interface ManagerSubmission {
  id: string
  submissionId: number
  freelancerName: string
  questTitle: string
  questId: string
  memberId: number
  rewardAmount: number
  submittedAt: string
  status: 'reviewing' | 'winner' | 'rejected'
  githubUrl: string
  rewardConfirmed: boolean
}

function mapSubmissionStatus(apiStatus: string): 'reviewing' | 'winner' | 'rejected' {
  if (apiStatus === 'WINNER') return 'winner'
  if (apiStatus === 'REJECTED') return 'rejected'
  return 'reviewing'
}

function isRewardConfirmed(sub: any) {
  if (Boolean(sub.rewardConfirmed ?? sub.isPaid ?? sub.paidAt)) return true

  return [sub.paymentStatus, sub.rewardStatus, sub.payoutStatus].some((status) =>
    ['PAID', 'COMPLETED', 'COMPLETE', 'RELEASED', 'CONFIRMED'].includes(
      String(status ?? '').toUpperCase(),
    ),
  )
}

export function useManagerDashboardData() {
  const [dbQuests, setDbQuests] = useState<any[]>([])
  const [allSubmissions, setAllSubmissions] = useState<ManagerSubmission[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [isAuthorized, setIsAuthorized] = useState<boolean | null>(null)
  const [userId, setUserId] = useState<number | null>(null)

  useEffect(() => {
    const savedId = localStorage.getItem('userId') || localStorage.getItem('id')
    const role = localStorage.getItem('role')
    setIsAuthorized(role === 'MANAGER')
    if (savedId) setUserId(Number(savedId))
  }, [])

  useEffect(() => {
    const fetchData = async () => {
      if (!userId) return
      setIsLoading(true)
      try {
        // 1. 매니저 퀘스트 목록 조회
        const questRes = await fetch(
          `http://localhost:8000/api/manager/quests?userId=${userId}`,
        )
        if (!questRes.ok) throw new Error('Failed to load manager quests')
        const rawQuests: any[] = await questRes.json()

        // questId → id 매핑 (PostedQuestsSection 호환)
        const mappedQuests = rawQuests.map((q) => ({
          id: q.questId,
          questId: q.questId,
          title: q.title,
          rewardAmount: Number(q.rewardAmount),
          status: q.status,
          deadline: q.deadline,
          createdAt: q.createdAt,
          description: '',
          submissionsCount: 0,
        }))

        // 2. 각 퀘스트의 제출물 목록 조회
        const submissionPromises = mappedQuests.map((quest) =>
          fetch(
            `http://localhost:8000/api/manager/quests/${quest.questId}/submissions?userId=${userId}`,
          )
            .then((r) => (r.ok ? r.json() : []))
            .then((subs: any[]) =>
              subs.map<ManagerSubmission>((sub) => ({
                id: String(sub.submissionId),
                submissionId: sub.submissionId,
                freelancerName: sub.nickname,
                questTitle: quest.title,
                questId: String(quest.questId),
                memberId: sub.memberId,
                rewardAmount: quest.rewardAmount,
                submittedAt: sub.submittedAt?.split('T')[0] ?? '',
                status: mapSubmissionStatus(sub.status),
                githubUrl: sub.repoUrl || sub.fileUrl || '',
                rewardConfirmed: isRewardConfirmed(sub),
              })),
            ),
        )

        const submissionResults = await Promise.all(submissionPromises)
        const allSubs = submissionResults.flat()

        // 제출 수 업데이트
        const questsWithCount = mappedQuests.map((q) => ({
          ...q,
          submissionsCount: allSubs.filter((s) => s.questId === String(q.questId)).length,
        }))

        setDbQuests(questsWithCount)
        setAllSubmissions(allSubs)
      } catch (error) {
        console.error('Fetch Error:', error)
      } finally {
        setIsLoading(false)
      }
    }

    if (isAuthorized === true) {
      fetchData()
    }
  }, [isAuthorized, userId])

  const activeQuestCount = dbQuests.filter((q) => q.status === 'OPEN').length
  const closedQuestCount = dbQuests.filter((q) => q.status !== 'OPEN').length
  const totalRewardBudget = dbQuests.reduce((acc, q) => acc + (q.rewardAmount || 0), 0)
  const reviewingCount = allSubmissions.filter((s) => s.status === 'reviewing').length

  return {
    dbQuests,
    isLoading,
    isAuthorized,
    userId,
    allSubmissions,
    activeQuestCount,
    closedQuestCount,
    totalRewardBudget,
    reviewingCount,
  }
}
