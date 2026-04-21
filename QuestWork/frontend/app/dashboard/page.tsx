'use client'

import { useEffect, useMemo, useState } from 'react'
import { getStoredSubmissions } from '@/lib/quest-submissions'
import { GlobalNav } from '@/components/global-nav'
import { DashboardSidebar } from '@/components/dashboard/dashboard-sidebar'
import { ActiveQuestsSection } from '@/components/dashboard/active-quests-section'
import { SubmissionsSection } from '@/components/dashboard/submissions-section'
import { EarningsSection } from '@/components/dashboard/earnings-section'
import { PortfolioBlogSection } from '@/components/dashboard/portfolio-blog-section'

export default function DashboardPage() {
  const [savedSubmissions, setSavedSubmissions] = useState<
    {
      id: string
      questTitle: string
      questId: string
      status: 'submitted' | 'selected' | 'rejected'
      submittedAt: string
      reward: string
    }[]
  >([])

  useEffect(() => {
    const stored = getStoredSubmissions().map((submission) => ({
      id: submission.id,
      questTitle: submission.questTitle,
      questId: submission.questId,
      status: 'submitted' as const,
      submittedAt: submission.submittedAt,
      reward: submission.reward,
    }))

    setSavedSubmissions(stored)
  }, [])

  // Mock active quests data
  const activeQuests = [
    {
      id: '1',
      title: 'React Admin Dashboard Performance Optimization',
      reward: '₩1,000,000',
      deadline: '5일 남음',
      progress: 60,
    },
    {
      id: '3',
      title: 'REST API for Microservices Architecture',
      reward: '₩1,500,000',
      deadline: '3일 남음',
      progress: 45,
    },
  ]

  // Mock submissions data
  const submissions = [
    {
      id: '1',
      questTitle: 'React Admin Dashboard Performance Optimization',
      questId: '1',
      status: 'submitted' as const,
      submittedAt: '2024-04-10',
      reward: '₩1,000,000',
    },
    {
      id: '2',
      questTitle: 'Mobile App for Task Management',
      questId: '2',
      status: 'selected' as const,
      submittedAt: '2024-04-08',
      reward: '₩800,000',
    },
    {
      id: '3',
      questTitle: 'REST API for Microservices Architecture',
      questId: '3',
      status: 'submitted' as const,
      submittedAt: '2024-04-09',
      reward: '₩1,500,000',
    },
    {
      id: '4',
      questTitle: 'Spring Boot REST Service',
      questId: '4',
      status: 'selected' as const,
      submittedAt: '2024-04-05',
      reward: '₩1,200,000',
    },
    {
      id: '5',
      questTitle: 'Python Data Processing Pipeline',
      questId: '5',
      status: 'rejected' as const,
      submittedAt: '2024-04-03',
      reward: '₩900,000',
    },
  ]

  const allSubmissions = useMemo(
    () => [...savedSubmissions, ...submissions],
    [savedSubmissions, submissions]
  )

  // Mock blog posts data
  const blogPosts = [
    {
      id: '1',
      title: 'Next.js 14 새로운 기능 살펴보기',
      excerpt:
        'Next.js 14에서 도입된 새로운 기능들과 성능 개선사항을 자세히 알아봅시다. App Router의 발전된 기능들을 소개합니다.',
      date: '2024-04-10',
      readTime: '8분',
    },
    {
      id: '2',
      title: 'React 성능 최적화 팁 5가지',
      excerpt:
        '웹 애플리케이션의 성능을 향상시키기 위한 실용적인 React 최적화 기법들을 배워봅시다.',
      date: '2024-04-05',
      readTime: '10분',
    },
    {
      id: '3',
      title: 'TypeScript 고급 타입 가이드',
      excerpt:
        'Generic, Union, Intersection 등 TypeScript의 고급 타입 기능을 마스터해봅시다.',
      date: '2024-03-28',
      readTime: '12분',
    },
  ]

  return (
    <div className="min-h-screen bg-background">
      <GlobalNav />

      <div className="flex">
        {/* Sidebar */}
        <DashboardSidebar />

        {/* Main Content */}
        <main className="flex-1">
          <div className="space-y-6 p-6 lg:p-8">
            {/* Header */}
            <div>
              <h1 className="text-3xl font-bold text-foreground">
                나의 대시보드
              </h1>
              <p className="mt-1 text-foreground-muted">
                퀘스트 진행 상황과 수익을 한눈에 확인하세요.
              </p>
            </div>

            {/* Sections Grid */}
            <div className="grid gap-6 lg:grid-cols-2">
              {/* Left Column */}
              <div className="space-y-6">
                <ActiveQuestsSection quests={activeQuests} />
                <SubmissionsSection submissions={allSubmissions} />
              </div>

              {/* Right Column */}
              <div className="space-y-6">
                <EarningsSection />
                <PortfolioBlogSection posts={blogPosts} />
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}
