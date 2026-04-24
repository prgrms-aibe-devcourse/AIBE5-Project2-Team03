'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'

interface Quest {
  id: number
  title: string
  status: 'OPEN' | 'CLOSED' | 'COMPLETED'
  rewardAmount: number
  createdAt: string
  submissionsCount?: number
}

interface PostedQuestsSectionProps {
  quests: Quest[]
}

const statusBadgeColor = {
  OPEN: 'bg-green-100 text-green-700',
  CLOSED: 'bg-slate-100 text-slate-700',
  COMPLETED: 'bg-primary-light text-primary',
}

const statusLabel = {
  OPEN: '진행 중',
  CLOSED: '종료됨',
  COMPLETED: '완료됨',
}

export function PostedQuestsSection({ quests }: PostedQuestsSectionProps) {
  const router = useRouter()

  return (
    <Card className="border border-border shadow-none">
      <div className="p-6">
        <div className="mb-4 flex items-center justify-between gap-3">
          <div>
            <h2 className="text-lg font-semibold text-foreground">
              등록한 퀘스트
            </h2>
            <p className="mt-1 text-sm text-foreground-muted">
              현재 등록한 퀘스트 상태를 확인하고 상세 화면으로 이동해보세요.
            </p>
          </div>
          <Button
            className="bg-primary text-primary-foreground hover:bg-primary-hover"
            onClick={() => router.push('/manager/create-quest')}
          >
            퀘스트 생성
          </Button>
        </div>

        {quests.length === 0 ? (
          <div className="rounded-lg border border-dashed border-border p-8 text-center">
            <p className="text-sm text-foreground-muted">
              아직 등록한 퀘스트가 없습니다.
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {quests.map((quest) => (
              <Link
                key={quest.id}
                href={`/manager/quests/${quest.id}`}
                className="block rounded-lg border border-border p-4 transition-colors hover:bg-surface"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="min-w-0 flex-1">
                    <h3 className="truncate text-sm font-semibold text-foreground">
                      {quest.title}
                    </h3>
                    <p className="mt-2 text-xs text-foreground-muted">
                      등록일 {new Date(quest.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  <Badge className={statusBadgeColor[quest.status]}>
                    {statusLabel[quest.status]}
                  </Badge>
                </div>

                <div className="mt-4 flex items-center justify-between gap-4">
                  <div className="flex items-center gap-6">
                    <div>
                      <p className="text-xs text-foreground-muted">보상 금액</p>
                      <p className="text-sm font-semibold text-primary">
                        {quest.rewardAmount?.toLocaleString()} KRW
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-foreground-muted">제출 수</p>
                      <p className="text-sm font-semibold text-foreground">
                        {quest.submissionsCount || 0}
                      </p>
                    </div>
                  </div>
                  <Button variant="outline" size="sm" className="shrink-0">
                    상세 보기
                  </Button>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </Card>
  )
}
