'use client'

import { useEffect, useMemo, useState } from 'react'
import { useRouter } from 'next/navigation'
import { getStoredSubmissions } from '@/lib/quest-submissions'
import { WEB_DEVELOPMENT_QUESTS } from '@/lib/mock-quests-data'
import { GlobalNav } from '@/components/global-nav'
import { ManagerSidebar } from '@/components/manager/manager-sidebar'
import { ManagerProfileForm } from '@/components/manager/manager-profile-form'
import { PostedQuestsSection } from '@/components/manager/posted-quests-section'
import { SubmissionsReviewSection } from '@/components/manager/submissions-review-section'
import { RewardSection } from '@/components/manager/reward-section'
import { Calendar } from '@/components/ui/calendar'
import { Card } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { AlertCircle } from 'lucide-react'

export default function ManagerDashboardPage() {
  const router = useRouter()

  // 💡 상태 정의
  const [dbQuests, setDbQuests] = useState<any[]>([]) // DB에서 가져온 퀘스트
  const [isLoading, setIsLoading] = useState(false)   // 로딩 상태 추가
  const [isAuthorized, setIsAuthorized] = useState<boolean | null>(null)
  const [userId, setUserId] = useState<number | null>(null)
  const [savedSubmissions, setSavedSubmissions] = useState<any[]>([])

  // 1. 페이지 권한 및 유저 정보 로드
  useEffect(() => {
    const savedId = localStorage.getItem('userId') || localStorage.getItem('id')
    const role = localStorage.getItem('role')

    if (role !== 'MANAGER') {
      setIsAuthorized(false)
    } else {
      setIsAuthorized(true)
    }

    if (savedId) {
      setUserId(Number(savedId))
    }
  }, [])

  // 2. 백엔드에서 실제 데이터 가져오는 로직
  useEffect(() => {
    const fetchQuests = async () => {
      if (!userId) return
      setIsLoading(true)
      try {
        const response = await fetch(`http://localhost:8000/api/quests/manager/${userId}`)
        if (!response.ok) throw new Error('데이터 로드 실패')
        const data = await response.json()
        setDbQuests(data)
      } catch (error) {
        console.error("Fetch Error:", error)
      } finally {
        setIsLoading(false)
      }
    }

    // 권한 확인이 끝난 후 권한이 있을 때만 실행
    if (isAuthorized === true) {
      fetchQuests()
    }
  }, [userId, isAuthorized])

  // 3. 제출 데이터 로드 (기존 로직 유지)
  useEffect(() => {
    const stored = getStoredSubmissions().map((submission) => ({
      id: submission.id,
      freelancerName: submission.freelancerName,
      questTitle: submission.questTitle,
      questId: submission.questId,
      submittedAt: submission.submittedAt,
      status: 'reviewing' as const,
      githubUrl: submission.githubUrl ?? `파일 제출: ${submission.fileName ?? '첨부파일'}`,
    }))
    setSavedSubmissions(stored)
  }, [])

  // 가짜 제출 데이터
  const submissions = useMemo(() => [
    {
      id: 'mock-1',
      freelancerName: '김개발',
      questTitle: 'React Admin Dashboard Performance Optimization',
      questId: '1',
      submittedAt: '2024-04-10',
      status: 'reviewing' as const,
      githubUrl: 'https://github.com/example/react-dashboard',
    }
  ], [])

  const allSubmissions = useMemo(
      () => [...savedSubmissions, ...submissions],
      [savedSubmissions, submissions]
  )

  return (
      <div className="min-h-screen bg-background">
        <GlobalNav />

        <div className="flex">
          <ManagerSidebar />

          <main className="flex-1">
            <div className="space-y-6 p-6 lg:p-8">
              {/* 권한 경고 */}
              {isAuthorized === false && (
                  <div className="flex gap-3 rounded-lg border border-red-200 bg-red-50 p-4 mb-6">
                    <AlertCircle className="h-5 w-5 flex-shrink-0 text-red-600" />
                    <div>
                      <p className="font-semibold text-red-900">권한이 없습니다</p>
                      <p className="mt-1 text-sm text-red-700">매니저 권한이 필요합니다. 로그인 상태를 확인해 주세요.</p>
                    </div>
                  </div>
              )}

              {/* 헤더 */}
              <div>
                <h1 className="text-3xl font-bold text-foreground">매니저 대시보드</h1>
                <p className="mt-1 text-muted-foreground">등록한 퀘스트와 제출 현황을 관리하세요.</p>
              </div>

              <Tabs defaultValue="dashboard" className="space-y-4">
                <TabsList>
                  <TabsTrigger value="dashboard">대시보드</TabsTrigger>
                  <TabsTrigger value="profile">프로필 설정</TabsTrigger>
                </TabsList>

                <TabsContent value="dashboard" className="space-y-6">
                  {/* 통계 섹션: dbQuests 기반으로 수정 */}
                  <div className="grid gap-4 md:grid-cols-3">
                    <Card className="border p-5">
                      <p className="text-sm text-muted-foreground">활성 퀘스트</p>
                      <p className="mt-2 text-3xl font-bold">
                        {dbQuests.filter(q => q.status === 'OPEN').length}
                      </p>
                    </Card>
                    <Card className="border p-5">
                      <p className="text-sm text-muted-foreground">총 제출</p>
                      <p className="mt-2 text-3xl font-bold">{allSubmissions.length}</p>
                    </Card>
                    <Card className="border p-5 bg-blue-600 text-white">
                      <p className="text-sm opacity-80">총 지급액</p>
                      <p className="mt-2 text-3xl font-bold">
                        ₩{dbQuests.reduce((acc, q) => acc + (q.rewardAmount || 0), 0).toLocaleString()}
                      </p>
                    </Card>
                  </div>

                  <div className="grid gap-6 lg:grid-cols-2">
                    <div className="space-y-6">
                      {/* 💡 dbQuests를 전달합니다. */}
                      <PostedQuestsSection quests={dbQuests} />
                    </div>
                    <div className="space-y-6">
                      <Card className="border p-6">
                        <h3 className="text-lg font-semibold mb-4">퀘스트 데드라인 캘린더</h3>
                        {/* 💡 캘린더에도 실제 데이터를 전달합니다. */}
                        <Calendar quests={dbQuests} className="w-full" />
                      </Card>
                      <RewardSection />
                    </div>
                  </div>

                  <SubmissionsReviewSection submissions={allSubmissions} />
                </TabsContent>

                <TabsContent value="profile">
                  {userId ? (
                      <ManagerProfileForm userId={userId} />
                  ) : (
                      <Card className="p-10 text-center border border-dashed text-muted-foreground">
                        사용자 정보를 불러오는 중입니다...
                      </Card>
                  )}
                </TabsContent>
              </Tabs>
            </div>
          </main>
        </div>
      </div>
  )
}