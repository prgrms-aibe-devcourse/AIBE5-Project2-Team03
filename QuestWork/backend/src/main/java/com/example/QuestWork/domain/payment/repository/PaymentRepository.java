package com.example.QuestWork.domain.payment.repository;


import com.example.QuestWork.domain.admin.dto.DailyRevenueDto;
import com.example.QuestWork.domain.payment.entity.Payment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

public interface PaymentRepository extends JpaRepository<Payment, Long> {

    Optional<Payment> findByQuestIdAndMemberId(Long questId, Long memberId);

    @Query("SELECT SUM(p.fee) FROM Payment p WHERE DATE(p.paidAt) = CURRENT_DATE")
    BigDecimal calculateTodayFee();

    // 전체 누적 수익: 상태가 RELEASED인 모든 수수료 합계
    @Query(value = "SELECT SUM(p.fee) " +
            "FROM payments p " +
            "JOIN escrows e ON p.quest_id = e.quest_id " +
            "WHERE e.status = 'RELEASED'",
            nativeQuery = true)
    BigDecimal sumAllFees();

    // [수정] 이번 달 수익: 4월에 결제(paid_at)되었고, 현재 RELEASED 상태인 모든 수수료
    @Query(value = "SELECT SUM(p.fee) " +
            "FROM payments p " +
            "JOIN escrows e ON p.quest_id = e.quest_id " +
            "WHERE e.status = 'RELEASED' " +
            "  AND DATE_FORMAT(p.paid_at, '%Y-%m') = '2026-04'", // 날짜 기준을 paid_at으로!
            nativeQuery = true)
    BigDecimal calculateMonthFee();

    // --- 그래프용 인터페이스 프로젝션 메서드 ---

    // 1. 주간 데이터 (최근 7일)
    @Query(value = "SELECT DATE_FORMAT(paid_at, '%Y-%m-%d') as date, " +
            "SUM(amount) as totalAmount, " +
            "SUM(fee) as amount " +
            "FROM payments " +
            "WHERE paid_at >= DATE_SUB(CURDATE(), INTERVAL 6 DAY) " +
            "GROUP BY DATE_FORMAT(paid_at, '%Y-%m-%d') " +
            "ORDER BY date ASC", nativeQuery = true)
    List<DailyRevenueDto.DailyRevenueProjection> getWeeklyRevenueStats();

    // 2. 월간 데이터 (전체 또는 최근 6개월)
    @Query(value = "SELECT " +
            "  DATE_FORMAT(p.paid_at, '%Y-%m') as date, " +
            "  SUM(e.amount) as totalAmount, " +
            "  SUM(p.fee) as amount " +
            "FROM payments p " +
            "JOIN escrows e ON p.quest_id = e.quest_id " +
            "WHERE p.status = 'PAID' " +
            "GROUP BY DATE_FORMAT(p.paid_at, '%Y-%m') " +
            "ORDER BY date ASC", nativeQuery = true)
    List<DailyRevenueDto.DailyRevenueProjection> getMonthlyRevenueStats();
}