'use client'

import { GlobalNav } from '@/components/global-nav'
import { DashboardSidebar } from '@/components/dashboard/dashboard-sidebar'
import { StatCard } from '@/components/dashboard/stat-card'
import { Card } from '@/components/ui/card'

const MONTHLY_EARNINGS = [
  { month: '1월', amount: 180000 },
  { month: '2월', amount: 270000 },
  { month: '3월', amount: 300000 },
  { month: '4월', amount: 500000 },
]

const PAYMENTS = [
  {
    id: '1',
    title: 'React Admin Dashboard',
    date: '2024-04-12',
    amount: '₩500,000',
    status: '지급 완료',
  },
  {
    id: '2',
    title: 'Mobile Task Flow',
    date: '2024-04-09',
    amount: '₩300,000',
    status: '지급 대기',
  },
  {
    id: '3',
    title: 'Spring Boot REST Service',
    date: '2024-03-28',
    amount: '₩420,000',
    status: '지급 완료',
  },
]

export default function EarningsPage() {
  const maxAmount = Math.max(...MONTHLY_EARNINGS.map((item) => item.amount))

  return (
    <div className="min-h-screen bg-background">
      <GlobalNav />

      <div className="flex">
        <DashboardSidebar />

        <main className="flex-1 p-6 lg:p-8">
          <div className="mb-8">
            <p className="text-sm font-semibold text-primary">Earnings</p>
            <h1 className="mt-1 text-3xl font-bold text-foreground">
              수익 내역
            </h1>
            <p className="mt-2 text-foreground-muted">
              퀘스트 보상 지급 현황과 월별 수익을 확인하세요.
            </p>
          </div>

          <div className="mb-6 grid gap-4 md:grid-cols-3">
            <StatCard
              label="총 수익"
              value="₩1,250,000"
              subtext="누적 지급액"
              accent
            />
            <StatCard
              label="지급 완료"
              value="₩950,000"
              subtext="완료된 정산"
            />
            <StatCard
              label="지급 대기"
              value="₩300,000"
              subtext="검토 또는 정산 대기"
            />
          </div>

          <div className="grid gap-6 xl:grid-cols-[1fr_1.2fr]">
            <Card className="border border-border">
              <div className="p-6">
                <h2 className="text-lg font-semibold text-foreground">
                  월별 수익
                </h2>

                <div className="mt-6 space-y-4">
                  {MONTHLY_EARNINGS.map((item) => (
                    <div key={item.month} className="flex items-center gap-3">
                      <span className="w-10 text-sm font-medium text-foreground-muted">
                        {item.month}
                      </span>
                      <div className="h-10 flex-1 overflow-hidden rounded-lg bg-surface-raised">
                        <div
                          className="h-full rounded-lg bg-primary"
                          style={{ width: `${(item.amount / maxAmount) * 100}%` }}
                        />
                      </div>
                      <span className="w-24 text-right text-sm font-semibold text-foreground">
                        ₩{item.amount.toLocaleString()}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </Card>

            <Card className="border border-border">
              <div className="p-6">
                <h2 className="text-lg font-semibold text-foreground">
                  최근 지급 내역
                </h2>

                <div className="mt-4 divide-y divide-border">
                  {PAYMENTS.map((payment) => (
                    <div
                      key={payment.id}
                      className="flex items-center justify-between gap-4 py-4 first:pt-0 last:pb-0"
                    >
                      <div>
                        <p className="font-medium text-foreground">
                          {payment.title}
                        </p>
                        <p className="mt-1 text-xs text-foreground-muted">
                          {payment.date} · {payment.status}
                        </p>
                      </div>
                      <p className="shrink-0 font-bold text-primary">
                        {payment.amount}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </Card>
          </div>
        </main>
      </div>
    </div>
  )
}
