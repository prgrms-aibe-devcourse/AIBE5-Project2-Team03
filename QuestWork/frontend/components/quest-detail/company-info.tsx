'use client'

interface CompanyInfoProps {
  company: {
    name: string
    joinDate: string
    questCount: number
    totalPayout: string
    description?: string
  }
}

export function CompanyInfo({ company }: CompanyInfoProps) {
  return (
    <div className="space-y-4 rounded-xl border border-border bg-surface p-6">
      <h3 className="text-lg font-bold text-foreground">기업 정보</h3>
      
      <div className="space-y-3 text-sm">
        <div className="flex justify-between">
          <span className="text-foreground-muted">기업명</span>
          <span className="font-semibold text-foreground">{company.name}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-foreground-muted">가입일</span>
          <span className="font-semibold text-foreground">{company.joinDate}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-foreground-muted">등록 퀘스트 수</span>
          <span className="font-semibold text-foreground">{company.questCount}개</span>
        </div>
        <div className="flex justify-between">
          <span className="text-foreground-muted">총 지급 보상</span>
          <span className="font-semibold text-primary">{company.totalPayout}</span>
        </div>
      </div>

      {company.description && (
        <div className="border-t border-border pt-3">
          <p className="text-sm text-foreground-muted">{company.description}</p>
        </div>
      )}
    </div>
  )
}
