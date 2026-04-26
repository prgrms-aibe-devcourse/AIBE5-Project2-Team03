package com.example.QuestWork.domain.wallet.repository;

import com.example.QuestWork.domain.wallet.entity.WalletTransaction;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface WalletTransactionRepository extends JpaRepository<WalletTransaction, Long> {
    List<WalletTransaction> findByWalletIdOrderByCreatedAtDesc(Long walletId);
    List<WalletTransaction> findByType(String type);
    List<WalletTransaction> findAllByOrderByCreatedAtDesc();
    List<WalletTransaction> findByUserIdOrderByCreatedAtDesc(Long userId);
}
