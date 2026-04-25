'use client'

import Link from 'next/link'
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

interface Quest {
  id: number
  title: string
  status: string
  rewardAmount: number
  deadline: string
  createdAt: string
  submissionsCount?: number
}

interface SubmissionsReviewSectionProps {
  quests: Quest[]
}

const statusBadgeColor: Record<string, string> = {
  OPEN: 'bg-green-100 text-green-700',
  IN_PROCESS: 'bg-primary-light text-primary',
  PICKED: 'bg-primary-light text-primary',
  FINISHED: 'bg-slate-100 text-slate-700',
  CLOSED: 'bg-slate-100 text-slate-700',
  CANCELED: 'bg-red-100 text-red-700',
}

const statusLabel: Record<string, string> = {
  OPEN: '모집 중',
  CLOSED: '모집 완료',
  IN_PROCESS: '진행 중',
  FINISHED: '종료',
  PICKED: '선정 완료',
  CANCELED: '취소됨',
}

export function SubmissionsReviewSection({ quests }: SubmissionsReviewSectionProps) {
  return (
    <Card className="border border-border shadow-none">
      <div className="p-6">
        <div className="mb-4">
          <h2 className="text-lg font-semibold text-foreground">제출 검토</h2>
          <p className="mt-1 text-sm text-foreground-muted">
            퀘스트별 제출물을 확인하고 우승자를 선정하세요.
          </p>
        </div>
      </div>

      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>퀘스트 제목</TableHead>
              <TableHead>상태</TableHead>
              <TableHead>보상 금액</TableHead>
              <TableHead>마감일</TableHead>
              <TableHead className="text-center">제출 수</TableHead>
              <TableHead className="text-right">작업</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {quests.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="py-8 text-center">
                  <p className="text-foreground-muted">
                    등록한 퀘스트가 없습니다.
                  </p>
                </TableCell>
              </TableRow>
            ) : (
              quests.map((quest) => (
                <TableRow key={quest.id} className="hover:bg-surface-raised">
                  <TableCell className="font-medium text-foreground">
                    {quest.title}
                  </TableCell>
                  <TableCell>
                    <Badge
                      className={
                        statusBadgeColor[quest.status] ??
                        'bg-slate-100 text-slate-700'
                      }
                    >
                      {statusLabel[quest.status] ?? quest.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-foreground-muted">
                    ₩{quest.rewardAmount?.toLocaleString()}
                  </TableCell>
                  <TableCell className="text-foreground-muted">
                    {new Date(quest.deadline).toLocaleDateString('ko-KR')}
                  </TableCell>
                  <TableCell className="text-center">
                    <span
                      className={`font-semibold ${
                        (quest.submissionsCount ?? 0) > 0
                          ? 'text-primary'
                          : 'text-foreground-muted'
                      }`}
                    >
                      {quest.submissionsCount ?? 0}건
                    </span>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button variant="outline" size="sm" asChild>
                      <Link href={`/manager/quests/${quest.id}`}>
                        제출품 보기
                      </Link>
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </Card>
  )
}

