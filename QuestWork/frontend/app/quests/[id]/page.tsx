'use client'

import { useState, useEffect } from 'react'
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

export default function QuestDetailPage() {
  const params = useParams()
  const questId = params.id as string

  const [quest, setQuest] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [participationStatus, setParticipationStatus] = useState<'idle' | 'participating' | 'submitted'>('idle');

  useEffect(() => {
    if (questId) {
      console.log("🚀 API 요청 시작! 대상 ID:", questId); // 👈 여기서부터 찍혀야 합니다.
      fetch(`http://localhost:8000/api/quests/${questId}`)
          .then(res => {
            if (!res.ok) throw new Error('데이터를 가져오지 못했습니다.');
            return res.json();
          })
          .then(data => {
            console.log("📦 확인된 데이터 구조:", data);

            // 💡 formData 안에 실제 내용이 있으므로 이를 변수로 빼서 사용합니다.
            const info = data.formData || {};

            const formattedData = {
              ...data,
              // 1. formData 내부의 필드들을 매핑
              fullDescription: info.description || "상세 설명이 없습니다.",
              techStack: info.techStack || [],
              // 2. submissionFormats가 배열이므로 join으로 가공
              submissionFormat: info.submissionFormats ? info.submissionFormats.join(", ") : "온라인 제출",
              // 3. difficulty -> experienceLevel 매핑
              experienceLevel: info.difficulty?.toLowerCase() || 'beginner',

              // 4. 루트(Root)에 있는 보상 및 날짜 데이터
              reward: data.rewardAmount ? `₩${data.rewardAmount.toLocaleString()}` : "보상 협의",
              deadline: data.deadline || "기한 미정",
              postedDate: data.createdAt ? new Date(data.createdAt).toLocaleDateString() : "방금 전",

              // 5. 기업/활동 정보 (기본값 처리)
              company: data.company || {
                name: `매니저 ${data.managerId}번 파트너`,
                joinDate: "2024.01",
                questCount: 1,
                totalPayout: "₩0",
              },
              activity: {
                participantCount: 0,
                submissionCount: 0,
                reviewingCount: 0,
                selectedCount: 0,
              }
            };

            setQuest(formattedData);
            setLoading(false);
          })
          .catch(err => {
            console.error("데이터 로딩 실패:", err);
            setLoading(false);
          });
    }
  }, [questId])


  if (loading) {
    return <div className="flex min-h-screen items-center justify-center">로딩 중...</div>;
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

  const handleParticipate = () => {
    setParticipationStatus('participating')
  }

  const handleSubmission = (data: any) => {
    console.log('제출 데이터:', data)
    setParticipationStatus('submitted')
  }

  return (
      <div className="min-h-screen bg-background">
        <GlobalNav />

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

        <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 xl:px-12">
          <div className="grid gap-8 lg:grid-cols-[1fr_380px] lg:gap-16">
            <div className="min-w-0 space-y-8">
              <QuestDescription
                  description={quest.fullDescription}
                  techStack={quest.techStack}
                  submissionFormat={quest.submissionFormat}
              />
              <CompanyInfo company={quest.company} />
              <ActivityInfo activity={quest.activity} />
              {quest.relatedQuests && <RelatedQuests quests={quest.relatedQuests} />}
            </div>

            <div className="lg:w-[380px]">
              <div className="sticky top-24 space-y-6 rounded-xl border border-border bg-surface p-6 shadow-sm">
                {participationStatus === 'idle' && (
                    <div className="space-y-3 text-center">
                      <h3 className="font-semibold text-foreground">이 퀘스트에 참여하시겠어요?</h3>
                      <Button className="w-full bg-primary text-primary-foreground hover:bg-primary-hover" onClick={handleParticipate}>
                        퀘스트 참여하기
                      </Button>
                    </div>
                )}
                {(participationStatus === 'participating' || participationStatus === 'submitted') && (
                    <SubmissionForm questId={questId} onSubmit={handleSubmission} />
                )}
                {participationStatus === 'submitted' && (
                    <div className="rounded-lg border border-border bg-primary-light p-4 text-center">
                      <p className="text-sm font-medium text-primary">✓ 제출되었습니다!</p>
                      <p className="mt-1 text-xs text-foreground-muted">리뷰 진행 중입니다. 곧 연락드리겠습니다.</p>
                    </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
  )
}