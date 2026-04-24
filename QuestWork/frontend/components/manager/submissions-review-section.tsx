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
  submissions,
}: SubmissionsReviewSectionProps) {
  const [selectedSubmission, setSelectedSubmission] =
    useState<Submission | null>(null)

  return (
    <>
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
          onSelect={(id) => {
            console.log('[manager-dashboard] Winner selected:', id)
            setSelectedSubmission(null)
          }}
        />
      )}
    </>
  )
}
