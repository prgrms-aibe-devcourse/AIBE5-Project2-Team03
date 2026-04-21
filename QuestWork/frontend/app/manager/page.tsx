'use client'

import { GlobalNav } from '@/components/global-nav'
import { ManagerSidebar } from '@/components/manager/manager-sidebar'
import { PostedQuestsSection } from '@/components/manager/posted-quests-section'
import { SubmissionsReviewSection } from '@/components/manager/submissions-review-section'
import { RewardSection } from '@/components/manager/reward-section'
import { Card } from '@/components/ui/card'

export default function ManagerDashboardPage() {
  // Mock posted quests data
  const postedQuests = [
    {
      id: '1',
      title: 'React Admin Dashboard Performance Optimization',
      status: 'open' as const,
      reward: '₩1,000,000',
      submissionsCount: 8,
      createdAt: '2024-04-01',
    },
    {
      id: '3',
      title: 'REST API for Microservices Architecture',
      status: 'open' as const,
      reward: '₩1,500,000',
      submissionsCount: 5,
      createdAt: '2024-03-28',
    },
    {
      id: '4',
      title: 'Kubernetes Deployment & CI/CD Pipeline',
      status: 'completed' as const,
      reward: '₩2,000,000',
      submissionsCount: 12,
      createdAt: '2024-03-15',
    },
  ]

  // Mock submissions data
  const submissions = [
    {
      id: '1',
      freelancerName: '김개발',
      questTitle: 'React Admin Dashboard Performance Optimization',
      questId: '1',
      submittedAt: '2024-04-10',
      status: 'reviewing' as const,
      githubUrl: 'https://github.com/example/react-dashboard',
    },
    {
      id: '2',
      freelancerName: '박백엔드',
      questTitle: 'REST API for Microservices Architecture',
      questId: '3',
      submittedAt: '2024-04-09',
      status: 'reviewing' as const,
      githubUrl: 'https://github.com/example/microservices-api',
    },
    {
      id: '3',
      freelancerName: '이풀스택',
      questTitle: 'React Admin Dashboard Performance Optimization',
      questId: '1',
      submittedAt: '2024-04-08',
      status: 'rejected' as const,
      githubUrl: 'https://github.com/example/dashboard-v2',
    },
    {
      id: '4',
      freelancerName: '정데브옵스',
      questTitle: 'Kubernetes Deployment & CI/CD Pipeline',
      questId: '4',
      submittedAt: '2024-04-05',
      status: 'winner' as const,
      githubUrl: 'https://github.com/example/k8s-setup',
    },
  ]

  return (
    <div className="min-h-screen bg-background">
      <GlobalNav />

      <div className="flex">
        {/* Sidebar */}
        <ManagerSidebar />

        {/* Main Content */}
        <main className="flex-1">
          <div className="space-y-6 p-6 lg:p-8">
            {/* Header */}
            <div>
              <h1 className="text-3xl font-bold text-foreground">
                매니저 대시보드
              </h1>
              <p className="mt-1 text-foreground-muted">
                등록한 퀘스트와 제출 현황을 관리하세요.
              </p>
            </div>

            {/* Overview Stats */}
            <div className="grid gap-4 md:grid-cols-3">
              <Card className="border border-border p-5">
                <p className="text-sm text-foreground-muted">활성 퀘스트</p>
                <p className="mt-2 text-3xl font-bold text-foreground">
                  {postedQuests.filter((q) => q.status === 'open').length}
                </p>
              </Card>
              <Card className="border border-border p-5">
                <p className="text-sm text-foreground-muted">총 제출</p>
                <p className="mt-2 text-3xl font-bold text-foreground">
                  {submissions.length}
                </p>
              </Card>
              <Card className="border border-border p-5 bg-primary">
                <p className="text-sm text-primary-foreground/80">총 지급액</p>
                <p className="mt-2 text-3xl font-bold text-primary-foreground">
                  ₩4,500,000
                </p>
              </Card>
            </div>

            {/* Main Sections Grid */}
            <div className="grid gap-6 lg:grid-cols-2">
              {/* Left Column */}
              <div className="space-y-6">
                <PostedQuestsSection quests={postedQuests} />
              </div>

              {/* Right Column */}
              <div className="space-y-6">
                <RewardSection />
              </div>
            </div>

            {/* Submissions Review Section */}
            <SubmissionsReviewSection submissions={submissions} />
          </div>
        </main>
      </div>
    </div>
  )
}
