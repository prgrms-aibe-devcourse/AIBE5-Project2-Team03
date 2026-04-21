'use client'

import Link from 'next/link'
import { GlobalNav } from '@/components/global-nav'
import { DashboardSidebar } from '@/components/dashboard/dashboard-sidebar'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'

const SUBMISSIONS = [
  {
    id: '1',
    questId: '1',
    questTitle: 'React Admin Dashboard Performance Optimization',
    submittedAt: '2024-04-10',
    status: '선정',
    rewardStatus: '지급 완료',
    reward: '₩500,000',
  },
  {
    id: '2',
    questId: '2',
    questTitle: 'Mobile App for Task Management',
    submittedAt: '2024-04-08',
    status: '검토 중',
    rewardStatus: '지급 대기',
    reward: '₩300,000',
  },
  {
    id: '3',
    questId: '3',
    questTitle: 'REST API for Microservices Architecture',
    submittedAt: '2024-04-09',
    status: '제출 완료',
    rewardStatus: '-',
    reward: '₩750,000',
  },
]

const STATUS_CLASS: Record<string, string> = {
  선정: 'bg-green-100 text-green-700',
  '검토 중': 'bg-blue-100 text-blue-700',
  '제출 완료': 'bg-primary-light text-primary',
}

export default function MySubmissionsPage() {
  return (
    <div className="min-h-screen bg-background">
      <GlobalNav />

      <div className="flex">
        <DashboardSidebar />

        <main className="flex-1 p-6 lg:p-8">
          <div className="mb-8">
            <p className="text-sm font-semibold text-primary">My Submissions</p>
            <h1 className="mt-1 text-3xl font-bold text-foreground">
              내가 제출한 결과물
            </h1>
            <p className="mt-2 text-foreground-muted">
              제출한 결과물의 검토 상태와 보상 지급 상태를 확인하세요.
            </p>
          </div>

          <Card className="border border-border">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border bg-surface">
                    <th className="px-4 py-4 text-left font-semibold text-foreground">
                      퀘스트
                    </th>
                    <th className="px-4 py-4 text-left font-semibold text-foreground">
                      제출일
                    </th>
                    <th className="px-4 py-4 text-left font-semibold text-foreground">
                      상태
                    </th>
                    <th className="px-4 py-4 text-left font-semibold text-foreground">
                      보상
                    </th>
                    <th className="px-4 py-4 text-right font-semibold text-foreground">
                      상세
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {SUBMISSIONS.map((submission) => (
                    <tr
                      key={submission.id}
                      className="border-b border-border transition-colors last:border-b-0 hover:bg-surface"
                    >
                      <td className="px-4 py-4">
                        <p className="font-medium text-foreground">
                          {submission.questTitle}
                        </p>
                        <p className="mt-1 text-xs text-foreground-muted">
                          {submission.reward}
                        </p>
                      </td>
                      <td className="px-4 py-4 text-foreground-muted">
                        {submission.submittedAt}
                      </td>
                      <td className="px-4 py-4">
                        <Badge className={STATUS_CLASS[submission.status]}>
                          {submission.status}
                        </Badge>
                      </td>
                      <td className="px-4 py-4 text-foreground-muted">
                        {submission.rewardStatus}
                      </td>
                      <td className="px-4 py-4 text-right">
                        <Button variant="outline" size="sm" asChild>
                          <Link href={`/quests/${submission.questId}`}>
                            보기
                          </Link>
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        </main>
      </div>
    </div>
  )
}
