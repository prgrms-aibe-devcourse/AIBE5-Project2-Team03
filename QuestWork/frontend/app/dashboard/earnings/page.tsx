'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { GlobalNav } from '@/components/global-nav'
import { DashboardShell } from '@/components/dashboard/dashboard-shell'
import { StatCard } from '@/components/dashboard/stat-card'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'

interface Transaction {
  id: number
  amount: number
  type: string
  status: string
  description: string
  createdAt: string
}

const TYPE_LABEL: Record<string, string> = {
  SETTLEMENT: '퀘스트 보상',
  WITHDRAW: '출금',
  BONUS: '보너스',
}

const TYPE_COLOR: Record<string, string> = {
  SETTLEMENT: 'bg-green-100 text-green-700',
  WITHDRAW: 'bg-slate-100 text-slate-700',
  BONUS: 'bg-primary-light text-primary',
}

export default function EarningsPage() {
  const router = useRouter()
  const [balance, setBalance] = useState<number | null>(null)
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const userId = localStorage.getItem('userId')
    if (!userId) { router.push('/login'); return }

    const fetchData = async () => {
      try {
        const [walletRes, txRes] = await Promise.all([
          fetch(`http://localhost:8000/api/settlement/wallet/${userId}`),
          fetch(`http://localhost:8000/api/settlement/transactions/${userId}`),
        ])
        if (walletRes.ok) {
          const w = await walletRes.json()
          setBalance(w.balance ?? 0)
        }
        if (txRes.ok) {
          const txs: Transaction[] = await txRes.json()
          setTransactions(txs)
        }
      } catch (e) {
        console.error(e)
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [router])

  const totalIncome = transactions
    .filter((t) => t.amount > 0)
    .reduce((s, t) => s + t.amount, 0)

  const totalWithdraw = transactions
    .filter((t) => t.amount < 0)
    .reduce((s, t) => s + Math.abs(t.amount), 0)

  return (
    <div className="min-h-screen bg-background">
      <GlobalNav />

      <DashboardShell>
        <div className="mb-8">
          <p className="text-sm font-semibold text-primary">수익 관리</p>
          <h1 className="mt-1 text-3xl font-bold text-foreground">
            수익 내역을 확인해보세요
          </h1>
          <p className="mt-2 text-foreground-muted">
            퀘스트 보상 지급 현황과 지갑 잔액을 확인할 수 있습니다.
          </p>
        </div>

        {loading ? (
          <p className="text-sm text-foreground-muted">불러오는 중...</p>
        ) : (
          <>
            <div className="mb-6 grid gap-4 md:grid-cols-3">
              <StatCard
                label="지갑 잔액"
                value={`₩${(balance ?? 0).toLocaleString()}`}
                subtext="현재 출금 가능 잔액"
                accent
              />
              <StatCard
                label="총 수익"
                value={`₩${totalIncome.toLocaleString()}`}
                subtext="누적 입금 금액"
              />
              <StatCard
                label="총 출금"
                value={`₩${totalWithdraw.toLocaleString()}`}
                subtext="누적 출금 금액"
              />
            </div>

            <Card className="border border-border">
              <div className="p-6">
                <h2 className="text-lg font-semibold text-foreground">거래 내역</h2>
                {transactions.length === 0 ? (
                  <p className="mt-4 text-sm text-foreground-muted">아직 거래 내역이 없습니다.</p>
                ) : (
                  <div className="mt-4 divide-y divide-border">
                    {transactions.map((tx) => (
                      <div
                        key={tx.id}
                        className="flex items-center justify-between gap-4 py-4 first:pt-0 last:pb-0"
                      >
                        <div className="flex items-center gap-3">
                          <Badge className={TYPE_COLOR[tx.type] ?? 'bg-slate-100 text-slate-700'}>
                            {TYPE_LABEL[tx.type] ?? tx.type}
                          </Badge>
                          <div>
                            <p className="text-sm font-medium text-foreground">{tx.description || '-'}</p>
                            <p className="mt-0.5 text-xs text-foreground-muted">
                              {new Date(tx.createdAt).toLocaleString('ko-KR')}
                            </p>
                          </div>
                        </div>
                        <p className={`shrink-0 font-bold ${tx.amount >= 0 ? 'text-primary' : 'text-red-500'}`}>
                          {tx.amount >= 0 ? '+' : ''}₩{Math.abs(tx.amount).toLocaleString()}
                        </p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </Card>
          </>
        )}
      </DashboardShell>
    </div>
  )
}
