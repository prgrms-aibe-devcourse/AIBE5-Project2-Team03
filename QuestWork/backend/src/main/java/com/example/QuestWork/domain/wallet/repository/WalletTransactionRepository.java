package com.example.QuestWork.domain.wallet.repository;

import com.example.QuestWork.domain.wallet.entity.WalletTransaction;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

// 거래 내역 레포지토리
public interface WalletTransactionRepository extends JpaRepository<WalletTransaction, Long> {
    // 특정 지갑의 모든 거래 내역을 최신순으로 조회 (마이페이지용)
    List<WalletTransaction> findByWalletIdOrderByCreatedAtDesc(Long walletId);
}
