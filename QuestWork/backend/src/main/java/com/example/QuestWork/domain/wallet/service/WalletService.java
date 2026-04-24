package com.example.QuestWork.domain.wallet.service;

import com.example.QuestWork.domain.member.entity.MemberProfileEntity;
import com.example.QuestWork.domain.member.repository.MemberProfileRepository;
import com.example.QuestWork.domain.wallet.entity.WalletEntity;
import com.example.QuestWork.domain.wallet.entity.WalletTransaction;
import com.example.QuestWork.domain.wallet.repository.WalletRepository;
import com.example.QuestWork.domain.wallet.repository.WalletTransactionRepository;
import com.example.QuestWork.domain.withdraw.entity.WithdrawRequest;
import com.example.QuestWork.domain.withdraw.repository.WithdrawRequestRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
public class WalletService {
    private final WalletRepository walletRepository;
    private final WalletTransactionRepository transactionRepository;
    private final WithdrawRequestRepository withdrawRequestRepository;
    private final MemberProfileRepository memberProfileRepository;

    @Transactional
    public void processSettlement(Long freelancerId, Long questId, BigDecimal originalAmount) {
        // 1. 지갑 조회 (없으면 생성)
        WalletEntity wallet = walletRepository.findByUserId(freelancerId)
                .orElseGet(() -> walletRepository.saveAndFlush(
                        WalletEntity.builder()
                                .userId(freelancerId)
                                .balance(BigDecimal.ZERO) // 💡 0L 대신 BigDecimal.ZERO
                                .build()
                ));

        // 2. 금액 계산 및 잔액 업데이트 (수수료 10% 계산)
        // 💡 BigDecimal 연산: originalAmount * 0.1
        BigDecimal fee = originalAmount.multiply(new BigDecimal("0.1"));
        BigDecimal finalAmount = originalAmount.subtract(fee);

        wallet.addBalance(finalAmount);
        walletRepository.saveAndFlush(wallet);

        // 3. 거래 내역 저장
        WalletTransaction transaction = WalletTransaction.builder()
                .wallet(wallet)
                .amount(finalAmount)
                .type("SETTLEMENT")
                .status("COMPLETED")
                .referenceId(questId)
                .description(String.format("퀘스트 %d번 정산 완료", questId))
                .build();

        transactionRepository.save(transaction);
    }

    @Transactional(readOnly = true)
    public BigDecimal getBalance(Long userId) { // 💡 반환 타입도 BigDecimal로 변경
        return walletRepository.findByUserId(userId)
                .map(WalletEntity::getBalance)
                .orElse(BigDecimal.ZERO);
    }

    @Transactional
    public void requestWithdraw(Long userId, BigDecimal amount, String bankName, String accountNumber, String accountHolder) {
        // 1. 유저의 지갑 조회
        WalletEntity wallet = walletRepository.findByUserId(userId)
                .orElseThrow(() -> new IllegalArgumentException("사용자의 지갑 정보를 찾을 수 없습니다. (ID: " + userId + ")"));

        // 2. 잔액 검증 및 차감 (compareTo 사용)
        // 💡 wallet.getBalance() < amount 대신 compareTo를 써야 합니다.
        if (wallet.getBalance().compareTo(amount) < 0) {
            throw new IllegalArgumentException("출금 가능 잔액이 부족합니다. (현재 잔액: " + wallet.getBalance() + "원)");
        }

        wallet.subtractBalance(amount);

        // 3. DB의 totalReward 업데이트
        MemberProfileEntity profile = memberProfileRepository.findByUserId(userId)
                .orElseThrow(() -> new IllegalArgumentException("프로필 정보가 없습니다."));

        BigDecimal currentTotal = profile.getTotalReward() != null ? profile.getTotalReward() : BigDecimal.ZERO;
        profile.setTotalReward(currentTotal.add(amount));

        // 4. 출금 요청 데이터 생성 및 저장
        WithdrawRequest withdrawRequest = WithdrawRequest.builder()
                .memberId(wallet.getUserId())
                .amount(amount) // 💡 WithdrawRequest 엔티티의 amount 필드도 BigDecimal이어야 합니다!
                .bankName(bankName)
                .accountNumber(accountNumber)
                .accountHolder(accountHolder)
                .status("REQUESTED")
                .requestedAt(LocalDateTime.now())
                .build();

        withdrawRequestRepository.save(withdrawRequest);
    }
}