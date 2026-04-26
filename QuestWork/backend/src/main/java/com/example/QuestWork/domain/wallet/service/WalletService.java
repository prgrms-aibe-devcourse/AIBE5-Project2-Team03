package com.example.QuestWork.domain.wallet.service;

import com.example.QuestWork.domain.member.entity.MemberProfileEntity;
import com.example.QuestWork.domain.member.repository.MemberProfileRepository;
import com.example.QuestWork.domain.payment.entity.Payment;
import com.example.QuestWork.domain.payment.repository.PaymentRepository;
import com.example.QuestWork.domain.wallet.entity.WalletEntity;
import com.example.QuestWork.domain.wallet.entity.WalletTransaction;
import com.example.QuestWork.domain.wallet.repository.WalletRepository;
import com.example.QuestWork.domain.wallet.repository.WalletTransactionRepository;
import com.example.QuestWork.domain.withdraw.constant.WithdrawStatus;
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
    private final PaymentRepository paymentRepository;

    /**
     * 1. 출금 신청 (사용자)
     */
    @Transactional
    public void requestWithdraw(Long userId, BigDecimal amount, String bankName, String accountNumber, String accountHolder) {
        WalletEntity wallet = walletRepository.findByUserId(userId)
                .orElseThrow(() -> new IllegalArgumentException("지갑 정보를 찾을 수 없습니다."));

        if (wallet.getBalance().compareTo(amount) < 0) {
            throw new IllegalArgumentException("출금 가능 잔액이 부족합니다.");
        }

        WithdrawRequest withdrawRequest = WithdrawRequest.builder()
                .memberId(userId)
                .amount(amount)
                .bankName(bankName)
                .accountNumber(accountNumber)
                .accountHolder(accountHolder)
                .status(WithdrawStatus.REQUESTED)
                .requestedAt(LocalDateTime.now())
                .build();

        withdrawRequestRepository.save(withdrawRequest);
    }

    /**
     * 2. 관리자 승인 (실제 돈 차감 및 이력 생성)
     */
    @Transactional
    public void approveWithdraw(Long requestId) {
        WithdrawRequest request = withdrawRequestRepository.findById(requestId)
                .orElseThrow(() -> new IllegalArgumentException("존재하지 않는 요청입니다."));

        if (request.getStatus() != WithdrawStatus.REQUESTED) {
            throw new IllegalStateException("이미 처리된 요청입니다.");
        }

        WalletEntity wallet = walletRepository.findByUserId(request.getMemberId())
                .orElseGet(() -> walletRepository.save(WalletEntity.builder()
                        .userId(request.getMemberId())
                        .balance(BigDecimal.ZERO)
                        .build()));

        MemberProfileEntity profile = memberProfileRepository.findByUserId(request.getMemberId())
                .orElseThrow(() -> new IllegalArgumentException("프로필 정보가 없습니다."));

        BigDecimal withdrawAmount = request.getAmount();
        if (wallet.getBalance().compareTo(withdrawAmount) < 0) {
            throw new IllegalStateException("잔액 부족");
        }

        // 데이터 업데이트
        wallet.subtractBalance(withdrawAmount);
        BigDecimal currentTotal = profile.getTotalReward() != null ? profile.getTotalReward() : BigDecimal.ZERO;
        profile.setTotalReward(currentTotal.add(withdrawAmount));
        request.setStatus(WithdrawStatus.COMPLETED);

        // ✅ 출금 이력 저장 (referenceId에 출금요청 ID 저장)
        transactionRepository.save(WalletTransaction.builder()
                .wallet(wallet)
                .userId(request.getMemberId())
                .amount(withdrawAmount.negate())
                .originalAmount(BigDecimal.ZERO)
                .fee(BigDecimal.ZERO)
                .type("WITHDRAW")
                .status("COMPLETED")
                .referenceId(request.getId()) // 👈 여기서 request 사용!
                .description(String.format("출금 승인: %s %s", request.getBankName(), request.getAccountNumber()))
                .build());
    }

    /**
     * 3. 퀘스트 정산 처리 (퀘스트 완료 시 호출)
     */
    @Transactional
    public void processSettlement(Long freelancerId, Long questId, BigDecimal originalAmount) {
        WalletEntity wallet = walletRepository.findByUserId(freelancerId)
                .orElseGet(() -> walletRepository.saveAndFlush(
                        WalletEntity.builder()
                                .userId(freelancerId)
                                .balance(BigDecimal.ZERO)
                                .build()
                ));

        BigDecimal feeRate = new BigDecimal("0.1");
        BigDecimal fee = originalAmount.multiply(feeRate);
        BigDecimal finalAmount = originalAmount.subtract(fee);

        wallet.addBalance(finalAmount);
        walletRepository.save(wallet);

        // Payment에서 originalAmount와 fee 가져오기 (없으면 계산된 값 사용)
        Payment payment = paymentRepository.findByQuestIdAndMemberId(questId, freelancerId).orElse(null);
        BigDecimal paymentOriginalAmount = payment != null ? payment.getAmount() : originalAmount;
        BigDecimal paymentFee = payment != null ? payment.getFee() : fee;

        // ✅ 정산 이력 저장 (referenceId에 퀘스트 ID 저장)
        transactionRepository.save(WalletTransaction.builder()
                .wallet(wallet)
                .userId(freelancerId)
                .amount(finalAmount)
                .originalAmount(paymentOriginalAmount)
                .fee(paymentFee)
                .type("SETTLEMENT")
                .status("COMPLETED")
                .referenceId(questId) // 👈 여기서 파라미터 questId 바로 사용!
                .description(String.format("퀘스트 %d번 정산 완료 (원금: %s, 수수료: %s)",
                        questId, paymentOriginalAmount.toString(), paymentFee.toString()))
                .build());
    }

    @Transactional(readOnly = true)
    public BigDecimal getBalance(Long userId) {
        return walletRepository.findByUserId(userId)
                .map(WalletEntity::getBalance)
                .orElse(BigDecimal.ZERO);
    }
    // WalletService.java 에 추가

    /**
     * [테스트용] 퀘스트 완료 시뮬레이션 (입금 로직)
     * @param userId 돈을 받을 유저 ID
     * @param questId 참조할 퀘스트 ID
     * @param originalAmount 수수료 떼기 전 원금 (예: 10000)
     */
    @Transactional
    public void processSettlementTest(Long userId, Long questId, BigDecimal originalAmount) {
        // 1. 유저 지갑 조회 (없으면 생성)
        WalletEntity wallet = walletRepository.findByUserId(userId)
                .orElseGet(() -> walletRepository.save(WalletEntity.builder()
                        .userId(userId)
                        .balance(BigDecimal.ZERO)
                        .build()));

        // 2. 수수료 계산 (10%) 및 실지급액 산출
        BigDecimal fee = originalAmount.multiply(new BigDecimal("0.1"));
        BigDecimal finalAmount = originalAmount.subtract(fee);

        // 3. 지갑 잔액(Balance) 업데이트
        wallet.addBalance(finalAmount);

        // Payment에서 originalAmount와 fee 가져오기 (없으면 계산된 값 사용)
        Payment payment = paymentRepository.findByQuestIdAndMemberId(questId, userId).orElse(null);
        BigDecimal paymentOriginalAmount = payment != null ? payment.getAmount() : originalAmount;
        BigDecimal paymentFee = payment != null ? payment.getFee() : fee;

        // 4. 지갑 거래 이력(Transaction) 생성 -> 이게 있어야 프론트 테이블에 나옵니다!
        transactionRepository.save(WalletTransaction.builder()
                .wallet(wallet)
                .userId(userId)           // 💡 아까 추가한 그 컬럼!
                .amount(finalAmount)      // 💡 실제 입금액 (+)
                .originalAmount(paymentOriginalAmount)
                .fee(paymentFee)
                .type("SETTLEMENT")       // 💡 타입은 정산
                .status("COMPLETED")
                .referenceId(questId)     // 💡 여기서 퀘스트 번호가 referenceId가 됨!
                .description(String.format("퀘스트 #%d 정산 완료 (원금: %s, 수수료: %s)",
                        questId, paymentOriginalAmount, paymentFee))
                .build());
    }
}