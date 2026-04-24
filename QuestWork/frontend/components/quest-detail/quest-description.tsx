'use client'

import { Badge } from '@/components/ui/badge'

interface QuestDescriptionProps {
  description?: string
  techStack?: string[]
  // 💡 DB에서 ["github", "figma"] 처럼 배열로 올 수 있으므로 타입을 유연하게 잡습니다.
  submissionFormat?: string | string[]
}

export function QuestDescription({
                                   description = "상세 설명이 등록되지 않았습니다.",
                                   techStack = [],
                                   submissionFormat,
                                 }: QuestDescriptionProps) {

  // 💡 제출 형식이 배열로 올 경우 쉼표로 구분된 문자열로 변환해줍니다.
  const displaySubmissionFormat = Array.isArray(submissionFormat)
      ? submissionFormat.join(", ")
      : submissionFormat;

  return (
      <div className="space-y-8">
        {/* Description Section */}
        <div>
          <h2 className="mb-4 text-xl font-bold text-foreground">문제 설명</h2>
          <p className="whitespace-pre-wrap text-base leading-relaxed text-foreground-muted">
            {description}
          </p>
        </div>

        {/* Tech Stack Section */}
        <div>
          <h3 className="mb-4 text-lg font-semibold text-foreground">
            기술 스택
          </h3>
          <div className="flex flex-wrap gap-2">
            {techStack && techStack.length > 0 ? (
                techStack.map((tech) => (
                    <Badge
                        key={tech}
                        className="bg-primary-light text-primary"
                    >
                      {tech}
                    </Badge>
                ))
            ) : (
                <p className="text-sm text-foreground-muted">등록된 기술 스택이 없습니다.</p>
            )}
          </div>
        </div>

        {/* Submission Format Section */}
        {displaySubmissionFormat && (
            <div>
              <h3 className="mb-4 text-lg font-semibold text-foreground">
                제출 형식
              </h3>
              <div className="rounded-lg border border-border bg-surface p-4">
                <p className="whitespace-pre-wrap text-sm text-foreground-muted">
                  {displaySubmissionFormat}
                </p>
              </div>
            </div>
        )}
      </div>
  )
}