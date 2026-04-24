'use client'

import Link from 'next/link'
import { Badge } from '@/components/ui/badge'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'

export interface Quest {
  id: string
  title: string
  description: string
  techStack: string[]
  reward: string
  deadline: string
  participants: number
  category?: string
}

interface QuestCardProps {
  quest: Quest
}

export function QuestCard({ quest }: QuestCardProps) {
  return (
    <Link href={`/quests/${quest.id}`} className="block">
      <Card className="group flex h-full flex-col overflow-hidden rounded-lg border border-border shadow transition-all duration-200 hover:-translate-y-1 hover:shadow-lg">
        <div className="border-b border-border px-4 py-3.5">
          {quest.category ? (
            <p className="mb-1 text-xs font-semibold uppercase tracking-[0.16em] text-primary">
              {quest.category}
            </p>
          ) : null}
          <h3 className="line-clamp-2 text-lg font-semibold text-foreground transition-colors group-hover:text-primary">
            {quest.title}
          </h3>
        </div>

        <div className="flex flex-1 flex-col gap-3 px-4 py-3.5">
          <p className="line-clamp-2 text-sm text-foreground-muted">
            {quest.description}
          </p>

          <div className="flex flex-wrap gap-2">
            {quest.techStack.map((tech) => (
              <Badge
                key={tech}
                className="bg-secondary text-secondary-foreground"
              >
                {tech}
              </Badge>
            ))}
          </div>
        </div>

        <div className="space-y-3 border-t border-border px-4 py-3.5">
          <div className="flex items-center justify-between text-sm">
            <div className="flex flex-col gap-1">
              <span className="text-xs text-foreground-muted">보상</span>
              <span className="font-semibold text-primary">{quest.reward}</span>
            </div>
            <div className="flex flex-col gap-1">
              <span className="text-xs text-foreground-muted">마감</span>
              <span className="font-semibold text-foreground">{quest.deadline}</span>
            </div>
            <div className="flex flex-col gap-1">
              <span className="text-xs text-foreground-muted">참여</span>
              <span className="font-semibold text-foreground">{quest.participants}</span>
            </div>
          </div>

          <Button className="h-9 w-full bg-primary text-primary-foreground transition-colors hover:bg-primary-hover">
            퀘스트 보기
          </Button>
        </div>
      </Card>
    </Link>
  )
}
