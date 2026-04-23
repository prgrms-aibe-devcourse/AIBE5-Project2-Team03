package com.example.QuestWork.domain.wallet.service;

import com.example.QuestWork.domain.wallet.entity.WalletEntity;
import com.example.QuestWork.domain.wallet.entity.WalletTransaction;
import com.example.QuestWork.domain.wallet.repository.WalletRepository;
import com.example.QuestWork.domain.wallet.repository.WalletTransactionRepository;
import com.example.QuestWork.domain.withdraw.entity.WithdrawRequest;
import com.example.QuestWork.domain.withdraw.repository.WithdrawRequestRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
public class WalletService {
    private final WalletRepository walletRepository;
    private final WalletTransactionRepository transactionRepository;
    private final WithdrawRequestRepository withdrawRequestRepository;

    @Transactional
    public void processSettlement(Long freelancerId, Long questId, Long originalAmount) {
        // 1. 지갑 조회 (없으면 생성)
        // 💡 save() 대신 saveAndFlush()를 사용하여 DB에 즉시 반영하고 ID를 받아옵니다.
        WalletEntity wallet = walletRepository.findByUserId(freelancerId)
                .orElseGet(() -> walletRepository.saveAndFlush(
                        WalletEntity.builder()
                                .userId(freelancerId)
                                .balance(0L)
                                .build()
                ));

        // 2. 금액 계산 및 잔액 업데이트
        long fee = (long) (originalAmount * 0.1);
        long finalAmount = originalAmount - fee;
        wallet.addBalance(finalAmount);

        // 더 확실하게 하기 위해 잔액 업데이트 후 한 번 더 flush 할 수 있습니다.
        walletRepository.saveAndFlush(wallet);

        // 3. 거래 내역 저장
        WalletTransaction transaction = WalletTransaction.builder()
                .wallet(wallet) // 💡 .walletId(wallet.getId()) 대신 객체 자체를 전달!
                .amount(finalAmount)
                .type("SETTLEMENT")
                .status("COMPLETED")
                .referenceId(questId)
                .description(String.format("퀘스트 %d번 정산 완료", questId))
                .build();

        transactionRepository.save(transaction);
    }
    @Transactional(readOnly = true)
    public Long getBalance(Long userId) {
        System.out.println("=== 지갑 조회 시작 ===");
        System.out.println("조회하려는 유저 ID: " + userId);

        return walletRepository.findByUserId(userId)
                .map(wallet -> {
                    System.out.println("지갑 발견! DB상의 잔액: " + wallet.getBalance());
                    return wallet.getBalance();
                })
                .orElseGet(() -> {
                    System.out.println("지갑을 찾지 못했습니다. 0원을 반환합니다.");
                    return 0L;
                });
    }
    @Transactional
    public void requestWithdraw(Long userId, Long amount, String bankName, String accountNumber, String accountHolder) {
        // 1. 유저의 지갑 조회 (지갑이 없으면 바로 에러)
        WalletEntity wallet = walletRepository.findByUserId(userId)
                .orElseThrow(() -> new IllegalArgumentException("사용자의 지갑 정보를 찾을 수 없습니다. (ID: " + userId + ")"));

        // 2. 잔액 검증 및 차감
        if (wallet.getBalance() < amount) {
            throw new IllegalArgumentException("출금 가능 잔액이 부족합니다. (현재 잔액: " + wallet.getBalance() + "원)");
        }

        // 더티 체킹에 의해 트랜잭션 종료 시 DB에 반영됩니다.
        wallet.subtractBalance(amount);

        // 3. 출금 요청 데이터 생성 및 저장
        // 엔티티의 필드명(bankName 등)과 파라미터명을 매칭시킵니다.
        WithdrawRequest withdrawRequest = WithdrawRequest.builder()
                .memberId(wallet.getUserId())  // 유저 고유 ID
                .amount(amount)                // 출금 신청 금액
                .bankName(bankName)            // 은행명 (ex: 국민)
                .accountNumber(accountNumber)  // 계좌번호
                .accountHolder(accountHolder)  // 예금주
                .status("REQUESTED")           // 초기 상태 설정
                .requestedAt(LocalDateTime.now())
                .build();

        withdrawRequestRepository.save(withdrawRequest);
    }
}
