package com.example.QuestWork.domain.admin.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;

import java.math.BigDecimal;

@Getter
@AllArgsConstructor
public class DailyRevenueDto {
    private String date;
    private BigDecimal totalAmount; // 추가: 전체 결제 규모 (GMV)
    private BigDecimal amount;      // 기존: 플랫폼 순수익 (Fee)

    // JPA/Hibernate가 Native Query 결과를 담을 때 사용하는 수동 생성자
    public DailyRevenueDto(Object date, BigDecimal totalAmount, BigDecimal amount) {
        // 1. 날짜 변환
        this.date = (date != null) ? String.valueOf(date) : "";

        // 2. 전체 거래액 변환 (null 체크)
        this.totalAmount = (totalAmount != null) ? totalAmount : BigDecimal.ZERO;

        // 3. 순수익(수수료) 변환 (null 체크)
        this.amount = (amount != null) ? amount : BigDecimal.ZERO;
    }
    public interface DailyRevenueProjection {
        String getDate();
        Long getTotalAmount();
        Long getAmount();
    }
}