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
    private BigDecimal todayFeeRevenue;
    private BigDecimal availableBalance;
    private BigDecimal totalLockedEscrow;
    private BigDecimal monthFeeRevenue; // [추가된 필드]
    private long pendingWithdrawalCount;

    // 2. 에스크로 현황 상세
    private BigDecimal releasedAmountToday;
    private BigDecimal refundedAmountToday;

    // 3. 그래프용 (타입을 ?로 변경하여 인터페이스 매핑 허용)
    private List<?> dailyRevenues;  // List<DailyRevenueDto>에서 변경
    private List<?> monthlyRevenues; // List<DailyRevenueDto>에서 변경
}