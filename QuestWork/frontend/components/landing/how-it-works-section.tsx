'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'

interface Step {
  id: string
  title: string
  description: string
  icon: string
}

interface StepSet {
  label: string
  steps: Step[]
}

const STEP_SETS: StepSet[] = [
  {
    label: '기업용',
    steps: [
      {
        id: 'company-1',
        title: '퀘스트 등록',
        description:
          '필요한 작업을 퀘스트로 등록하고 원하는 조건과 보상을 설정하세요.',
        icon: '📝',
      },
      {
        id: 'company-2',
        title: '결과물 검토',
        description:
          '프리랜서들이 제출한 결과물을 검토하고 가장 적합한 작업을 선택하세요.',
        icon: '✅',
      },
      {
        id: 'company-3',
        title: '보상 지급',
        description:
          '선정된 프리랜서에게 안전하게 보상을 지급하고 협업을 시작하세요.',
        icon: '💰',
      },
    ],
  },
  {
    label: '프리랜서용',
    steps: [
      {
        id: 'freelancer-1',
        title: '퀘스트 탐색',
        description:
          '관심 있는 분야의 퀘스트를 찾아보고 나에게 맞는 프로젝트를 선택하세요.',
        icon: '🔍',
      },
      {
        id: 'freelancer-2',
        title: '결과물 제출',
        description:
          '퀘스트 요구사항에 맞춰 최고의 결과물을 제작하고 제출하세요.',
        icon: '🚀',
      },
      {
        id: 'freelancer-3',
        title: '보상 획득',
        description:
          '결과물이 선정되면 보상을 받고 포트폴리오에 실적을 추가하세요.',
        icon: '🏆',
      },
    ],
  },
]

export function HowItWorksSection() {
  const [activeTab, setActiveTab] = useState(0)
  const currentSteps = STEP_SETS[activeTab].steps

  return (
    <section className="bg-background px-4 py-24 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl">
        {/* Section Header */}
        <div className="mb-4 flex flex-col items-center text-center">
          <h2 className="text-balance text-4xl font-bold text-foreground sm:text-5xl">
            이용 방법
          </h2>
          <p className="mt-3 text-lg text-foreground-muted">
            QuestWork에서 기업과 프리랜서가 어떻게 협업하는지 알아보세요
          </p>
        </div>

        {/* Toggle Tabs */}
        <div className="mb-16 flex justify-center gap-2">
          {STEP_SETS.map((set, idx) => (
            <button
              key={set.label}
              onClick={() => setActiveTab(idx)}
              className={`rounded-lg px-6 py-3 font-semibold transition-all ${
                activeTab === idx
                  ? 'bg-primary text-primary-foreground shadow-md'
                  : 'bg-surface text-foreground hover:bg-surface-raised'
              }`}
            >
              {set.label}
            </button>
          ))}
        </div>

        {/* Steps Grid - 3 columns on desktop */}
        <div className="grid gap-8 md:grid-cols-3">
          {currentSteps.map((step, idx) => (
            <div key={step.id} className="flex flex-col">
              {/* Card Container */}
              <div className="flex flex-col overflow-hidden rounded-2xl border border-border bg-background shadow-sm transition-all hover:shadow-md">
                {/* Image Area with Badge */}
                <div className="relative aspect-video bg-gradient-to-br from-primary-light to-surface-raised flex items-center justify-center overflow-hidden">
                  {/* Step Badge */}
                  <div className="absolute top-4 right-4 z-10 flex h-12 w-12 items-center justify-center rounded-full bg-primary text-lg font-bold text-primary-foreground shadow-md">
                    {String(idx + 1).padStart(2, '0')}
                  </div>

                  {/* Large Icon */}
                  <div className="text-6xl opacity-80">{step.icon}</div>
                </div>

                {/* Content Area */}
                <div className="flex flex-1 flex-col gap-3 p-6">
                  <h3 className="text-xl font-bold text-foreground">
                    {step.title}
                  </h3>
                  <p className="flex-1 text-sm leading-relaxed text-foreground-muted">
                    {step.description}
                  </p>

                  {/* Optional CTA - removed for minimalism */}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
