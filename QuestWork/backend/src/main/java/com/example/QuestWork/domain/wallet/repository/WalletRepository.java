package com.example.QuestWork.domain.wallet.repository;

import com.example.QuestWork.domain.wallet.entity.WalletEntity;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

// 지갑 레포지토리
public interface WalletRepository extends JpaRepository<WalletEntity, Long> {
    // 유저 ID로 지갑을 찾아야 정산이 가능합니다.
    Optional<WalletEntity> findByUserId(Long userId);
}

