'use client'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'

export function RewardSection() {
  const selectedWinner = {
    name: 'Kim Developer',
    reward: '1,500,000 KRW',
    questTitle: 'REST API for Microservices Architecture',
  }

  return (
    <Card className="border border-border shadow-none">
      <div className="p-6">
        <div className="mb-4">
          <h2 className="text-lg font-semibold text-foreground">보상 관리</h2>
          <p className="mt-1 text-sm text-foreground-muted">
            우승자 선정 결과와 결제 상태를 확인하고 보상 지급을 진행해보세요.
          </p>
        </div>

        <div className="rounded-lg border border-border bg-surface p-5">
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1">
              <p className="text-sm text-foreground-muted">선정된 개발자</p>
              <h3 className="mt-2 text-lg font-semibold text-foreground">
                {selectedWinner.name}
              </h3>
              <p className="mt-1 text-sm text-foreground-muted">
                {selectedWinner.questTitle}
              </p>
            </div>
            <Badge className="bg-green-100 text-green-700">선정 완료</Badge>
          </div>
        </div>

        <div className="mt-6">
          <p className="text-sm font-semibold text-foreground-muted">
            보상 금액
          </p>
          <p className="mt-2 text-3xl font-bold text-primary">
            {selectedWinner.reward}
          </p>
        </div>

        <div className="mt-6 space-y-2">
          <div className="flex items-center gap-2">
            <div className="h-2 w-2 rounded-full bg-green-500" />
            <span className="text-sm text-foreground">결제 대기 중</span>
          </div>
          <p className="text-xs text-foreground-muted">
            결제를 승인하면 선정된 개발자에게 보상이 지급됩니다.
          </p>
        </div>

        <div className="mt-6 flex gap-3 pt-2">
          <Button variant="outline" className="flex-1">
            결제 취소
          </Button>
          <Button className="flex-1 bg-primary text-primary-foreground hover:bg-primary-hover">
            결제 승인 및 지급
          </Button>
        </div>
      </div>
    </Card>
  )
}
