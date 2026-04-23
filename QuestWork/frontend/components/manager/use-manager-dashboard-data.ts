'use client'

import { useEffect, useMemo, useState } from 'react'
import { getStoredSubmissions } from '@/lib/quest-submissions'

interface StoredSubmission {
  id: string
  freelancerName: string
  questTitle: string
  questId: string
  submittedAt: string
  status: 'reviewing' | 'winner' | 'rejected'
  githubUrl: string
}

export function useManagerDashboardData() {
  const [dbQuests, setDbQuests] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [isAuthorized, setIsAuthorized] = useState<boolean | null>(null)
  const [userId, setUserId] = useState<number | null>(null)
  const [savedSubmissions, setSavedSubmissions] = useState<StoredSubmission[]>(
    [],
  )

  useEffect(() => {
    const savedId =
      localStorage.getItem('userId') || localStorage.getItem('id')
    const role = localStorage.getItem('role')

    setIsAuthorized(role === 'MANAGER')

    if (savedId) {
      setUserId(Number(savedId))
    }
  }, [])

  useEffect(() => {
    const fetchQuests = async () => {
      if (!userId) return

      setIsLoading(true)
      try {
        const response = await fetch(
          `http://localhost:8000/api/quests/manager/${userId}`,
        )

        if (!response.ok) {
          throw new Error('Failed to load manager quests')
        }

        const data = await response.json()
        setDbQuests(data)
      } catch (error) {
        console.error('Fetch Error:', error)
      } finally {
        setIsLoading(false)
      }
    }

    if (isAuthorized === true) {
      fetchQuests()
    }
  }, [isAuthorized, userId])

  useEffect(() => {
    const stored = getStoredSubmissions().map((submission) => ({
      id: submission.id,
      freelancerName: submission.freelancerName,
      questTitle: submission.questTitle,
      questId: submission.questId,
      submittedAt: submission.submittedAt,
      status: 'reviewing' as const,
      githubUrl:
        submission.githubUrl ??
        `File submission: ${submission.fileName ?? 'attachment'}`,
    }))

    setSavedSubmissions(stored)
  }, [])

  const mockSubmissions = useMemo(
    () => [
      {
        id: 'mock-1',
        freelancerName: 'Kim Developer',
        questTitle: 'React Admin Dashboard Performance Optimization',
        questId: '1',
        submittedAt: '2024-04-10',
        status: 'reviewing' as const,
        githubUrl: 'https://github.com/example/react-dashboard',
      },
    ],
    [],
  )

  const allSubmissions = useMemo(
    () => [...savedSubmissions, ...mockSubmissions],
    [mockSubmissions, savedSubmissions],
  )

  const activeQuestCount = dbQuests.filter(
    (quest) => quest.status === 'OPEN',
  ).length
  const closedQuestCount = dbQuests.filter(
    (quest) => quest.status !== 'OPEN',
  ).length
  const totalRewardBudget = dbQuests.reduce(
    (acc, quest) => acc + (quest.rewardAmount || 0),
    0,
  )
  const reviewingCount = allSubmissions.filter(
    (submission) => submission.status === 'reviewing',
  ).length

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
