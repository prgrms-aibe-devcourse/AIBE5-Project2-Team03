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

        // 1. 오늘 수익
        BigDecimal todayFee = paymentRepository.calculateTodayFee();
        // 2. 이번 달 수익
        BigDecimal monthFee = paymentRepository.calculateMonthFee();
        // 3. 인출 가능 잔액 (누적 수익)
        BigDecimal totalAccumulatedFee = paymentRepository.sumAllFees();
        // 4. 예치 잔액 (에스크로)
        BigDecimal lockedAmount = escrowRepository.sumAmountByStatus("LOCKED");
        // 5. 출금 대기 건수
        long pendingWithdrawals = withdrawRepository.countByStatus(WithdrawStatus.REQUESTED);

        // [수정] 인터페이스 프로젝션을 사용하여 주간/월간 데이터 가져오기
        // Repository의 반환 타입이 List<DailyRevenueProjection>이어야 합니다.
        List<DailyRevenueDto.DailyRevenueProjection> dailyRevenues = paymentRepository.getWeeklyRevenueStats();
        List<DailyRevenueDto.DailyRevenueProjection> monthlyRevenues = paymentRepository.getMonthlyRevenueStats();

        return AdminStatsResponse.builder()
                .todayFeeRevenue(todayFee != null ? todayFee : BigDecimal.ZERO)
                .monthFeeRevenue(monthFee != null ? monthFee : BigDecimal.ZERO)
                .availableBalance(totalAccumulatedFee != null ? totalAccumulatedFee : BigDecimal.ZERO)
                .totalLockedEscrow(lockedAmount != null ? lockedAmount : BigDecimal.ZERO)
                .pendingWithdrawalCount(pendingWithdrawals)
                .dailyRevenues(dailyRevenues)     // 인터페이스 리스트 전달
                .monthlyRevenues(monthlyRevenues) // 인터페이스 리스트 전달
                .build();
    }
}