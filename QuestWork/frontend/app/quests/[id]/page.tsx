'use client'

import { useState } from 'react'
import { useParams } from 'next/navigation'
import { toast } from '@/hooks/use-toast'
import { addStoredSubmission } from '@/lib/quest-submissions'
import { GlobalNav } from '@/components/global-nav'
import { QuestHeader } from '@/components/quest-detail/quest-header'
import { QuestDescription } from '@/components/quest-detail/quest-description'
import {
  SubmissionForm,
  type SubmissionData,
} from '@/components/quest-detail/submission-form'
import { Button } from '@/components/ui/button'
import Link from 'next/link'

interface QuestDetailData {
  id: string
  title: string
  description: string
  fullDescription: string
  techStack: string[]
  reward: string
  deadline: string
  participants: number
  submissionFormat: string
}

// Mock quest data
const MOCK_QUESTS: Record<string, QuestDetailData> = {
  '1': {
    id: '1',
    title: 'React Admin Dashboard Performance Optimization',
    description:
      'Improve rendering performance and reduce bundle size in a React admin dashboard.',
    fullDescription: `우리 회사의 React 관리자 대시보드는 복잡한 데이터 시각화와 실시간 업데이트를 처리하고 있습니다. 하지만 최근 사용자들이 느린 로딩 시간과 버벅거림을 보고하고 있습니다.

당신의 작업:
1. 현재 대시보드의 성능 프로필링 수행
2. 렌더링 병목 지점 식별
3. 번들 크기 최적화
4. 필요한 최적화 기법 적용 (메모이제이션, 코드 분할, 가상화 등)
5. 최적화 전후 성능 비교 리포트 작성

성능 개선을 통해 로딩 시간을 50% 이상 줄일 수 있다면 더 높은 보상을 고려합니다.`,
    techStack: ['React', 'Next.js', 'TypeScript', 'Performance Optimization'],
    reward: '₩1,000,000',
    deadline: '5일 남음',
    participants: 15,
    submissionFormat: `제출 시 다음을 포함해주세요:
1. 최적화된 코드 (GitHub 저장소 또는 ZIP 파일)
2. 성능 개선 리포트 (PDF 또는 마크다운)
3. 성능 측정 결과 (스크린샷 또는 CSV)
4. 개선 사항 설명 (README 파일)`,
  },
  '2': {
    id: '2',
    title: 'Mobile App for Task Management',
    description:
      'Develop a cross-platform task management application with offline capabilities and cloud synchronization.',
    fullDescription: `팀 협업을 위한 모바일 태스크 관리 애플리케이션을 개발해야 합니다.

요구사항:
1. iOS 및 Android 지원 (React Native 또는 Flutter)
2. 오프라인 모드 지원
3. 클라우드 동기화 (Firebase 또는 MongoDB)
4. 실시간 팀 협업 기능
5. 푸시 알림
6. 다크 모드 지원

필수 기능:
- 태스크 생성/편집/삭제
- 카테고리 및 우선순위 관리
- 완료된 항목 표시
- 팀 멤버와 공유
- 기한 알림`,
    techStack: ['React Native', 'Firebase', 'TypeScript'],
    reward: '₩800,000',
    deadline: '7일 남음',
    participants: 12,
    submissionFormat: `제출 시 다음을 포함해주세요:
1. 전체 소스 코드
2. 설치 및 실행 방법
3. 사용된 외부 라이브러리 목록
4. 스크린샷 (최소 5개)
5. 테스트 케이스
6. README 파일`,
  },
  '3': {
    id: '3',
    title: 'REST API for Microservices Architecture',
    description:
      'Design and implement a robust REST API with authentication, rate limiting, and comprehensive documentation.',
    fullDescription: `마이크로서비스 아키텍처를 지원하는 견고한 REST API를 설계하고 구현해야 합니다.

요구사항:
1. JWT 기반 인증
2. 레이트 리미팅 구현
3. API 버전 관리
4. 에러 처리 및 로깅
5. 캐싱 전략
6. 데이터베이스 최적화

추가 요구사항:
- Docker 컨테이너화
- API 문서 (Swagger/OpenAPI)
- 단위 테스트 (최소 80% 커버리지)
- CI/CD 파이프라인 설정`,
    techStack: ['Node.js', 'Express', 'MongoDB', 'Docker'],
    reward: '₩1,500,000',
    deadline: '3일 남음',
    participants: 22,
    submissionFormat: `제출 시 다음을 포함해주세요:
1. 완전한 API 소스 코드
2. Docker 설정 파일
3. API 문서 (Swagger 형식)
4. 테스트 코드 및 결과
5. 성능 테스트 결과
6. 배포 가이드`,
  },
}

