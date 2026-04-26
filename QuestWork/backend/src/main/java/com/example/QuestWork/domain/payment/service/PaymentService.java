package com.example.QuestWork.domain.payment.service;


import com.example.QuestWork.domain.member.entity.MemberProfileEntity;
import com.example.QuestWork.domain.member.repository.MemberProfileRepository;;
import com.example.QuestWork.domain.payment.entity.Payment;
import com.example.QuestWork.domain.payment.repository.PaymentRepository;
import com.example.QuestWork.domain.wallet.entity.WalletEntity;
import com.example.QuestWork.domain.wallet.entity.WalletTransaction;
import com.example.QuestWork.domain.wallet.repository.WalletRepository;
import com.example.QuestWork.domain.wallet.repository.WalletTransactionRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
public class PaymentService {
    private final PaymentRepository paymentRepository;
    private final WalletRepository walletRepository;
    private final WalletTransactionRepository transactionRepository;
    private final MemberProfileRepository memberProfileRepository;

    @Transactional
    public void processPaymentTest(Long memberId, Long questId, BigDecimal totalAmount) {
        // 1. 멤버 프로필 조회 (19번) -> 실제 유저 ID 추출 (32번)
        MemberProfileEntity profile = memberProfileRepository.findById(memberId)
                .orElseThrow(() -> new RuntimeException("멤버 프로필을 찾을 수 없습니다. ID: " + memberId));
        Long actualUserId = profile.getUser().getId();

        // 2. 수수료(10%) 및 실지급액 계산
        BigDecimal fee = totalAmount.multiply(new BigDecimal("0.1"));
        BigDecimal netAmount = totalAmount.subtract(fee);

        // 3. Payments 저장 (영수증 역할 - 수수료 내역 포함)
        // ⚠️ 주의: DB의 payments 테이블에 'fee'와 'net_amount' 컬럼이 있어야 합니다!
        paymentRepository.save(Payment.builder()
                .memberId(memberId)
                .questId(questId)
                .amount(totalAmount) // 원금
                .fee(fee)           // 수수료
                .netAmount(netAmount) // 실지급액
                .status("PAID")
                .paidAt(LocalDateTime.now())
                .createdAt(LocalDateTime.now())
                .build());

        // 4. 유저 지갑 업데이트 (32번 유저 ID로 조회)
        WalletEntity wallet = walletRepository.findByUserId(actualUserId)
                .orElseThrow(() -> new RuntimeException("유저 ID " + actualUserId + "에 해당하는 지갑을 찾을 수 없습니다."));
        wallet.addBalance(netAmount);

        // 5. WalletTransaction 저장 (통장 내역 역할 - 석민님 의견대로 수수료 관련 제거)
        // 💡 DB에 fee 컬럼이 없어도 에러가 나지 않도록 빌더에서 제외했습니다.
        transactionRepository.save(WalletTransaction.builder()
                .wallet(wallet)
                .userId(actualUserId)
                .amount(netAmount)      // 실제로 지갑에 들어온 최종 금액만 기록
                .type("SETTLEMENT")
                .status("COMPLETED")
                .referenceId(questId)
                .description(String.format("퀘스트 #%d 정산 입금 완료", questId))
                .build());
    }
}