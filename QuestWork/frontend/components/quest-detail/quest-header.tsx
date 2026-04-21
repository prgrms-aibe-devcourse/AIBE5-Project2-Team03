'use client'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'

interface QuestHeaderProps {
  title: string
  reward: string
  deadline: string
  participants: number
  postedDate: string
  experienceLevel: 'beginner' | 'intermediate' | 'advanced'
  projectType: 'short' | 'long'
  collaborationType: 'remote' | 'offline' | 'hybrid'
  onParticipate: () => void
}

const EXPERIENCE_LEVEL_KR = {
  beginner: '초급',
  intermediate: '중급',
  advanced: '고급',
}

const PROJECT_TYPE_KR = {
  short: '단기 퀘스트',
  long: '장기 프로젝트',
}

const COLLABORATION_TYPE_KR = {
  remote: '원격 협업',
  offline: '오프라인 협업',
  hybrid: '혼합형',
}

export function QuestHeader({
  title,
  reward,
  deadline,
  participants,
  postedDate,
  experienceLevel,
  projectType,
  collaborationType,
  onParticipate,
}: QuestHeaderProps) {
  return (
    <div className="border-b border-border bg-surface">
      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8 xl:px-12">
        <div className="flex flex-col gap-6">
          {/* Title */}
          <div>
            <h1 className="text-3xl font-bold text-foreground sm:text-4xl">
              {title}
            </h1>
          </div>

          {/* Stats Grid - Extended */}
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-5">
            <div className="flex flex-col gap-1">
              <span className="text-xs font-medium text-foreground-muted">
                보상
              </span>
              <span className="text-lg font-bold text-primary sm:text-xl">{reward}</span>
            </div>
            <div className="flex flex-col gap-1">
              <span className="text-xs font-medium text-foreground-muted">
                마감
              </span>
              <span className="text-sm font-semibold text-foreground sm:text-base">
                {deadline}
              </span>
            </div>
            <div className="flex flex-col gap-1">
              <span className="text-xs font-medium text-foreground-muted">
                참여자
              </span>
              <span className="text-sm font-semibold text-foreground sm:text-base">
                {participants}명
              </span>
            </div>
            <div className="flex flex-col gap-1">
              <span className="text-xs font-medium text-foreground-muted">
                등록일
              </span>
              <span className="text-sm font-semibold text-foreground">
                {postedDate}
              </span>
            </div>
            <div className="flex flex-col gap-1">
              <span className="text-xs font-medium text-foreground-muted">
                난이도
              </span>
              <span className="text-sm font-semibold text-foreground">
                {EXPERIENCE_LEVEL_KR[experienceLevel]}
              </span>
            </div>
          </div>

          {/* Additional Metadata Row */}
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:w-2/3">
            <div className="flex flex-col gap-1">
              <span className="text-xs font-medium text-foreground-muted">
                프로젝트 유형
              </span>
              <span className="text-sm font-semibold text-foreground">
                {PROJECT_TYPE_KR[projectType]}
              </span>
            </div>
            <div className="flex flex-col gap-1">
              <span className="text-xs font-medium text-foreground-muted">
                협업 방식
              </span>
              <span className="text-sm font-semibold text-foreground">
                {COLLABORATION_TYPE_KR[collaborationType]}
              </span>
            </div>
          </div>

          {/* CTA Button */}
          <Button
            size="lg"
            className="w-full bg-primary text-primary-foreground hover:bg-primary-hover sm:w-auto"
            onClick={onParticipate}
          >
            퀘스트 참여하기
          </Button>
        </div>
      </div>
    </div>
  )
}
