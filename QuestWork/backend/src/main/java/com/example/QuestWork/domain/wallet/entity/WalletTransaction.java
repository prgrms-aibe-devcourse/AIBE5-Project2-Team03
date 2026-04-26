package com.example.QuestWork.domain.wallet.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.persistence.*;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Getter
@NoArgsConstructor
@Table(name = "wallet_transaction") // 💡 DB 테이블명이 wallet_transaction인지 꼭 확인하세요!
public class WalletTransaction {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @JsonIgnore
    @ManyToOne(fetch = FetchType.LAZY)
    // 💡 FK 에러 방지: 참조하는 엔티티인 WalletEntity에도 @Table(name="wallet")이 있어야 합니다.
    @JoinColumn(name = "wallet_id", nullable = false)
    private WalletEntity wallet;

    @Column(name = "user_id") // DB에 컬럼 추가
    private Long userId;

    @Column(name = "amount") // 💡 Unknown column 'amount' 에러 방지용 명시
    private BigDecimal amount;


    @Column(name = "type")
    private String type;

    @Column(name = "status")
    private String status;

    @Column(name = "reference_id") // 💡 DB는 보통 스네이크 케이스(reference_id)를 씁니다.
    private Long referenceId;

    @Column(name = "description")
    private String description;

    @Column(name = "created_at") // 💡 DB 컬럼명이 created_at인지 확인!
    private LocalDateTime createdAt = LocalDateTime.now();



    @Builder
    public WalletTransaction(WalletEntity wallet, BigDecimal amount, String type, String status, Long referenceId, String description,Long userId, BigDecimal originalAmount, BigDecimal fee
    ) {
        this.wallet = wallet;
        this.amount = amount;
        this.userId= userId;
        this.type = type;
        this.status = status;
        this.referenceId = referenceId;
        this.description = description;
        this.createdAt = LocalDateTime.now(); // 빌더 호출 시 시간 설정
    }
    @Transient
    @JsonProperty("userId") // ✅ JSON 키 이름을 "userId"로 강제 고정
    public Long getUserId() {
        if (this.wallet != null) {
            return this.wallet.getUserId(); // ✅ referenceId가 아니라 wallet의 userId를 반환해야 함!
        }
        return null;
    }
}