package com.example.QuestWork.domain.wallet.controller;

import com.example.QuestWork.domain.wallet.dto.SettlementRequest;
import com.example.QuestWork.domain.wallet.dto.WalletResponse;
import com.example.QuestWork.domain.wallet.entity.WalletTransaction;
import com.example.QuestWork.domain.wallet.repository.WalletTransactionRepository;
import com.example.QuestWork.domain.wallet.service.WalletService;
import com.example.QuestWork.domain.withdraw.dto.WithdrawRequestDto;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.List;

@RestController
@RequestMapping("/api/settlement")
@RequiredArgsConstructor
public class WalletController {

    private final WalletService walletService;
    private final WalletTransactionRepository walletTransactionRepository;

    @PostMapping("/approve")
    public ResponseEntity<String> approveSettlement(@RequestBody SettlementRequest request) {
        walletService.processSettlement(
                request.getFreelancerId(),
                request.getQuestId(),
                BigDecimal.valueOf(request.getOriginalAmount())
        );
        return ResponseEntity.ok("정산 처리가 성공적으로 완료되었습니다.");
    }

    @GetMapping("/wallet/{userId}")
    public ResponseEntity<WalletResponse> getWallet(@PathVariable Long userId) {
        BigDecimal balance = walletService.getBalance(userId);
        return ResponseEntity.ok(new WalletResponse(userId, balance));
    }

    @GetMapping("/transactions/{userId}")
    public ResponseEntity<List<WalletTransaction>> getTransactions(@PathVariable Long userId) {
        List<WalletTransaction> txs = walletTransactionRepository.findByUserIdOrderByCreatedAtDesc(userId);
        return ResponseEntity.ok(txs);
    }

    @PostMapping("/withdraw")
    public ResponseEntity<String> requestWithdraw(@RequestBody WithdrawRequestDto request) {
        try {
            walletService.requestWithdraw(
                    request.getUserId(),
                    request.getAmount(),
                    request.getBankName(),
                    request.getAccountNumber(),
                    request.getAccountHolder()
            );
            return ResponseEntity.ok("출금 신청이 성공적으로 접수되었습니다.");
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body("출금 처리 중 서버 오류가 발생했습니다.");
        }
    }
}
