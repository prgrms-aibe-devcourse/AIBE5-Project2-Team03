'use client'

import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'

interface Submission {
  id: string
  freelancerName: string
  questTitle: string
  questId: string
  submittedAt: string
  status: 'reviewing' | 'winner' | 'rejected'
  githubUrl: string
}

interface SubmissionModalProps {
  submission: Submission
  onClose: () => void
  onSelect: (id: string) => void
  isSelecting?: boolean
}

export function SubmissionModal({
  submission,
  onClose,
  onSelect,
  isSelecting = false,
}: SubmissionModalProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <Card className="w-full max-w-2xl border border-border">
        {/* Header */}
        <div className="border-b border-border p-6">
          <div className="flex items-start justify-between">
            <div>
              <h2 className="text-2xl font-bold text-foreground">
                제출 내용 검토
              </h2>
              <p className="mt-1 text-foreground-muted">
                {submission.freelancerName} · {submission.submittedAt}
              </p>
            </div>
            <button
              onClick={onClose}
              className="text-foreground-muted hover:text-foreground"
            >
              ✕
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Quest Info */}
          <div>
            <h3 className="text-sm font-semibold text-foreground-muted uppercase">
              퀘스트
            </h3>
            <p className="mt-2 text-lg font-medium text-foreground">
              {submission.questTitle}
            </p>
          </div>

          {/* Freelancer Info */}
          <div>
            <h3 className="text-sm font-semibold text-foreground-muted uppercase">
              프리랜서
            </h3>
            <p className="mt-2 text-lg font-medium text-foreground">
              {submission.freelancerName}
            </p>
          </div>

          {/* GitHub Repository */}
          <div>
            <h3 className="text-sm font-semibold text-foreground-muted uppercase">
              제출 내용
            </h3>
            <a
              href={submission.githubUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-2 inline-flex items-center gap-2 rounded-md border border-border px-4 py-2 text-foreground transition-colors hover:bg-surface-raised"
            >
              <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
                <path d="M8 0a8 8 0 0 0-2.53 15.59c.4.07.55-.17.55-.38v-1.34c-2.23.49-2.7-1.08-2.7-1.08-.36-.92-.88-1.17-.88-1.17-.72-.49.05-.48.05-.48.8.06 1.22.82 1.22.82.71 1.22 1.87.87 2.33.66.07-.52.28-.87.5-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48v2.2c0 .21.14.46.55.38A8 8 0 0 0 8 0Z" />
              </svg>
              GitHub 저장소 보기
            </a>
          </div>

          {/* Comparison Section */}
          <div>
            <h3 className="text-sm font-semibold text-foreground-muted uppercase">
              다른 제출과 비교
            </h3>
            <p className="mt-2 text-sm text-foreground">
              이 제출 내용을 다른 프리랜서의 제출과 비교하여 평가할 수 있습니다.
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="border-t border-border bg-surface-raised p-6 flex items-center justify-end gap-3">
          <Button variant="outline" onClick={onClose}>
            닫기
          </Button>
          <Button
            className="bg-primary text-primary-foreground hover:bg-primary-hover"
            disabled={isSelecting}
            onClick={() => onSelect(submission.id)}
          >
            {isSelecting ? '처리 중...' : '이 제출을 수상자로 선택'}
          </Button>
        </div>
      </Card>
    </div>
  )
}
