'use client'

import { useState } from 'react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { SubmissionModal } from './submission-modal'

interface Submission {
  id: string
  freelancerName: string
  questTitle: string
  questId: string
  submittedAt: string
  status: 'reviewing' | 'winner' | 'rejected'
  githubUrl: string
}

interface SubmissionsReviewSectionProps {
  submissions: Submission[]
  userId?: number | null
}

const statusBadgeColor = {
  reviewing: 'bg-blue-100 text-blue-700',
  winner: 'bg-green-100 text-green-700',
  rejected: 'bg-slate-100 text-slate-700',
}

const statusLabel = {
  reviewing: '검토 중',
  winner: '선정됨',
  rejected: '반려됨',
}

export function SubmissionsReviewSection({
  submissions: initialSubmissions,
  userId,
}: SubmissionsReviewSectionProps) {
  const [submissions, setSubmissions] = useState<Submission[]>(initialSubmissions)
  const [selectedSubmission, setSelectedSubmission] = useState<Submission | null>(null)
  const [selectingId, setSelectingId] = useState<string | null>(null)
  const [selectError, setSelectError] = useState<string | null>(null)

  // initialSubmissions가 바뀌면 동기화
  useState(() => {
    setSubmissions(initialSubmissions)
  })

  const handleSelectWinner = async (submissionId: string) => {
    const submission = submissions.find((s) => s.id === submissionId)
    if (!submission) return

    const uid = userId ?? Number(localStorage.getItem('userId'))
    if (!uid) {
      setSelectError('로그인이 필요합니다.')
      return
    }

    setSelectingId(submissionId)
    setSelectError(null)
    try {
      const res = await fetch(
        `http://localhost:8000/api/manager/quests/${submission.questId}/winner?userId=${uid}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ submissionId: Number(submissionId) }),
        },
      )
      if (!res.ok) {
        const text = await res.text()
        throw new Error(text || '우승자 선정에 실패했습니다.')
      }

      // 로컬 상태 업데이트: 해당 제출물 → winner
      setSubmissions((prev) =>
        prev.map((s) =>
          s.questId === submission.questId
            ? { ...s, status: s.id === submissionId ? 'winner' : 'rejected' }
            : s,
        ),
      )
    } catch (e) {
      setSelectError(e instanceof Error ? e.message : '오류가 발생했습니다.')
    } finally {
      setSelectingId(null)
      setSelectedSubmission(null)
    }
  }

  return (
    <>
      {selectError && (
        <div className="mb-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {selectError}
        </div>
      )}
      <Card className="border border-border shadow-none">
        <div className="p-6">
          <div className="mb-4">
            <h2 className="text-lg font-semibold text-foreground">제출 검토</h2>
            <p className="mt-1 text-sm text-foreground-muted">
              제출된 결과물을 비교하고 빠르게 검토를 진행해보세요.
            </p>
          </div>
        </div>

        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>개발자</TableHead>
                <TableHead>퀘스트</TableHead>
                <TableHead>제출일</TableHead>
                <TableHead>상태</TableHead>
                <TableHead className="text-right">작업</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {submissions.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="py-8 text-center">
                    <p className="text-foreground-muted">
                      현재 검토 대기 중인 제출물이 없습니다.
                    </p>
                  </TableCell>
                </TableRow>
              ) : (
                submissions.map((submission) => (
                  <TableRow
                    key={submission.id}
                    className="hover:bg-surface-raised"
                  >
                    <TableCell className="font-medium text-foreground">
                      {submission.freelancerName}
                    </TableCell>
                    <TableCell className="text-foreground-muted">
                      {submission.questTitle}
                    </TableCell>
                    <TableCell className="text-foreground-muted">
                      {submission.submittedAt}
                    </TableCell>
                    <TableCell>
                      <Badge className={statusBadgeColor[submission.status]}>
                        {statusLabel[submission.status]}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button
                        variant="outline"
                        size="sm"
                        disabled={submission.status !== 'reviewing' || !!selectingId}
                        onClick={() => setSelectedSubmission(submission)}
                      >
                        검토하기
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </Card>

      {selectedSubmission && (
        <SubmissionModal
          submission={selectedSubmission}
          onClose={() => setSelectedSubmission(null)}
          onSelect={handleSelectWinner}
          isSelecting={selectingId === selectedSubmission.id}
        />
      )}
    </>
  )
}
