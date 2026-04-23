package com.example.QuestWork.domain.wallet.entity;

import jakarta.persistence.*;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Entity
@Getter
@Table(name = "wallet")
@NoArgsConstructor // JPA를 위한 기본 생성자
public class WalletEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true) // 유저당 지갑은 하나여야 함
    private Long userId;

    @Column(nullable = false)
    private Long balance = 0L; // 기본값을 0으로 설정하여 null 방지

    @Version
    private Long version;

    // 💡 생성 시점에 userId와 초기 잔액을 받을 수 있는 빌더 추가
    @Builder
    public WalletEntity(Long userId, Long balance) {
        this.userId = userId;
        this.balance = (balance != null) ? balance : 0L;
    }

    // 잔액 증가 로직
    public void addBalance(Long amount) {
        if (amount == null || amount <= 0) return;
        this.balance += amount;
    }

    // 잔액 차감 로직
    public void subtractBalance(Long amount) {
        if (this.balance < amount) {
            throw new RuntimeException("잔액이 부족합니다. 현재 잔액: " + this.balance);
        }
        this.balance -= amount;
    }
}