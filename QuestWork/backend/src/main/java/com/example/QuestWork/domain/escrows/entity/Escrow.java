package com.example.QuestWork.domain.escrows.entity;

import jakarta.persistence.*;
import lombok.*;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "escrows")
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@AllArgsConstructor
@Builder
public class Escrow {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // quest_id는 UNIQUE NOT NULL이므로 OneToOne으로 설정
    @Column(name = "quest_id", unique = true, nullable = false)
    private Long questId;

    // manager_id (돈을 예치한 사람)
    @Column(name = "manager_id", nullable = false)
    private Long managerId;

    // decimal(12,2)는 BigDecimal로 매핑
    @Column(nullable = false, precision = 12, scale = 2)
    private BigDecimal amount;

    // 기본값이 'LOCKED'이므로 초기값 설정
    @Builder.Default
    @Column(nullable = false, length = 30)
    private String status = "LOCKED";

    @Column(name = "deposited_at", nullable = false)
    private LocalDateTime depositedAt;

    @Column(name = "released_at")
    private LocalDateTime releasedAt;

    // --- 편의 메서드 (비즈니스 로직) ---

    /**
     * 상금 지급 확정 시 호출 (LOCKED -> RELEASED)
     */
    public void release() {
        this.status = "RELEASED";
        this.releasedAt = LocalDateTime.now();
    }

    /**
     * 퀘스트 취소 시 호출 (LOCKED -> REFUNDED)
     */
    public void refund() {
        this.status = "REFUNDED";
    }
}