'use client'

import Link from 'next/link'
import { GlobalNav } from '@/components/global-nav'
import { DashboardShell } from '@/components/dashboard/dashboard-shell'
import { StatCard } from '@/components/dashboard/stat-card'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'

const OVERVIEW_STATS = [
  {
    label: '진행 중인 퀘스트',
    value: '3개',
    subtext: '이번 주 마감 2개',
  },
  {
    label: '완료한 퀘스트',
    value: '5개',
    subtext: '지난달보다 2개 증가',
  },
  {
    label: '제출한 결과물',
    value: '8건',
    subtext: '현재 3건 검토 중',
  },
  {
    label: '총 수익',
    value: '₩1,250,000',
    subtext: '정산 대기 ₩300,000',
    accent: true,
  },
  {
    label: '블로그 글',
    value: '4개',
    subtext: '임시 저장 1개 포함',
  },
]

const RECENT_SUBMISSIONS = [
  {
    id: '1',
    title: 'React Admin Dashboard Performance Optimization',
    date: '2024-04-10',
    status: '검토 중',
    href: '/dashboard/my-submissions',
  },
  {
    id: '2',
    title: 'Next.js E-commerce Platform',
    date: '2024-04-08',
    status: '선정 완료',
    href: '/dashboard/my-submissions',
  },
]

const RECENT_QUESTS = [
  {
    id: '1',
    title: 'REST API for Microservices Architecture',
    meta: '진행률 45%',
    href: '/dashboard/my-quests',
  },
  {
    id: '2',
    title: 'Spring Boot REST Service',
    meta: '완료됨',
    href: '/dashboard/my-quests',
  },
]

const RECENT_EARNINGS = [
  {
    id: '1',
    title: 'React Admin Dashboard',
    amount: '₩500,000',
    date: '2024-04-12',
  },
  {
    id: '2',
    title: 'Mobile App Task Flow',
    amount: '₩300,000',
    date: '2024-04-09',
  },
]

export default function DashboardPage() {
  return (
    <div className="min-h-screen bg-background">
      <GlobalNav />

      <DashboardShell>
        <div className="space-y-8">
          <div>
            <p className="text-sm font-semibold text-primary">대시보드</p>
            <h1 className="mt-1 text-3xl font-bold text-foreground">
              내 작업 현황을 한눈에 확인해보세요
            </h1>
            <p className="mt-2 text-foreground-muted">
              퀘스트 진행 상황, 제출 결과, 수익과 블로그 활동까지 한곳에서 살펴볼 수 있습니다.
            </p>
          </div>

          <section
            className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5"
            aria-label="대시보드 요약"
          >
            {OVERVIEW_STATS.map((stat) => (
              <StatCard
                key={stat.label}
                label={stat.label}
                value={stat.value}
                subtext={stat.subtext}
                accent={stat.accent}
              />
            ))}
          </section>

          <section className="grid gap-6 xl:grid-cols-3">
            <Card className="border border-border">
              <div className="p-6">
                <div className="mb-4 flex items-center justify-between">
                  <h2 className="text-lg font-semibold text-foreground">
                    최근 제출 결과
                  </h2>
                  <Link
                    href="/dashboard/my-submissions"
                    className="text-sm font-medium text-primary hover:underline"
                  >
                    전체 보기
                  </Link>
                </div>

                <div className="space-y-3">
                  {RECENT_SUBMISSIONS.map((item) => (
                    <Link key={item.id} href={item.href}>
                      <div className="rounded-lg border border-border p-4 transition-colors hover:bg-surface">
                        <div className="flex items-start justify-between gap-3">
                          <h3 className="line-clamp-2 text-sm font-semibold text-foreground">
                            {item.title}
                          </h3>
                          <Badge className="shrink-0 bg-primary-light text-primary">
                            {item.status}
                          </Badge>
                        </div>
                        <p className="mt-2 text-xs text-foreground-muted">
                          제출일 {item.date}
                        </p>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            </Card>

            <Card className="border border-border">
              <div className="p-6">
                <div className="mb-4 flex items-center justify-between">
                  <h2 className="text-lg font-semibold text-foreground">
                    최근 참여 퀘스트
                  </h2>
                  <Link
                    href="/dashboard/my-quests"
                    className="text-sm font-medium text-primary hover:underline"
                  >
                    전체 보기
                  </Link>
                </div>

                <div className="space-y-3">
                  {RECENT_QUESTS.map((item) => (
                    <Link key={item.id} href={item.href}>
                      <div className="rounded-lg border border-border p-4 transition-colors hover:bg-surface">
                        <h3 className="line-clamp-2 text-sm font-semibold text-foreground">
                          {item.title}
                        </h3>
                        <p className="mt-2 text-xs text-foreground-muted">
                          {item.meta}
                        </p>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            </Card>

            <Card className="border border-border">
              <div className="p-6">
                <div className="mb-4 flex items-center justify-between">
                  <h2 className="text-lg font-semibold text-foreground">
                    최근 수익
                  </h2>
                  <Link
                    href="/dashboard/earnings"
                    className="text-sm font-medium text-primary hover:underline"
                  >
                    전체 보기
                  </Link>
                </div>

                <div className="space-y-3">
                  {RECENT_EARNINGS.map((item) => (
                    <div
                      key={item.id}
                      className="rounded-lg border border-border p-4"
                    >
                      <div className="flex items-start justify-between gap-3">
                        <h3 className="line-clamp-2 text-sm font-semibold text-foreground">
                          {item.title}
                        </h3>
                        <span className="shrink-0 text-sm font-bold text-primary">
                          {item.amount}
                        </span>
                      </div>
                      <p className="mt-2 text-xs text-foreground-muted">
                        지급일 {item.date}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </Card>
          </section>
        </div>
      </DashboardShell>
    </div>
  )
}
