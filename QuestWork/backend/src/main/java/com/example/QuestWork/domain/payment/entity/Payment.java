package com.example.QuestWork.domain.payment.entity;

import jakarta.persistence.*;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Getter
@NoArgsConstructor
@Table(name = "payments")
public class Payment {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "member_id")
    private Long memberId;

    @Column(name = "quest_id")
    private Long questId;

    @Column(name = "amount")
    private BigDecimal amount;

    @Column(name = "fee")
    private BigDecimal fee;

    @Column(name = "net_amount")
    private BigDecimal netAmount;

    @Column(name = "status")
    private String status;

    @Column(name = "paid_at")
    private LocalDateTime paidAt;

    @Column(name = "created_at")
    private LocalDateTime createdAt;

    @Builder
    public Payment(Long memberId, Long questId, BigDecimal amount, BigDecimal fee, BigDecimal netAmount, String status, LocalDateTime paidAt, LocalDateTime createdAt) {
        this.memberId = memberId;
        this.questId = questId;
        this.amount = amount;
        this.fee = fee;
        this.netAmount = netAmount;
        this.status = status;
        this.paidAt = paidAt;
        this.createdAt = createdAt;
    }
}