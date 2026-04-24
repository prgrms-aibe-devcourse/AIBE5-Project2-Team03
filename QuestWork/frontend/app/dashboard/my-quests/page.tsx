'use client'

import Link from 'next/link'
import { GlobalNav } from '@/components/global-nav'
import { DashboardShell } from '@/components/dashboard/dashboard-shell'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'

const MY_QUESTS = [
  {
    id: '1',
    title: 'React Admin Dashboard Performance Optimization',
    status: '진행 중',
    reward: '₩500,000',
    deadline: '5일 남음',
    progress: 60,
  },
  {
    id: '2',
    title: 'REST API for Microservices Architecture',
    status: '진행 중',
    reward: '₩350,000',
    deadline: '3일 남음',
    progress: 45,
  },
  {
    id: '3',
    title: 'Spring Boot REST Service',
    status: '완료',
    reward: '₩220,000',
    deadline: '완료됨',
    progress: 100,
  },
]

export default function MyQuestsPage() {
  return (
    <div className="min-h-screen bg-background">
      <GlobalNav />

      <DashboardShell>
        <div className="mb-8">
          <p className="text-sm font-semibold text-primary">내 퀘스트</p>
          <h1 className="mt-1 text-3xl font-bold text-foreground">
            참여 중인 퀘스트를 관리해보세요
          </h1>
          <p className="mt-2 text-foreground-muted">
            진행 중이거나 완료한 퀘스트의 상태와 진행률을 한눈에 확인할 수 있습니다.
          </p>
        </div>

        <div className="grid gap-4">
          {MY_QUESTS.map((quest) => (
            <Card key={quest.id} className="border border-border">
              <div className="p-5">
                <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <h2 className="text-lg font-semibold text-foreground">
                        {quest.title}
                      </h2>
                      <Badge
                        className={
                          quest.status === '완료'
                            ? 'bg-green-100 text-green-700'
                            : 'bg-primary-light text-primary'
                        }
                      >
                        {quest.status}
                      </Badge>
                    </div>
                    <div className="mt-3 flex flex-wrap gap-4 text-sm text-foreground-muted">
                      <span>보상 {quest.reward}</span>
                      <span>{quest.deadline}</span>
                    </div>
                    <div className="mt-4 h-2 overflow-hidden rounded-full bg-surface-raised">
                      <div
                        className="h-full rounded-full bg-primary"
                        style={{ width: `${quest.progress}%` }}
                      />
                    </div>
                  </div>

                  <Button variant="outline" asChild>
                    <Link href={`/quests/${quest.id}`}>상세 보기</Link>
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </DashboardShell>
    </div>
  )
}
