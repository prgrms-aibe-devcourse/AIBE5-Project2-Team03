package com.example.QuestWork.domain.wallet.entity;

import jakarta.persistence.*;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Entity
@Getter
@NoArgsConstructor
@Table(name = "wallet") // 👈 DB 테이블명이 'wallet'이므로 확실히 명시
public class WalletEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // 💡 스크린샷에 'user_id'라고 되어 있으므로 name을 명시합니다.
    @Column(name = "user_id", nullable = false, unique = true)
    private Long userId;

    // 💡 스크린샷에 'balance' 확인 완료
    @Column(name = "balance", nullable = false, precision = 12, scale = 2)
    private BigDecimal balance = BigDecimal.ZERO;

    // 💡 스크린샷에 'version' 확인 완료 (낙관적 락)
    @Version
    @Column(name = "version")
    private Long version;

    @Builder
    public WalletEntity(Long userId, BigDecimal balance) {
        this.userId = userId;
        this.balance = (balance != null) ? balance : BigDecimal.ZERO;
    }

    public void addBalance(BigDecimal amount) {
        if (amount == null || amount.compareTo(BigDecimal.ZERO) <= 0) return;
        this.balance = this.balance.add(amount);
    }

    public void subtractBalance(BigDecimal amount) {
        if (amount == null) return;
        if (this.balance.compareTo(amount) < 0) {
            throw new RuntimeException("잔액이 부족합니다. 현재 잔액: " + this.balance);
        }
        this.balance = this.balance.subtract(amount);
    }
    // 💡 5. 수동 setBalance도 BigDecimal을 받도록 수정
    public void setBalance(BigDecimal balance) {
        this.balance = (balance != null) ? balance : BigDecimal.ZERO;
    }
}
