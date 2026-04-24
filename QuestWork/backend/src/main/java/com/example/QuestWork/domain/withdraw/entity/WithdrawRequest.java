package com.example.QuestWork.domain.withdraw.entity;

import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "withdraw_requests")
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED) // JPA를 위한 기본 생성자 (접근 제한으로 안전성 확보)
@AllArgsConstructor
@Builder
public class WithdrawRequest {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // 프론트에서 보낸 users 테이블의 PK(32)를 저장할 곳
    @Column(name = "member_id", nullable = false)
    private Long memberId;

    @Column(nullable = false)
    private BigDecimal amount;

    @Column(name = "bank_name", length = 50, nullable = false)
    private String bankName;

    @Column(name = "account_number", length = 100, nullable = false)
    private String accountNumber;

    @Column(name = "account_holder", length = 50, nullable = false)
    private String accountHolder;

    // 빌더 사용 시에도 "REQUESTED"가 기본값으로 들어가도록 설정
    @Builder.Default
    @Column(length = 30, nullable = false)
    private String status = "REQUESTED";

    @Column(name = "requested_at", nullable = false, updatable = false)
    private LocalDateTime requestedAt;

    @Column(name = "processed_at")
    private LocalDateTime processedAt;

    // 생성 시점에 시간을 자동으로 기록하기 위한 편의 메서드
    @PrePersist
    protected void onCreate() {
        if (this.requestedAt == null) {
            this.requestedAt = LocalDateTime.now();
        }
    }
}