'use client'

import Link from 'next/link'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'

interface RelatedQuest {
  id: string
  title: string
  reward: string
  techStack: string[]
  deadline: string
}

interface RelatedQuestsProps {
  quests: RelatedQuest[]
}

export function RelatedQuests({ quests }: RelatedQuestsProps) {
  if (!quests || quests.length === 0) return null

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-bold text-foreground">비슷한 퀘스트</h3>
      
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {quests.map((quest) => (
          <Link key={quest.id} href={`/quests/${quest.id}`}>
            <div className="group flex h-full flex-col gap-3 rounded-lg border border-border bg-surface p-4 transition-all hover:shadow-md hover:border-primary/50">
              {/* Title */}
              <h4 className="line-clamp-2 font-semibold text-foreground group-hover:text-primary">
                {quest.title}
              </h4>

              {/* Reward and Deadline */}
              <div className="flex items-center justify-between text-sm">
                <span className="font-bold text-primary">{quest.reward}</span>
                <span className="text-xs text-foreground-muted">{quest.deadline}</span>
              </div>

              {/* Tech Stack */}
              <div className="flex flex-wrap gap-1">
                {quest.techStack.slice(0, 3).map((tech) => (
                  <Badge
                    key={tech}
                    className="bg-primary-light text-primary text-xs"
                  >
                    {tech}
                  </Badge>
                ))}
              </div>

              {/* View Button */}
              <Button
                variant="outline"
                size="sm"
                className="mt-auto w-full text-xs"
              >
                상세보기
              </Button>
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}
