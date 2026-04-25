package com.example.QuestWork.domain.admin.service;

import com.example.QuestWork.domain.admin.dto.AdminStatsResponse;
import com.example.QuestWork.domain.admin.dto.DailyRevenueDto;
import com.example.QuestWork.domain.escrows.repository.EscrowRepository;
import com.example.QuestWork.domain.payment.repository.PaymentRepository;
import com.example.QuestWork.domain.quest.repository.QuestRepository;
import com.example.QuestWork.domain.withdraw.constant.WithdrawStatus;
import com.example.QuestWork.domain.withdraw.repository.WithdrawRequestRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class AdminStatsService {

    private final EscrowRepository escrowRepository;
    private final PaymentRepository paymentRepository;
    private final QuestRepository questRepository;
    private final WithdrawRequestRepository withdrawRepository;

    public AdminStatsResponse getAdminStats() {
        LocalDate today = LocalDate.now();
        LocalDateTime startOfToday = today.atStartOfDay();

        System.out.println("======= ADMIN DASHBOARD LOG START =======");

        // 1. 오늘 발생 수수료 수익 (기준 컬럼을 paidAt으로 변경한 쿼리 호출)
        // 이제 파라미터를 넘기지 않고 DB의 CURRENT_DATE를 사용합니다.
        BigDecimal todayFee = paymentRepository.calculateTodayFee();
        System.out.println("1. Today Fee Result (based on paidAt): " + todayFee);

        // 2. 인출 가능 잔액 (누적 수수료 합계)
        BigDecimal totalAccumulatedFee = paymentRepository.sumAllFees();
        System.out.println("2. Total Accumulated Fee Result: " + totalAccumulatedFee);

        // 3. 현재 LOCKED 상태인 에스크로 총액
        BigDecimal lockedAmount = escrowRepository.sumAmountByStatus("LOCKED");
        System.out.println("3. Total Locked Amount: " + lockedAmount);

        // 4. 출금 대기 건수
        long pendingWithdrawals = withdrawRepository.countByStatus(WithdrawStatus.REQUESTED);
        System.out.println("4. Pending Withdrawals Count: " + pendingWithdrawals);

        // 5. 최근 7일간 거래 추이
        List<DailyRevenueDto> dailyRevenues = escrowRepository.getDailyReleasedAmount(startOfToday.minusDays(7));

        // 6. 최근 12개월 월간 거래 추이
        List<DailyRevenueDto> monthlyRevenues = escrowRepository.getMonthlyReleasedAmount(startOfToday.minusMonths(12));

        System.out.println("======= ADMIN DASHBOARD LOG END =======");

        return AdminStatsResponse.builder()
                .todayFeeRevenue(todayFee != null ? todayFee : BigDecimal.ZERO)
                .availableBalance(totalAccumulatedFee != null ? totalAccumulatedFee : BigDecimal.ZERO)
                .totalLockedEscrow(lockedAmount != null ? lockedAmount : BigDecimal.ZERO)
                .pendingWithdrawalCount(pendingWithdrawals)
                .dailyRevenues(dailyRevenues != null ? dailyRevenues : new ArrayList<>())
                .monthlyRevenues(monthlyRevenues != null ? monthlyRevenues : new ArrayList<>())
                .build();
    }
}