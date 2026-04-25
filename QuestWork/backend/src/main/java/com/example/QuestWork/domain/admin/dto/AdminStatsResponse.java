package com.example.QuestWork.domain.admin.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.util.List;

@Getter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AdminStatsResponse {

    // 1. 요약 카드용 지표
    private BigDecimal todayFeeRevenue;      // 오늘 발생 수수료 (오늘의 순수익)
    private BigDecimal availableBalance;     // 인출 가능 잔액 (누적된 플랫폼 순수 자산) - [NEW]
    private BigDecimal totalLockedEscrow;    // 총 예치 잔액 (현재 에스크로 보관 중인 남의 돈)
    private long pendingWithdrawalCount;     // 출금 대기 건수 (승인이 필요한 요청)

    // 2. 에스크로 현황 상세 (필요시 사용)
    private BigDecimal releasedAmountToday;  // 오늘 지급 완료액
    private BigDecimal refundedAmountToday;  // 오늘 환불액

    // 3. 그래프용 (주간 거래 규모 추이)
    private List<DailyRevenueDto> dailyRevenues;

    // 4. 그래프용 (월간 거래 규모 추이)
    private List<DailyRevenueDto> monthlyRevenues;
}

