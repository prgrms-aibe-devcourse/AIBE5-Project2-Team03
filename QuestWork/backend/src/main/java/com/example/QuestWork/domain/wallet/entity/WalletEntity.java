package com.example.QuestWork.domain.wallet.entity;

import jakarta.persistence.*;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Entity
@Getter
@Table(name = "wallet")
@NoArgsConstructor
public class WalletEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true)
    private Long userId;

    // 💡 1. 타입을 BigDecimal로 변경하고 기본값 0 설정
    @Column(nullable = false, precision = 12, scale = 2)
    private BigDecimal balance = BigDecimal.ZERO;

    @Version
    private Long version;

    @Builder
    public WalletEntity(Long userId, BigDecimal balance) {
        this.userId = userId;
        // 💡 2. 생성자 타입도 BigDecimal로 변경
        this.balance = (balance != null) ? balance : BigDecimal.ZERO;
    }

    // 💡 3. 잔액 증가 로직 (BigDecimal 연산 적용)
    public void addBalance(BigDecimal amount) {
        if (amount == null || amount.compareTo(BigDecimal.ZERO) <= 0) return;
        this.balance = this.balance.add(amount);
    }

    // 💡 4. 잔액 차감 로직 (BigDecimal 비교 및 연산 적용)
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