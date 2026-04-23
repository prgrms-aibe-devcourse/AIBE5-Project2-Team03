'use client'

interface CompanyInfoProps {
  // 💡 company 자체를 선택적(optional)으로 바꾸거나 기본값을 줍니다.
  company?: {
    name: string
    joinDate: string
    questCount: number
    totalPayout: string
    description?: string
  }
}

// 💡 기본값을 설정하여 데이터가 없을 때 undefined 에러를 방지합니다.
export function CompanyInfo({
                              company = {
                                name: '정보 없음',
                                joinDate: '-',
                                questCount: 0,
                                totalPayout: '₩0'
                              }
                            }: CompanyInfoProps) {
  return (
      <div className="space-y-4 rounded-xl border border-border bg-surface p-6">
        <h3 className="text-lg font-bold text-foreground">기업 정보</h3>

        <div className="space-y-3 text-sm">
          <div className="flex justify-between">
            <span className="text-foreground-muted">기업명</span>
            {/* 💡 ?. 을 사용하여 안전하게 접근합니다. */}
            <span className="font-semibold text-foreground">{company?.name}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-foreground-muted">가입일</span>
            <span className="font-semibold text-foreground">{company?.joinDate}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-foreground-muted">등록 퀘스트 수</span>
            <span className="font-semibold text-foreground">{company?.questCount}개</span>
          </div>
          <div className="flex justify-between">
            <span className="text-foreground-muted">총 지급 보상</span>
            <span className="font-semibold text-primary">{company?.totalPayout}</span>
          </div>
        </div>

        {company?.description && (
            <div className="border-t border-border pt-3">
              <p className="text-sm text-foreground-muted">{company.description}</p>
            </div>
        )}
      </div>
  )
}