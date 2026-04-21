'use client'

interface ActivityInfoProps {
  activity: {
    participantCount: number
    submissionCount: number
    reviewingCount: number
    selectedCount: number
  }
}

export function ActivityInfo({ activity }: ActivityInfoProps) {
  return (
    <div className="space-y-4 rounded-xl border border-border bg-surface p-6">
      <h3 className="text-lg font-bold text-foreground">퀘스트 활동 정보</h3>
      
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        <div className="flex flex-col gap-1">
          <span className="text-xs text-foreground-muted">참여자 수</span>
          <span className="text-xl font-bold text-primary">{activity.participantCount}명</span>
        </div>
        <div className="flex flex-col gap-1">
          <span className="text-xs text-foreground-muted">제출된 결과물</span>
          <span className="text-xl font-bold text-foreground">{activity.submissionCount}건</span>
        </div>
        <div className="flex flex-col gap-1">
          <span className="text-xs text-foreground-muted">검토 중</span>
          <span className="text-xl font-bold text-foreground">{activity.reviewingCount}건</span>
        </div>
        <div className="flex flex-col gap-1">
          <span className="text-xs text-foreground-muted">최종 선정</span>
          <span className="text-xl font-bold text-foreground">{activity.selectedCount}건</span>
        </div>
      </div>
    </div>
  )
}
