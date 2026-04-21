'use client'

import Link from 'next/link'
import { GlobalNav } from '@/components/global-nav'
import { DashboardSidebar } from '@/components/dashboard/dashboard-sidebar'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'

const MY_QUESTS = [
  {
    id: '1',
    title: 'React Admin Dashboard Performance Optimization',
    status: '진행중',
    reward: '₩500,000',
    deadline: '5일 남음',
    progress: 60,
  },
  {
    id: '2',
    title: 'REST API for Microservices Architecture',
    status: '진행중',
    reward: '₩750,000',
    deadline: '3일 남음',
    progress: 45,
  },
  {
    id: '3',
    title: 'Spring Boot REST Service',
    status: '완료',
    reward: '₩420,000',
    deadline: '완료됨',
    progress: 100,
  },
]

export default function MyQuestsPage() {
  return (
    <div className="min-h-screen bg-background">
      <GlobalNav />

      <div className="flex">
        <DashboardSidebar />

        <main className="flex-1 p-6 lg:p-8">
          <div className="mb-8">
            <p className="text-sm font-semibold text-primary">My Quests</p>
            <h1 className="mt-1 text-3xl font-bold text-foreground">
              내가 참여한 퀘스트
            </h1>
            <p className="mt-2 text-foreground-muted">
              참여 중이거나 완료한 퀘스트의 진행 상황을 관리하세요.
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
        </main>
      </div>
    </div>
  )
}
