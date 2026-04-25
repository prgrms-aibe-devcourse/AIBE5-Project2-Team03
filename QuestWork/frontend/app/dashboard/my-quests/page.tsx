'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { GlobalNav } from '@/components/global-nav'
import { DashboardShell } from '@/components/dashboard/dashboard-shell'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'

interface QuestItem {
  id: number
  title: string
  status: string
  rewardAmount: number
  deadline: string
}

const STATUS_LABEL: Record<string, string> = {
  OPEN: '모집 중',
  CLOSED: '모집 완료',
  IN_PROCESS: '진행 중',
  FINISHED: '종료',
  PICKED: '선정됨',
  CANCELED: '취소됨',
}

const STATUS_COLOR: Record<string, string> = {
  OPEN: 'bg-green-100 text-green-700',
  PICKED: 'bg-primary-light text-primary',
  IN_PROCESS: 'bg-primary-light text-primary',
  FINISHED: 'bg-slate-100 text-slate-700',
  CLOSED: 'bg-slate-100 text-slate-700',
  CANCELED: 'bg-red-100 text-red-700',
}

export default function MyQuestsPage() {
  const router = useRouter()
  const [quests, setQuests] = useState<QuestItem[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const userId = localStorage.getItem('userId')
    if (!userId) {
      router.push('/login')
      return
    }

    const fetchMyQuests = async () => {
      try {
        const res = await fetch(`http://localhost:8000/api/quests/applied?userId=${userId}`)
        if (!res.ok) throw new Error('퀘스트 조회 실패')
        const data: QuestItem[] = await res.json()
        setQuests(data)
      } catch (e) {
        console.error(e)
      } finally {
        setLoading(false)
      }
    }

    fetchMyQuests()
  }, [router])

  const formatDeadline = (deadline: string) => {
    const diff = Math.ceil((new Date(deadline).getTime() - Date.now()) / (1000 * 60 * 60 * 24))
    if (diff < 0) return '마감됨'
    if (diff === 0) return '오늘 마감'
    return `${diff}일 남음`
  }

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
            지원하거나 진행 중인 퀘스트의 상태를 한눈에 확인할 수 있습니다.
          </p>
        </div>

        {loading ? (
          <p className="text-sm text-foreground-muted">불러오는 중...</p>
        ) : quests.length === 0 ? (
          <div className="rounded-lg border border-dashed border-border p-12 text-center">
            <p className="text-sm text-foreground-muted">아직 지원한 퀘스트가 없습니다.</p>
            <Button asChild className="mt-4 bg-primary text-primary-foreground hover:bg-primary-hover">
              <Link href="/quests">퀘스트 둘러보기</Link>
            </Button>
          </div>
        ) : (
          <div className="grid gap-4">
            {quests.map((quest) => (
              <Card key={quest.id} className="border border-border">
                <div className="p-5">
                  <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <h2 className="text-lg font-semibold text-foreground">
                          {quest.title}
                        </h2>
                        <Badge className={STATUS_COLOR[quest.status] ?? 'bg-slate-100 text-slate-700'}>
                          {STATUS_LABEL[quest.status] ?? quest.status}
                        </Badge>
                      </div>
                      <div className="mt-3 flex flex-wrap gap-4 text-sm text-foreground-muted">
                        <span>보상 ₩{quest.rewardAmount?.toLocaleString()}</span>
                        <span>{formatDeadline(quest.deadline)}</span>
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
        )}
      </DashboardShell>
    </div>
  )
}
