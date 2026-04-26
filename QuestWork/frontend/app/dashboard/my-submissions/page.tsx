'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { GlobalNav } from '@/components/global-nav'
import { DashboardShell } from '@/components/dashboard/dashboard-shell'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  formatSubmissionStatus,
  getStoredSubmissions,
  type StoredSubmission,
} from '@/lib/quest-submissions'

const STATUS_CLASS: Record<string, string> = {
  '선정 완료': 'bg-green-100 text-green-700',
  '검토 중': 'bg-blue-100 text-blue-700',
  '제출 완료': 'bg-primary-light text-primary',
}

export default function MySubmissionsPage() {
  const [submissions, setSubmissions] = useState<StoredSubmission[]>([])

  useEffect(() => {
    const userId = localStorage.getItem('userId')
    setSubmissions(getStoredSubmissions(userId))
  }, [])

  return (
    <div className="min-h-screen bg-background">
      <GlobalNav />

      <DashboardShell>
        <div className="mb-8">
          <p className="text-sm font-semibold text-primary">내 제출물</p>
          <h1 className="mt-1 text-3xl font-bold text-foreground">
            제출한 결과물을 확인해보세요
          </h1>
          <p className="mt-2 text-foreground-muted">
            제출 결과의 검토 상태와 보상 지급 현황을 한곳에서 확인할 수 있습니다.
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
                {submissions.length > 0 ? (
                  submissions.map((submission) => {
                    const status = formatSubmissionStatus(submission.status)

                    return (
                      <tr
                        key={submission.id}
                        className="border-b border-border transition-colors last:border-b-0 hover:bg-surface"
                      >
                        <td className="px-4 py-4">
                          <p className="font-medium text-foreground">
                            {submission.questTitle}
                          </p>
                          <p className="mt-1 text-xs text-foreground-muted">
                            예상 보상 {submission.reward}
                          </p>
                        </td>
                        <td className="px-4 py-4 text-foreground-muted">
                          {new Date(submission.submittedAt).toLocaleDateString('ko-KR')}
                        </td>
                        <td className="px-4 py-4">
                          <Badge className={STATUS_CLASS[status] ?? STATUS_CLASS['제출 완료']}>
                            {status}
                          </Badge>
                        </td>
                        <td className="px-4 py-4 text-foreground-muted">
                          -
                        </td>
                        <td className="px-4 py-4 text-right">
                          <Button variant="outline" size="sm" asChild>
                            <Link href={`/quests/${submission.questId}`}>
                              보기
                            </Link>
                          </Button>
                        </td>
                      </tr>
                    )
                  })
                ) : (
                  <tr>
                    <td colSpan={5} className="px-4 py-10 text-center">
                      <p className="text-sm text-foreground-muted">
                        아직 제출한 퀘스트가 없습니다.
                      </p>
                    </td>
                  </tr>
                )}
              </tbody>
              </table>
            </div>
          </Card>
      </DashboardShell>
    </div>
  )
}
