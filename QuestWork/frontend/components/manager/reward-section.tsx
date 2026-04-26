'use client'

import { useState } from 'react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'

export interface QuestRewardItem {
  questId: number
  questTitle: string
  rewardAmount: number
  winnerNickname: string
  winnerMemberId: number
  submissionId: number
  submissionTitle: string
  githubUrl: string
  rewardConfirmed?: boolean
}

interface RewardSectionProps {
  items: QuestRewardItem[]
  userId?: number | null
}

function QuestRewardRow({
  item,
  userId,
}: {
  item: QuestRewardItem
  userId?: number | null
}) {
  const [approving, setApproving] = useState(false)
  const [approved, setApproved] = useState(item.rewardConfirmed ?? false)
  const [error, setError] = useState<string | null>(null)

  const handleApprove = async () => {
    const uid = userId ?? Number(localStorage.getItem('userId'))
    setApproving(true)
    setError(null)
    try {
      const res = await fetch('http://localhost:8000/api/settlement/approve', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          freelancerId: item.winnerMemberId,
          questId: item.questId,
          originalAmount: item.rewardAmount,
        }),
      })
      if (!res.ok) {
        const text = await res.text()
        throw new Error(text || '정산 처리에 실패했습니다.')
      }
      setApproved(true)
    } catch (e) {
      setError(e instanceof Error ? e.message : '오류가 발생했습니다.')
    } finally {
      setApproving(false)
    }
  }

  return (
    <div className="rounded-lg border border-border bg-surface p-5 space-y-4">
      {/* 상단: 퀘스트 제목 + 지급 상태 */}
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0 flex-1">
          <p className="text-xs font-semibold uppercase text-foreground-muted">
            Quest #{item.questId}
          </p>
          <h3 className="mt-1 text-base font-semibold text-foreground truncate">
            {item.questTitle}
          </h3>
        </div>
        <Badge className={approved ? 'bg-primary-light text-primary' : 'bg-yellow-100 text-yellow-700'}>
          {approved ? '지급 완료' : '지급 대기'}
        </Badge>
      </div>

      {/* 중단: 우승자 + 제출품 정보 */}
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
        <div className="rounded-md bg-background border border-border px-4 py-3">
          <p className="text-xs text-foreground-muted">선정된 개발자</p>
          <p className="mt-1 text-sm font-semibold text-foreground">
            {item.winnerNickname}
          </p>
        </div>
        <div className="rounded-md bg-background border border-border px-4 py-3">
          <p className="text-xs text-foreground-muted">제출 제목</p>
          <p className="mt-1 text-sm font-semibold text-foreground truncate">
            {item.submissionTitle}
          </p>
        </div>
        <div className="rounded-md bg-background border border-border px-4 py-3">
          <p className="text-xs text-foreground-muted">제출 링크</p>
          {item.githubUrl ? (
            <a
              href={item.githubUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-1 block text-sm font-semibold text-primary underline truncate"
            >
              {item.githubUrl}
            </a>
          ) : (
            <p className="mt-1 text-sm text-foreground-muted">-</p>
          )}
        </div>
      </div>

      {/* 하단: 보상 금액 + 승인 버튼 */}
      <div className="flex items-center justify-between gap-4 pt-1">
        <div>
          <p className="text-xs text-foreground-muted">보상 금액</p>
          <p className="mt-1 text-2xl font-bold text-primary">
            ₩{item.rewardAmount.toLocaleString()}
          </p>
          <p className="text-xs text-foreground-muted">
            수수료 10% 제외 후 ₩{(item.rewardAmount * 0.9).toLocaleString()} 지급
          </p>
        </div>

        <div className="flex flex-col items-end gap-2">
          {error && (
            <p className="text-xs text-red-600">{error}</p>
          )}
          {approved ? (
            <Badge className="bg-green-100 text-green-700 px-4 py-2 text-sm">
              ✓ 지급 완료
            </Badge>
          ) : (
            <Button
              className="bg-primary text-primary-foreground hover:bg-primary-hover"
              disabled={approving}
              onClick={handleApprove}
            >
              {approving ? '처리 중...' : '최종 승인 및 지급'}
            </Button>
          )}
        </div>
      </div>
    </div>
  )
}

export function RewardSection({ items, userId }: RewardSectionProps) {
  return (
    <Card className="border border-border shadow-none">
      <div className="p-6">
        <div className="mb-6">
          <h2 className="text-lg font-semibold text-foreground">보상 관리</h2>
          <p className="mt-1 text-sm text-foreground-muted">
            우승자가 선정된 퀘스트 목록입니다. 최종 승인 시 수수료 10%를 제외한 금액이 개발자 지갑으로 지급됩니다.
          </p>
        </div>

        {items.length === 0 ? (
          <div className="rounded-lg border border-dashed border-border p-12 text-center">
            <p className="text-sm text-foreground-muted">
              아직 우승자가 선정된 퀘스트가 없습니다.
            </p>
            <p className="mt-1 text-xs text-foreground-muted">
              제출 검토 페이지에서 우승자를 먼저 선정해주세요.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {items.map((item) => (
              <QuestRewardRow key={item.questId} item={item} userId={userId} />
            ))}
          </div>
        )}
      </div>
    </Card>
  )
}
