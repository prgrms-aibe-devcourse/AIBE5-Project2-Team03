package com.example.QuestWork.domain.wallet.repository;

import com.example.QuestWork.domain.wallet.entity.WalletTransaction;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

// 거래 내역 레포지토리
public interface WalletTransactionRepository extends JpaRepository<WalletTransaction, Long> {
    // 특정 지갑의 내역만 모아보고 싶을 때 사용할 메서드
    List<WalletTransaction> findByWalletIdOrderByCreatedAtDesc(Long walletId);

    // 아까 정산 이력 조회할 때 필요한 메서드
    List<WalletTransaction> findByType(String type);

    List<WalletTransaction> findAllByOrderByCreatedAtDesc();
}
