'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { GlobalNav } from '@/components/global-nav'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import Link from 'next/link'

interface QuestApiResponse {
  id: number
  managerId: number
  title: string
  formData: Record<string, unknown>
  rewardAmount: number
  deadline: string
  status: string
  createdAt: string
  updatedAt: string
}

export default function QuestDetailPage() {
  const params = useParams()
  const router = useRouter()
  const questId = params.id as string
  const [quest, setQuest] = useState<QuestApiResponse | null>(null)
  const [loading, setLoading] = useState(true)
  const [applied, setApplied] = useState(false)
  const [applying, setApplying] = useState(false)
  const [applyError, setApplyError] = useState<string | null>(null)
  const [applicationId, setApplicationId] = useState<number | null>(null)
  const [cancelling, setCancelling] = useState(false)
  const [userRole, setUserRole] = useState<string | null>(null)

  useEffect(() => {
    const role = localStorage.getItem('role')
    setUserRole(role)

    const userId = localStorage.getItem('userId')
    if (!userId || role === 'MANAGER') return

    // 기존 지원 여부 조회
    const checkApplication = async () => {
      try {
        const res = await fetch(
          `http://localhost:8000/api/quests/${questId}/applications/me?userId=${userId}`
        )
        if (res.ok) {
          const data = await res.json()
          setApplicationId(data.applicationId)
          setApplied(true)
        }
      } catch {
        // 조회 실패 시 기본 상태 유지
      }
    }
    checkApplication()
  }, [questId])

  useEffect(() => {
    const fetchQuest = async () => {
      try {
        const res = await fetch(`http://localhost:8000/api/quests/${questId}`)
        if (!res.ok) {
          setQuest(null)
        } else {
          const data: QuestApiResponse = await res.json()
          setQuest(data)
        }
      } catch {
        setQuest(null)
      } finally {
        setLoading(false)
      }
    }
    fetchQuest()
  }, [questId])

  const formatDeadline = (deadline: string) => {
    const diff = Math.ceil((new Date(deadline).getTime() - Date.now()) / (1000 * 60 * 60 * 24))
    return diff > 0 ? `${diff}일 남음` : '마감'
  }

  const formatReward = (amount: number) =>
    `₩${amount.toLocaleString('ko-KR')}`

  const handleApply = async () => {
    const userId = localStorage.getItem('userId')
    if (!userId) {
      router.push('/login')
      return
    }
    setApplying(true)
    setApplyError(null)
    try {
      const res = await fetch(
        `http://localhost:8000/api/quests/${questId}/applications?userId=${userId}`,
        { method: 'POST' }
      )
      if (res.ok) {
        const data = await res.json()
        setApplicationId(data.applicationId)
        setApplied(true)
      } else {
        const data = await res.json().catch(() => ({}))
        setApplyError(data.message || '지원에 실패했습니다.')
      }
    } catch {
      setApplyError('서버 연결에 실패했습니다.')
    } finally {
      setApplying(false)
    }
  }

  const handleCancel = async () => {
    const userId = localStorage.getItem('userId')
    if (!userId || !applicationId) return
    setCancelling(true)
    setApplyError(null)
    try {
      const res = await fetch(
        `http://localhost:8000/api/quests/applications/${applicationId}/cancel?userId=${userId}`,
        { method: 'PATCH' }
      )
      if (res.ok) {
        setApplied(false)
        setApplicationId(null)
      } else {
        const data = await res.json().catch(() => ({}))
        setApplyError(data.message || '취소에 실패했습니다.')
      }
    } catch {
      setApplyError('서버 연결에 실패했습니다.')
    } finally {
      setCancelling(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <GlobalNav />
        <div className="flex items-center justify-center py-32">
          <p className="text-foreground-muted">로딩 중...</p>
        </div>
      </div>
    )
  }

  if (!quest) {
    return (
        <div className="min-h-screen bg-background">
          <GlobalNav />
          <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 xl:px-12">
            <div className="text-center">
              <h1 className="text-2xl font-bold text-foreground">퀘스트를 찾을 수 없습니다</h1>
              <p className="mt-2 text-foreground-muted">요청하신 {questId}번 퀘스트가 존재하지 않습니다.</p>
              <Link href="/quests"><Button className="mt-4">퀘스트로 돌아가기</Button></Link>
            </div>
          </div>
        </div>
    )
  }

  const deadlineText = formatDeadline(quest.deadline)
  const formData = quest.formData as Record<string, unknown>
  const description = (formData?.description as string) ?? ''
  const techStack: string[] = Array.isArray(formData?.techStack)
    ? (formData.techStack as string[])
    : []

  return (
      <div className="min-h-screen bg-background">
        <GlobalNav />

      {/* Header */}
      <div className="border-b border-border bg-surface">
        <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8 xl:px-12">
          <h1 className="text-3xl font-bold text-foreground">{quest.title}</h1>
          <div className="mt-4 flex flex-wrap items-center gap-3 text-sm text-foreground-muted">
            <span className="text-lg font-semibold text-primary">
              {formatReward(quest.rewardAmount)}
            </span>
            <span>·</span>
            <span>{deadlineText}</span>
            <span>·</span>
            <Badge variant={quest.status === 'OPEN' ? 'default' : 'secondary'}>
              {quest.status}
            </Badge>
          </div>
          {techStack.length > 0 && (
            <div className="mt-3 flex flex-wrap gap-2">
              {techStack.map((tech) => (
                <Badge key={tech} variant="outline">
                  {tech}
                </Badge>
              ))}
            </div>
          )}
        </div>
      </div>
      

      {/* Main Content */}
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 xl:px-12">
        <div className="grid gap-8 lg:grid-cols-[1fr_360px] lg:gap-16">
          {/* Left: Description */}
          <div className="space-y-6">
            {description && (
              <div className="rounded-xl border border-border bg-surface p-6">
                <h2 className="mb-3 text-lg font-semibold text-foreground">
                  퀘스트 설명
                </h2>
                <p className="whitespace-pre-line text-foreground-muted">
                  {description}
                </p>
              </div>
            )}
            <div className="rounded-xl border border-border bg-surface p-6">
              <h2 className="mb-3 text-lg font-semibold text-foreground">
                퀘스트 정보
              </h2>
              <dl className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <dt className="text-foreground-muted">보상</dt>
                  <dd className="font-semibold text-primary">
                    {formatReward(quest.rewardAmount)}
                  </dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-foreground-muted">마감</dt>
                  <dd className="text-foreground">{deadlineText}</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-foreground-muted">상태</dt>
                  <dd className="text-foreground">{quest.status}</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-foreground-muted">등록일</dt>
                  <dd className="text-foreground">
                    {new Date(quest.createdAt).toLocaleDateString('ko-KR')}
                  </dd>
                </div>
              </dl>
            </div>
          </div>

          {/* Right: Actions */}
          <div>
            <div className="sticky top-24 space-y-3 rounded-xl border border-border bg-surface p-6 shadow-sm">
              <h3 className="text-center font-semibold text-foreground">
                이 퀘스트에 참여하시겠어요?
              </h3>
              {userRole !== 'MANAGER' && (
                <>
                  {applied ? (
                    <>
                      <Button
                        className="w-full bg-green-600 text-white hover:bg-green-700 cursor-default"
                        disabled
                      >
                        ✓ 참여 중
                      </Button>
                      <Button
                        variant="outline"
                        className="w-full border-red-300 text-red-600 hover:bg-red-50"
                        onClick={handleCancel}
                        disabled={cancelling}
                      >
                        {cancelling ? '취소 중...' : '참여 취소하기'}
                      </Button>
                    </>
                  ) : (
                    <Button
                      className="w-full bg-primary text-primary-foreground hover:bg-primary-hover"
                      onClick={handleApply}
                      disabled={applying}
                    >
                      {applying ? '신청 중...' : '퀘스트 참여하기'}
                    </Button>
                  )}
                  {applyError && (
                    <p className="text-center text-sm text-red-500">{applyError}</p>
                  )}
                </>
              )}
              <Link href={`/quests/${questId}/submit`} className="block">
                <Button variant="outline" className="w-full">
                  결과 제출하기
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
      </div>
  )
}