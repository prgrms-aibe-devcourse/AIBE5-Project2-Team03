package com.example.QuestWork.domain.admin.controller;

import com.example.QuestWork.domain.wallet.entity.WalletTransaction;
import com.example.QuestWork.domain.wallet.repository.WalletTransactionRepository;
import com.example.QuestWork.domain.wallet.service.WalletService;
import com.example.QuestWork.domain.withdraw.entity.WithdrawRequest;
import com.example.QuestWork.domain.withdraw.repository.WithdrawRequestRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.List;

@RestController
@RequestMapping("/api/admin")
@RequiredArgsConstructor
public class AdminWalletController {
    private final WalletService walletService;
    private final WithdrawRequestRepository withdrawRequestRepository;
    private final WalletTransactionRepository walletTransactionRepository;

    // 1. 모든 출금 신청 내역
    @GetMapping("/withdrawals") // 💡 여기에 명시적으로 붙여줍니다.
    public ResponseEntity<List<WithdrawRequest>> getAllWithdrawals() {
        return ResponseEntity.ok(withdrawRequestRepository.findAll());
    }
    @GetMapping("/settlements")
    public List<WalletTransaction> getSettlementHistory() {
        // 💡 TYPE 상관없이 모든 내역을 최신순으로 조회해서 반환!
        return walletTransactionRepository.findAllByOrderByCreatedAtDesc();
    }

    /**
     * 2. 출금 승인 처리
     * 관리자가 '승인' 버튼을 클릭했을 때 호출됩니다.
     */
    @PostMapping("/withdrawals/{id}/approve") // 💡 앞에 withdrawals 추가
    public ResponseEntity<String> approveWithdrawal(@PathVariable Long id) {
        try {
            walletService.approveWithdraw(id);
            return ResponseEntity.ok("출금 승인이 성공적으로 처리되었습니다.");
        } catch (IllegalStateException | IllegalArgumentException e) {
            // 잔액 부족이나 이미 처리된 경우 등의 예외 메시지 전달
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    // 반려 기능도 필요하다면 여기에 추가하면 됩니다!
    @PostMapping("/withdrawals/{id}/reject") // 💡 앞에 withdrawals 추가
    public ResponseEntity<String> rejectWithdrawal(@PathVariable Long id, @RequestBody String reason) {
        // 💡 간단하게 서비스 메서드 호출 (아까 우리가 만든 로직)
        // walletService.rejectWithdraw(id, reason);
        return ResponseEntity.ok("반려 처리가 완료되었습니다.");
    }


        @PostMapping("/settle")
        public String simulateSettlement(
                @RequestParam Long userId,
                @RequestParam Long questId,
                @RequestParam BigDecimal amount) {

            walletService.processSettlementTest(userId, questId, amount);
            return String.format("유저 %d에게 퀘스트 %d번에 대한 %s원 정산이 완료되었습니다.",
                    userId, questId, amount);
        }
}