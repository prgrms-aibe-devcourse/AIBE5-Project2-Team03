'use client'

import { useState } from 'react'
import { useParams } from 'next/navigation'
import { GlobalNav } from '@/components/global-nav'
import { QuestHeader } from '@/components/quest-detail/quest-header'
import { QuestDescription } from '@/components/quest-detail/quest-description'
import { CompanyInfo } from '@/components/quest-detail/company-info'
import { ActivityInfo } from '@/components/quest-detail/activity-info'
import { RelatedQuests } from '@/components/quest-detail/related-quests'
import { SubmissionForm } from '@/components/quest-detail/submission-form'
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
  postedDate: string
  experienceLevel: 'beginner' | 'intermediate' | 'advanced'
  projectType: 'short' | 'long'
  collaborationType: 'remote' | 'offline' | 'hybrid'
  company: {
    name: string
    joinDate: string
    questCount: number
    totalPayout: string
    description?: string
  }
  activity: {
    participantCount: number
    submissionCount: number
    reviewingCount: number
    selectedCount: number
  }
  relatedQuests?: Array<{
    id: string
    title: string
    reward: string
    techStack: string[]
    deadline: string
  }>
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
    postedDate: '2일 전',
    experienceLevel: 'intermediate',
    projectType: 'short',
    collaborationType: 'remote',
    company: {
      name: 'QuestLabs',
      joinDate: '2025.10',
      questCount: 12,
      totalPayout: '₩8,500,000',
      description: 'React 기반 서비스와 SaaS 제품을 운영하는 스타트업입니다.',
    },
    activity: {
      participantCount: 15,
      submissionCount: 6,
      reviewingCount: 3,
      selectedCount: 0,
    },
    relatedQuests: [
      {
        id: '4',
        title: 'Next.js E-commerce 성능 개선',
        reward: '₩1,200,000',
        techStack: ['Next.js', 'React', 'TypeScript'],
        deadline: '7일 남음',
      },
      {
        id: '5',
        title: 'SaaS 관리자 페이지 UX 개선',
        reward: '₩900,000',
        techStack: ['React', 'Figma', 'UX'],
        deadline: '4일 남음',
      },
      {
        id: '6',
        title: 'API 응답 속도 최적화',
        reward: '₩1,500,000',
        techStack: ['Node.js', 'Express', 'Performance'],
        deadline: '6일 남음',
      },
    ],
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
    postedDate: '3일 전',
    experienceLevel: 'intermediate',
    projectType: 'long',
    collaborationType: 'remote',
    company: {
      name: 'TaskFlow Inc',
      joinDate: '2025.08',
      questCount: 8,
      totalPayout: '₩5,200,000',
    },
    activity: {
      participantCount: 12,
      submissionCount: 4,
      reviewingCount: 2,
      selectedCount: 1,
    },
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
    postedDate: '1일 전',
    experienceLevel: 'advanced',
    projectType: 'long',
    collaborationType: 'remote',
    company: {
      name: 'CloudSync Systems',
      joinDate: '2025.06',
      questCount: 18,
      totalPayout: '₩12,300,000',
    },
    activity: {
      participantCount: 22,
      submissionCount: 8,
      reviewingCount: 4,
      selectedCount: 2,
    },
  },
}

export default function QuestDetailPage() {
  const params = useParams()
  const questId = params.id as string
  const quest = MOCK_QUESTS[questId]
  const [participationStatus, setParticipationStatus] = useState<
    'idle' | 'participating' | 'submitted'
  >('idle')

  if (!quest) {
    return (
      <div className="min-h-screen bg-background">
        <GlobalNav />
        <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 xl:px-12">
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

  const handleSubmission = (data: any) => {
    console.log('[v0] Submission data:', data)
    setParticipationStatus('submitted')
    // In a real app, this would send data to backend
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
        postedDate={quest.postedDate}
        experienceLevel={quest.experienceLevel}
        projectType={quest.projectType}
        collaborationType={quest.collaborationType}
        onParticipate={handleParticipate}
      />

      {/* Main Content */}
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 xl:px-12">
        <div className="grid gap-8 lg:grid-cols-[1fr_380px] lg:gap-16">
          {/* Left Column - Description (wider) */}
          <div className="min-w-0 space-y-8">
            <QuestDescription
              description={quest.fullDescription}
              techStack={quest.techStack}
              submissionFormat={quest.submissionFormat}
            />

            {/* Company Info Section */}
            <CompanyInfo company={quest.company} />

            {/* Activity Info Section */}
            <ActivityInfo activity={quest.activity} />

            {/* Related Quests Section */}
            {quest.relatedQuests && (
              <RelatedQuests quests={quest.relatedQuests} />
            )}
          </div>

          {/* Right Column - Submission Form (fixed width sidebar) */}
          <div className="lg:w-[380px]">
            <div className="sticky top-24 space-y-6 rounded-xl border border-border bg-surface p-6 shadow-sm">
              {participationStatus === 'idle' && (
                <div className="space-y-3 text-center">
                  <h3 className="font-semibold text-foreground">
                    이 퀨스트에 참여하시겠어요?
                  </h3>
                  <Button
                    className="w-full bg-primary text-primary-foreground hover:bg-primary-hover"
                    onClick={handleParticipate}
                  >
                    퀘스트 참여하기
                  </Button>
                </div>
              )}

              {(participationStatus === 'participating' ||
                participationStatus === 'submitted') && (
                <SubmissionForm questId={questId} onSubmit={handleSubmission} />
              )}

              {participationStatus === 'submitted' && (
                <div className="rounded-lg border border-border bg-primary-light p-4 text-center">
                  <p className="text-sm font-medium text-primary">
                    ✓ 제출되었습니다!
                  </p>
                  <p className="mt-1 text-xs text-foreground-muted">
                    리뷰 진행 중입니다. 곧 연���드리겠습니다.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
