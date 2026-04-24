package com.example.QuestWork.domain.wallet.entity;

import jakarta.persistence.*;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Getter
@NoArgsConstructor
public class WalletTransaction {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // 💡 핵심 수정: 단순 숫자가 아니라 지갑 엔티티와 관계를 맺습니다.
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "wallet_id", nullable = false)
    private WalletEntity wallet;

    private BigDecimal amount;
    private String type;
    private String status;
    private Long referenceId;
    private String description;
    private LocalDateTime createdAt = LocalDateTime.now();

    @Builder
    public WalletTransaction(WalletEntity wallet, BigDecimal amount, String type, String status, Long referenceId, String description) {
        this.wallet = wallet; // 💡 빌더에서도 객체를 받도록 수정
        this.amount = amount;
        this.type = type;
        this.status = status;
        this.referenceId = referenceId;
        this.description = description;
    }
}