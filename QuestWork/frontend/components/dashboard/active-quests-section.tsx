'use client'

import Link from 'next/link'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'

interface ActiveQuest {
  id: string
  title: string
  reward: string
  deadline: string
  progress: number
}

interface ActiveQuestsSectionProps {
  quests: ActiveQuest[]
}

export function ActiveQuestsSection({ quests }: ActiveQuestsSectionProps) {
  if (quests.length === 0) {
    return (
      <Card className="border border-border">
        <div className="p-6">
          <h2 className="text-lg font-semibold text-foreground mb-4">
            나의 참여 중인 퀘스트
          </h2>
          <p className="text-sm text-foreground-muted">
            아직 참여 중인 퀘스트가 없습니다.
          </p>
        </div>
      </Card>
    )
  }

  return (
    <Card className="border border-border">
      <div className="p-6">
        <h2 className="text-lg font-semibold text-foreground mb-4">
          나의 참여 중인 퀘스트
        </h2>
        <div className="space-y-3">
          {quests.map((quest) => (
            <Link key={quest.id} href={`/quests/${quest.id}`}>
              <div className="group flex items-center justify-between rounded-lg border border-border p-4 transition-colors hover:bg-surface">
                <div className="flex-1 min-w-0">
                  <h3 className="font-medium text-foreground group-hover:text-primary truncate">
                    {quest.title}
                  </h3>
                  <div className="mt-2 flex items-center gap-3 text-xs text-foreground-muted">
                    <span>마감: {quest.deadline}</span>
                    <span>보상: {quest.reward}</span>
                  </div>
                </div>
                <div className="ml-4 shrink-0">
                  <div className="w-12 h-6 bg-surface-raised rounded-full overflow-hidden">
                    <div
                      className="h-full bg-primary transition-all"
                      style={{ width: `${quest.progress}%` }}
                    />
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </Card>
  )
}