export default function QuestDetailPage() {
  const params = useParams()
  const questId = params.id as string
  const quest = MOCK_QUESTS[questId]
  const [participationStatus, setParticipationStatus] = useState<
    'idle' | 'participating' | 'submitted'
  >('idle')
  const [lastSubmissionTitle, setLastSubmissionTitle] = useState('')

  if (!quest) {
    return (
      <div className="min-h-screen bg-background">
        <GlobalNav />
        <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-foreground">
              퀘스트를 찾을 수 없습니다
            </h1>
            <p className="mt-2 text-foreground-muted">
              요청하신 퀘스트가 존재하지 않습니다.
            </p>
            <Link href="/quests">
              <Button className="mt-4">퀘스트로 돌아가기</Button>
            </Link>
          </div>
        </div>
      </div>
    )
  }

  const handleParticipate = () => {
    setParticipationStatus('participating')
  }

  const handleSubmission = (data: SubmissionData) => {
    console.log('[v0] Submission data:', data)

    addStoredSubmission({
      id: `${quest.id}-${Date.now()}`,
      questId: quest.id,
      questTitle: quest.title,
      reward: quest.reward,
      title: data.title,
      summary: data.summary,
      submissionType: data.submissionType,
      githubUrl: data.githubUrl,
      fileName: data.file?.name,
      submittedAt: new Date().toISOString().slice(0, 10),
      freelancerName: '새 지원자',
    })

    setLastSubmissionTitle(data.title)
    setParticipationStatus('submitted')

    toast({
      title: '제출이 완료되었습니다',
      description: '대시보드에서 제출 현황을 바로 확인할 수 있습니다.',
    })
  }

  return (
    <div className="min-h-screen bg-background">
      <GlobalNav />

      {/* Quest Header */}
      <QuestHeader
        title={quest.title}
        reward={quest.reward}
        deadline={quest.deadline}
        participants={quest.participants}
        onParticipate={handleParticipate}
      />

      {/* Main Content */}
      <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid gap-12 lg:grid-cols-3">
          {/* Left Column - Description */}
          <div className="lg:col-span-2">
            <QuestDescription
              description={quest.fullDescription}
              techStack={quest.techStack}
              submissionFormat={quest.submissionFormat}
            />
          </div>

          {/* Right Column - Submission Form */}
          <div className="lg:col-span-1">
            <div className="sticky top-20 space-y-6 rounded-lg border border-border bg-surface p-6">
              {participationStatus === 'idle' && (
                <div className="space-y-3 text-center">
                  <h3 className="font-semibold text-foreground">
                    이 퀘스트에 참여하시겠어요?
                  </h3>
                  <Button
                    className="w-full bg-primary text-primary-foreground hover:bg-primary-hover"
                    onClick={handleParticipate}
                  >
                    퀘스트 참여하기
                  </Button>
                </div>
              )}

              {participationStatus === 'participating' && (
                <SubmissionForm
                  questId={questId}
                  questTitle={quest.title}
                  submissionGuide={quest.submissionFormat}
                  onSubmit={handleSubmission}
                />
              )}

              {participationStatus === 'submitted' && (
                <div className="space-y-4 rounded-lg border border-border bg-primary-light p-4 text-center">
                  <div>
                    <p className="text-sm font-medium text-primary">
                      ✓ 제출되었습니다!
                    </p>
                    <p className="mt-1 text-xs text-foreground-muted">
                      {lastSubmissionTitle} 항목이 리뷰 대기 상태로 등록되었습니다.
                    </p>
                  </div>

                  <div className="grid gap-2">
                    <Link href="/dashboard">
                      <Button className="w-full bg-primary text-primary-foreground hover:bg-primary-hover">
                        내 제출 현황 보기
                      </Button>
                    </Link>
                    <Link href="/quests">
                      <Button variant="outline" className="w-full">
                        다른 퀘스트 더 보기
                      </Button>
                    </Link>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
