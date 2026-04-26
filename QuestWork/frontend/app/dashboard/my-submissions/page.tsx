'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { GlobalNav } from '@/components/global-nav'
import { DashboardShell } from '@/components/dashboard/dashboard-shell'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
<<<<<<< HEAD
import {
  formatSubmissionStatus,
  getStoredSubmissions,
  type StoredSubmission,
} from '@/lib/quest-submissions'
=======

interface Submission {
  submissionId: number
  questId: number
  questTitle: string
  submissionTitle: string
  status: string
  submittedAt: string
  repoUrl: string | null
}

const STATUS_LABEL: Record<string, string> = {
  SUBMITTED: '제출 완료',
  UPDATED: '수정 완료',
  WINNER: '우승자 선정',
}
>>>>>>> origin/kyungsu

const STATUS_CLASS: Record<string, string> = {
  SUBMITTED: 'bg-blue-100 text-blue-700',
  UPDATED: 'bg-primary-light text-primary',
  WINNER: 'bg-green-100 text-green-700',
}

export default function MySubmissionsPage() {
<<<<<<< HEAD
  const [submissions, setSubmissions] = useState<StoredSubmission[]>([])

  useEffect(() => {
    const userId = localStorage.getItem('userId')
    setSubmissions(getStoredSubmissions(userId))
  }, [])
=======
  const router = useRouter()
  const [submissions, setSubmissions] = useState<Submission[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const userId = localStorage.getItem('userId')
    if (!userId) { router.push('/login'); return }

    const fetchSubmissions = async () => {
      try {
        const res = await fetch(`http://localhost:8000/api/quests/my-submissions?userId=${userId}`)
        if (!res.ok) throw new Error('제출물 조회 실패')
        const data: Submission[] = await res.json()
        setSubmissions(data)
      } catch (e) {
        console.error(e)
      } finally {
        setLoading(false)
      }
    }
    fetchSubmissions()
  }, [router])
>>>>>>> origin/kyungsu

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

<<<<<<< HEAD
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
=======
        {loading ? (
          <p className="text-sm text-foreground-muted">불러오는 중...</p>
        ) : submissions.length === 0 ? (
          <div className="rounded-lg border border-dashed border-border p-12 text-center">
            <p className="text-sm text-foreground-muted">아직 제출한 결과물이 없습니다.</p>
            <Button asChild className="mt-4 bg-primary text-primary-foreground hover:bg-primary-hover">
              <Link href="/quests">퀘스트 둘러보기</Link>
            </Button>
          </div>
        ) : (
          <Card className="border border-border">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border bg-surface">
                    <th className="px-4 py-4 text-left font-semibold text-foreground">퀘스트</th>
                    <th className="px-4 py-4 text-left font-semibold text-foreground">제출 제목</th>
                    <th className="px-4 py-4 text-left font-semibold text-foreground">제출일</th>
                    <th className="px-4 py-4 text-left font-semibold text-foreground">상태</th>
                    <th className="px-4 py-4 text-right font-semibold text-foreground">링크 / 상세</th>
                  </tr>
                </thead>
                <tbody>
                  {submissions.map((s) => (
                    <tr
                      key={s.submissionId}
                      className="border-b border-border transition-colors last:border-b-0 hover:bg-surface"
                    >
                      <td className="px-4 py-4">
                        <p className="font-medium text-foreground">{s.questTitle}</p>
                        <p className="mt-0.5 text-xs text-foreground-muted">Quest #{s.questId}</p>
                      </td>
                      <td className="px-4 py-4 text-foreground-muted max-w-[200px] truncate">
                        {s.submissionTitle}
                      </td>
                      <td className="px-4 py-4 text-foreground-muted whitespace-nowrap">
                        {s.submittedAt ? s.submittedAt.split('T')[0] : '-'}
                      </td>
                      <td className="px-4 py-4">
                        <Badge className={STATUS_CLASS[s.status] ?? 'bg-slate-100 text-slate-700'}>
                          {STATUS_LABEL[s.status] ?? s.status}
                        </Badge>
                      </td>
                      <td className="px-4 py-4 text-right space-x-2">
                        {s.repoUrl && (
                          <a
                            href={s.repoUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-xs text-primary underline mr-2"
                          >
                            GitHub
                          </a>
                        )}
                        <Button variant="outline" size="sm" asChild>
                          <Link href={`/quests/${s.questId}`}>보기</Link>
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
>>>>>>> origin/kyungsu
              </table>
            </div>
          </Card>
        )}
      </DashboardShell>
    </div>
  )
}
