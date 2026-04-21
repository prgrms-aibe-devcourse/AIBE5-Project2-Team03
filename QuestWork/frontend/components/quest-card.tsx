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
}

interface QuestCardProps {
  quest: Quest
}

export function QuestCard({ quest }: QuestCardProps) {
  return (
    <Link href={`/quests/${quest.id}`}>
      <Card className="group flex h-full flex-col overflow-hidden rounded-lg border border-border shadow transition-all duration-200 hover:-translate-y-1 hover:shadow-lg">
        {/* Top - Quest Title */}
        <div className="border-b border-border p-4">
          <h3 className="line-clamp-2 text-lg font-semibold text-foreground transition-colors group-hover:text-primary">
            {quest.title}
          </h3>
        </div>

        {/* Middle - Description & Tech Stack */}
        <div className="flex flex-1 flex-col gap-4 p-4">
          {/* Description */}
          <p className="line-clamp-2 text-sm text-foreground-muted">
            {quest.description}
          </p>

          {/* Tech Stack Tags */}
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

        {/* Bottom - Reward, Deadline, Participants & CTA */}
        <div className="space-y-4 border-t border-border p-4">
          {/* Stats Row */}
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

          {/* CTA Button */}
          <Button className="w-full bg-primary text-primary-foreground transition-colors hover:bg-primary-hover">
            퀘스트 보기
          </Button>
        </div>
      </Card>
    </Link>
  )
}
