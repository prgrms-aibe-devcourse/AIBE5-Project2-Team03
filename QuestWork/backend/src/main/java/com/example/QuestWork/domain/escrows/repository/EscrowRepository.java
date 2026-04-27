package com.example.QuestWork.domain.escrows.repository;

import com.example.QuestWork.domain.admin.dto.DailyRevenueDto;
import com.example.QuestWork.domain.escrows.entity.Escrow;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

public interface EscrowRepository extends JpaRepository<Escrow, Long> {

    Optional<Escrow> findByQuestId(Long questId);

    boolean existsByQuestId(Long questId);

    // 특정 상태(LOCKED 등)인 에스크로 금액의 총합
    @Query("SELECT SUM(e.amount) FROM Escrow e WHERE e.status = :status")
    BigDecimal sumAmountByStatus(@Param("status") String status);

    // 최근 7일간의 날짜별 지급 완료(RELEASED) 금액 합계 (그래프용)
    // DB가 MySQL이라면 DATE_FORMAT을 사용합니다.
    // dto 뒤에 실제 클래스명(예: DailyRevenueDto)까지 꼭 붙여줘야 해요!
    @Query("SELECT new com.example.QuestWork.domain.admin.dto.DailyRevenueDto(" +
            "  FUNCTION('DATE_FORMAT', e.releasedAt, '%Y-%m-%d'), " +
            "  SUM(e.amount), " +
            "  SUM(e.amount)) " +
            "FROM Escrow e " +
            "WHERE e.status = 'RELEASED' AND e.releasedAt >= :startDate " +
            "GROUP BY FUNCTION('DATE_FORMAT', e.releasedAt, '%Y-%m-%d') " +
            "ORDER BY FUNCTION('DATE_FORMAT', e.releasedAt, '%Y-%m-%d') ASC")
    List<DailyRevenueDto> getDailyReleasedAmount(@Param("startDate") LocalDateTime startDate);

    // 최근 12개월간의 월별 지급 완료(RELEASED) 금액 합계 (월간 그래프용)
    @Query("SELECT new com.example.QuestWork.domain.admin.dto.DailyRevenueDto(" +
            "  FUNCTION('DATE_FORMAT', e.releasedAt, '%Y-%m'), " +
            "  SUM(e.amount), " +
            "  SUM(e.amount)) " +
            "FROM Escrow e " +
            "WHERE e.status = 'RELEASED' AND e.releasedAt >= :startDate " +
            "GROUP BY FUNCTION('DATE_FORMAT', e.releasedAt, '%Y-%m') " +
            "ORDER BY FUNCTION('DATE_FORMAT', e.releasedAt, '%Y-%m') ASC")
    List<DailyRevenueDto> getMonthlyReleasedAmount(@Param("startDate") LocalDateTime startDate);
}